/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
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

/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-misused-new */
/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-unused-vars */

// This file was automatically generated by elastic/elastic-client-generator-js
// DO NOT MODIFY IT BY HAND. Instead, modify the source open api file,
// and elastic/elastic-client-generator-js to regenerate this file again.

import {
  Transport,
  TransportRequestOptions,
  TransportRequestOptionsWithMeta,
  TransportRequestOptionsWithOutMeta,
  TransportResult
} from '@elastic/transport'
import * as T from '../types'
import * as TB from '../typesWithBodyKey'
interface That { transport: Transport }

export default class License {
  transport: Transport
  constructor (transport: Transport) {
    this.transport = transport
  }

  /**
    * Retrieves licensing information for the cluster
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/get-license.html | Elasticsearch API documentation}
    */
  async get (this: That, params?: T.LicenseGetRequest | TB.LicenseGetRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.LicenseGetResponse>
  async get (this: That, params?: T.LicenseGetRequest | TB.LicenseGetRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.LicenseGetResponse, unknown>>
  async get (this: That, params?: T.LicenseGetRequest | TB.LicenseGetRequest, options?: TransportRequestOptions): Promise<T.LicenseGetResponse>
  async get (this: That, params?: T.LicenseGetRequest | TB.LicenseGetRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = []
    const querystring: Record<string, any> = {}
    const body = undefined

    params = params ?? {}
    for (const key in params) {
      if (acceptedPath.includes(key)) {
        continue
      } else if (key !== 'body') {
        // @ts-expect-error
        querystring[key] = params[key]
      }
    }

    const method = 'GET'
    const path = '/_license'
    return await this.transport.request({ path, method, querystring, body }, options)
  }
}