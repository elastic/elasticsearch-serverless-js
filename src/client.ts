/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License") you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import process from 'node:process'
import { ConnectionOptions as TlsConnectionOptions } from 'node:tls'
import { URL } from 'node:url'
import buffer from 'node:buffer'
import os from 'node:os'
import {
  Transport,
  UndiciConnection,
  CloudConnectionPool,
  Serializer,
  Diagnostic,
  errors,
  BaseConnectionPool
} from '@elastic/transport'
import {
  HttpAgentOptions,
  UndiciAgentOptions,
  agentFn,
  generateRequestIdFn,
  BasicAuth,
  ApiKeyAuth,
  BearerAuth,
  Context
} from '@elastic/transport/lib/types'
import { RedactionOptions } from '@elastic/transport/lib/Transport'
import BaseConnection, { prepareHeaders } from '@elastic/transport/lib/connection/BaseConnection'
import Helpers from './helpers'
import API from './api'
import packageJson from '../package.json'
import transportPackageJson from '@elastic/transport/package.json'

console.warn('This package is deprecated and no longer being supported or maintained. All Elasticsearch serverless functionality has been merged back into @elastic/elasticsearch.')

const kChild = Symbol('elasticsearchjs-child')
const kInitialOptions = Symbol('elasticsearchjs-initial-options')
let clientVersion: string = packageJson.version
/* istanbul ignore next */
if (clientVersion.includes('-')) {
  // clean prerelease
  clientVersion = clientVersion.slice(0, clientVersion.indexOf('-')) + 'p'
}
const [clientVersionNoMeta, apiVersion] = clientVersion.split('+')
let transportVersion: string = transportPackageJson.version
/* istanbul ignore next */
if (transportVersion.includes('-')) {
  // clean prerelease
  transportVersion = transportVersion.slice(0, transportVersion.indexOf('-')) + 'p'
}
const nodeVersion = process.versions.node

export interface NodeOptions {
  url: URL
  id?: string
  agent?: HttpAgentOptions | UndiciAgentOptions
  ssl?: TlsConnectionOptions
  headers?: Record<string, any>
  roles?: {
    master: boolean
    data: boolean
    ingest: boolean
    ml: boolean
  }
}

export interface ClientOptions {
  node?: string | string[] | NodeOptions | NodeOptions[]
  nodes?: string | string[] | NodeOptions | NodeOptions[]
  Connection?: typeof BaseConnection
  ConnectionPool?: typeof BaseConnectionPool
  Transport?: typeof Transport
  Serializer?: typeof Serializer
  maxRetries?: number
  requestTimeout?: number
  pingTimeout?: number
  resurrectStrategy?: 'ping' | 'optimistic' | 'none'
  compression?: boolean
  tls?: TlsConnectionOptions
  agent?: HttpAgentOptions | UndiciAgentOptions | agentFn | false
  headers?: Record<string, any>
  opaqueIdPrefix?: string
  generateRequestId?: generateRequestIdFn
  name?: string | symbol
  auth?: BasicAuth | ApiKeyAuth | BearerAuth
  context?: Context
  proxy?: string | URL
  enableMetaHeader?: boolean
  cloud?: {
    id: string
  }
  disablePrototypePoisoningProtection?: boolean | 'proto' | 'constructor'
  caFingerprint?: string
  maxResponseSize?: number
  maxCompressedResponseSize?: number
  redaction?: RedactionOptions
}

export default class Client extends API {
  diagnostic: Diagnostic
  name: string | symbol
  connectionPool: BaseConnectionPool
  transport: Transport
  serializer: Serializer
  helpers: Helpers
  constructor (opts: ClientOptions) {
    super()
    // @ts-expect-error kChild symbol is for internal use only
    if ((opts.cloud != null) && opts[kChild] === undefined) {
      const { id } = opts.cloud
      // the cloud id is `cluster-name:base64encodedurl`
      // the url is a string divided by two '$', the first is the cloud url
      // the second the elasticsearch instance, the third the kibana instance
      const cloudUrls = Buffer.from(id.split(':')[1], 'base64').toString().split('$')

      opts.node = `https://${cloudUrls[1]}.${cloudUrls[0]}`

      // Cloud has better performances with compression enabled
      // see https://github.com/elastic/elasticsearch-py/pull/704.
      // So unless the user specifies otherwise, we enable compression.
      if (opts.compression == null) opts.compression = true
      if (opts.tls == null ||
         (opts.tls != null && opts.tls.secureProtocol == null)) {
        opts.tls = opts.tls ?? {}
        opts.tls.secureProtocol = 'TLSv1_2_method'
      }
    }

    if (opts.node == null && opts.nodes == null) {
      throw new errors.ConfigurationError('Missing node(s) option')
    }

    // @ts-expect-error kChild symbol is for internal use only
    if (opts[kChild] === undefined) {
      const checkAuth = getAuth(opts.node ?? opts.nodes)
      if ((checkAuth != null) && checkAuth.username !== '' && checkAuth.password !== '') {
        opts.auth = Object.assign({}, opts.auth, { username: checkAuth.username, password: checkAuth.password })
      }
    }

    const options: Required<ClientOptions> = Object.assign({}, {
      Connection: UndiciConnection,
      Transport,
      Serializer,
      ConnectionPool: CloudConnectionPool,
      maxRetries: 3,
      requestTimeout: 30000,
      pingTimeout: 3000,
      resurrectStrategy: 'ping',
      compression: true,
      tls: null,
      caFingerprint: null,
      agent: null,
      headers: {
        'user-agent': `elasticsearch-serverless-js/${clientVersion} Node.js ${nodeVersion}; Transport ${transportVersion}; (${os.platform()} ${os.release()} ${os.arch()})`,
        'elastic-api-version': `${apiVersion.slice(0, 4)}-${apiVersion.slice(4, 6)}-${apiVersion.slice(6, 8)}`
      },
      generateRequestId: null,
      name: 'elasticsearch-serverless-js',
      auth: null,
      opaqueIdPrefix: null,
      context: null,
      proxy: null,
      enableMetaHeader: true,
      maxResponseSize: null,
      maxCompressedResponseSize: null,
      redaction: {
        type: 'replace',
        additionalKeys: []
      }
    }, opts)

    if (options.caFingerprint != null && isHttpConnection(opts.node ?? opts.nodes)) {
      throw new errors.ConfigurationError('You can\'t configure the caFingerprint with a http connection')
    }

    if (options.maxResponseSize != null && options.maxResponseSize > buffer.constants.MAX_STRING_LENGTH) {
      throw new errors.ConfigurationError(`The maxResponseSize cannot be bigger than ${buffer.constants.MAX_STRING_LENGTH}`)
    }

    if (options.maxCompressedResponseSize != null && options.maxCompressedResponseSize > buffer.constants.MAX_LENGTH) {
      throw new errors.ConfigurationError(`The maxCompressedResponseSize cannot be bigger than ${buffer.constants.MAX_LENGTH}`)
    }

    if (options.enableMetaHeader) {
      options.headers['x-elastic-client-meta'] = `esv=${clientVersionNoMeta},js=${nodeVersion},t=${transportVersion},hc=${nodeVersion}`
    }

    this.name = options.name
    // @ts-expect-error kInitialOptions symbol is for internal use only
    this[kInitialOptions] = options

    // @ts-expect-error kChild symbol is for internal use only
    if (opts[kChild] !== undefined) {
      // @ts-expect-error kChild symbol is for internal use only
      this.serializer = opts[kChild].serializer
      // @ts-expect-error kChild symbol is for internal use only
      this.connectionPool = opts[kChild].connectionPool
      // @ts-expect-error kChild symbol is for internal use only
      this.diagnostic = opts[kChild].diagnostic
    } else {
      this.diagnostic = new Diagnostic()

      let serializerOptions
      if (opts.disablePrototypePoisoningProtection != null) {
        if (typeof opts.disablePrototypePoisoningProtection === 'boolean') {
          serializerOptions = {
            enablePrototypePoisoningProtection: !opts.disablePrototypePoisoningProtection
          }
        } else {
          serializerOptions = {
            enablePrototypePoisoningProtection: opts.disablePrototypePoisoningProtection
          }
        }
      }
      this.serializer = new options.Serializer(serializerOptions)

      this.connectionPool = new options.ConnectionPool({
        pingTimeout: options.pingTimeout,
        resurrectStrategy: options.resurrectStrategy,
        tls: options.tls,
        agent: options.agent,
        proxy: options.proxy,
        Connection: options.Connection,
        auth: options.auth,
        diagnostic: this.diagnostic,
        caFingerprint: options.caFingerprint
      })

      // serverless only supports one node. keeping array support, to simplify
      // for people migrating from the stack client, but only using the first
      // node in the list.
      let node = options.node ?? options.nodes
      if (Array.isArray(node)) node = node[0]

      // ensure default connection values are inherited when creating new connections
      // see https://github.com/elastic/elasticsearch-js/issues/1791
      type ConnectionDefaults = Record<string, any>

      const { tls, headers, auth, requestTimeout: timeout, agent, proxy, caFingerprint } = options
      let defaults: ConnectionDefaults = { tls, headers, auth, timeout, agent, proxy, caFingerprint }

      // strip undefined values from defaults
      defaults = Object.keys(defaults).reduce((acc: ConnectionDefaults, key) => {
        const val = defaults[key]
        if (val !== undefined) acc[key] = val
        return acc
      }, {})

      let newOpts
      if (typeof node === 'string') {
        newOpts = {
          url: new URL(node)
        }
      } else {
        newOpts = node
      }
      this.connectionPool.addConnection({ ...defaults, ...newOpts })
    }

    this.transport = new options.Transport({
      diagnostic: this.diagnostic,
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      maxRetries: options.maxRetries,
      requestTimeout: options.requestTimeout,
      compression: options.compression,
      headers: options.headers,
      generateRequestId: options.generateRequestId,
      name: options.name,
      opaqueIdPrefix: options.opaqueIdPrefix,
      context: options.context,
      productCheck: 'Elasticsearch',
      maxResponseSize: options.maxResponseSize,
      maxCompressedResponseSize: options.maxCompressedResponseSize,
      redaction: options.redaction
    })

    this.helpers = new Helpers({
      client: this,
      metaHeader: options.enableMetaHeader
        ? `esv=${clientVersionNoMeta},js=${nodeVersion},t=${transportVersion},hc=${nodeVersion}`
        : null,
      maxRetries: options.maxRetries
    })
  }

  child (opts: ClientOptions): Client {
    // Merge the new options with the initial ones
    // @ts-expect-error kChild symbol is for internal use only
    const options: ClientOptions = Object.assign({}, this[kInitialOptions], opts)
    // Pass to the child client the parent instances that cannot be overridden
    // @ts-expect-error kInitialOptions symbol is for internal use only
    options[kChild] = {
      connectionPool: this.connectionPool,
      serializer: this.serializer,
      diagnostic: this.diagnostic,
      initialOptions: options
    }

    /* istanbul ignore else */
    if (options.auth !== undefined) {
      options.headers = prepareHeaders(options.headers, options.auth)
    }

    return new Client(options)
  }

  async close (): Promise<void> {
    return await this.connectionPool.empty()
  }
}

function isHttpConnection (node?: string | string[] | NodeOptions | NodeOptions[]): boolean {
  if (Array.isArray(node)) {
    return node.some((n) => (typeof n === 'string' ? new URL(n).protocol : n.url.protocol) === 'http:')
  } else {
    if (node == null) return false
    return (typeof node === 'string' ? new URL(node).protocol : node.url.protocol) === 'http:'
  }
}

function getAuth (node?: string | string[] | NodeOptions | NodeOptions[]): { username: string, password: string } | null {
  if (Array.isArray(node)) {
    for (const url of node) {
      const auth = getUsernameAndPassword(url)
      if (auth != null && auth.username !== '' && auth.password !== '') {
        return auth
      }
    }

    return null
  } else {
    const auth = getUsernameAndPassword(node)
    if (auth != null && auth.username !== '' && auth.password !== '') {
      return auth
    }

    return null
  }

  function getUsernameAndPassword (node?: string | NodeOptions): { username: string, password: string } | null {
    /* istanbul ignore else */
    if (typeof node === 'string') {
      const { username, password } = new URL(node)
      return {
        username: decodeURIComponent(username),
        password: decodeURIComponent(password)
      }
    } else if (node != null && node.url instanceof URL) {
      return {
        username: decodeURIComponent(node.url.username),
        password: decodeURIComponent(node.url.password)
      }
    } else {
      return null
    }
  }
}
