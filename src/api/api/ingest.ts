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
  TransportRequestMetadata,
  TransportRequestOptions,
  TransportRequestOptionsWithMeta,
  TransportRequestOptionsWithOutMeta,
  TransportResult
} from '@elastic/transport'
import * as T from '../types'
import * as TB from '../typesWithBodyKey'
interface That { transport: Transport }

export default class Ingest {
  transport: Transport
  constructor (transport: Transport) {
    this.transport = transport
  }

  /**
    * Deletes one or more existing ingest pipeline.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/delete-pipeline-api.html | Elasticsearch API documentation}
    */
  async deletePipeline (this: That, params: T.IngestDeletePipelineRequest | TB.IngestDeletePipelineRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IngestDeletePipelineResponse>
  async deletePipeline (this: That, params: T.IngestDeletePipelineRequest | TB.IngestDeletePipelineRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IngestDeletePipelineResponse, unknown>>
  async deletePipeline (this: That, params: T.IngestDeletePipelineRequest | TB.IngestDeletePipelineRequest, options?: TransportRequestOptions): Promise<T.IngestDeletePipelineResponse>
  async deletePipeline (this: That, params: T.IngestDeletePipelineRequest | TB.IngestDeletePipelineRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['id']
    const querystring: Record<string, any> = {}
    const body = undefined

    for (const key in params) {
      if (acceptedPath.includes(key)) {
        continue
      } else if (key !== 'body') {
        // @ts-expect-error
        querystring[key] = params[key]
      }
    }

    const method = 'DELETE'
    const path = `/_ingest/pipeline/${encodeURIComponent(params.id.toString())}`
    const meta: TransportRequestMetadata = {
      name: 'ingest.delete_pipeline',
      pathParts: {
        id: params.id
      }
    }
    return await this.transport.request({ path, method, querystring, body, meta }, options)
  }

  /**
    * Returns information about one or more ingest pipelines. This API returns a local reference of the pipeline.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/get-pipeline-api.html | Elasticsearch API documentation}
    */
  async getPipeline (this: That, params?: T.IngestGetPipelineRequest | TB.IngestGetPipelineRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IngestGetPipelineResponse>
  async getPipeline (this: That, params?: T.IngestGetPipelineRequest | TB.IngestGetPipelineRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IngestGetPipelineResponse, unknown>>
  async getPipeline (this: That, params?: T.IngestGetPipelineRequest | TB.IngestGetPipelineRequest, options?: TransportRequestOptions): Promise<T.IngestGetPipelineResponse>
  async getPipeline (this: That, params?: T.IngestGetPipelineRequest | TB.IngestGetPipelineRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['id']
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

    let method = ''
    let path = ''
    if (params.id != null) {
      method = 'GET'
      path = `/_ingest/pipeline/${encodeURIComponent(params.id.toString())}`
    } else {
      method = 'GET'
      path = '/_ingest/pipeline'
    }
    const meta: TransportRequestMetadata = {
      name: 'ingest.get_pipeline',
      pathParts: {
        id: params.id
      }
    }
    return await this.transport.request({ path, method, querystring, body, meta }, options)
  }

  /**
    * Extracts structured fields out of a single text field within a document. You choose which field to extract matched fields from, as well as the grok pattern you expect will match. A grok pattern is like a regular expression that supports aliased expressions that can be reused.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/grok-processor.html | Elasticsearch API documentation}
    */
  async processorGrok (this: That, params?: T.IngestProcessorGrokRequest | TB.IngestProcessorGrokRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IngestProcessorGrokResponse>
  async processorGrok (this: That, params?: T.IngestProcessorGrokRequest | TB.IngestProcessorGrokRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IngestProcessorGrokResponse, unknown>>
  async processorGrok (this: That, params?: T.IngestProcessorGrokRequest | TB.IngestProcessorGrokRequest, options?: TransportRequestOptions): Promise<T.IngestProcessorGrokResponse>
  async processorGrok (this: That, params?: T.IngestProcessorGrokRequest | TB.IngestProcessorGrokRequest, options?: TransportRequestOptions): Promise<any> {
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
    const path = '/_ingest/processor/grok'
    const meta: TransportRequestMetadata = {
      name: 'ingest.processor_grok'
    }
    return await this.transport.request({ path, method, querystring, body, meta }, options)
  }

  /**
    * Creates or updates an ingest pipeline. Changes made using this API take effect immediately.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/ingest.html | Elasticsearch API documentation}
    */
  async putPipeline (this: That, params: T.IngestPutPipelineRequest | TB.IngestPutPipelineRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IngestPutPipelineResponse>
  async putPipeline (this: That, params: T.IngestPutPipelineRequest | TB.IngestPutPipelineRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IngestPutPipelineResponse, unknown>>
  async putPipeline (this: That, params: T.IngestPutPipelineRequest | TB.IngestPutPipelineRequest, options?: TransportRequestOptions): Promise<T.IngestPutPipelineResponse>
  async putPipeline (this: That, params: T.IngestPutPipelineRequest | TB.IngestPutPipelineRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['id']
    const acceptedBody: string[] = ['_meta', 'description', 'on_failure', 'processors', 'version', 'deprecated']
    const querystring: Record<string, any> = {}
    // @ts-expect-error
    const userBody: any = params?.body
    let body: Record<string, any> | string
    if (typeof userBody === 'string') {
      body = userBody
    } else {
      body = userBody != null ? { ...userBody } : undefined
    }

    for (const key in params) {
      if (acceptedBody.includes(key)) {
        body = body ?? {}
        // @ts-expect-error
        body[key] = params[key]
      } else if (acceptedPath.includes(key)) {
        continue
      } else if (key !== 'body') {
        // @ts-expect-error
        querystring[key] = params[key]
      }
    }

    const method = 'PUT'
    const path = `/_ingest/pipeline/${encodeURIComponent(params.id.toString())}`
    const meta: TransportRequestMetadata = {
      name: 'ingest.put_pipeline',
      pathParts: {
        id: params.id
      }
    }
    return await this.transport.request({ path, method, querystring, body, meta }, options)
  }

  /**
    * Executes an ingest pipeline against a set of provided documents.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/simulate-pipeline-api.html | Elasticsearch API documentation}
    */
  async simulate (this: That, params: T.IngestSimulateRequest | TB.IngestSimulateRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.IngestSimulateResponse>
  async simulate (this: That, params: T.IngestSimulateRequest | TB.IngestSimulateRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.IngestSimulateResponse, unknown>>
  async simulate (this: That, params: T.IngestSimulateRequest | TB.IngestSimulateRequest, options?: TransportRequestOptions): Promise<T.IngestSimulateResponse>
  async simulate (this: That, params: T.IngestSimulateRequest | TB.IngestSimulateRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['id']
    const acceptedBody: string[] = ['docs', 'pipeline']
    const querystring: Record<string, any> = {}
    // @ts-expect-error
    const userBody: any = params?.body
    let body: Record<string, any> | string
    if (typeof userBody === 'string') {
      body = userBody
    } else {
      body = userBody != null ? { ...userBody } : undefined
    }

    for (const key in params) {
      if (acceptedBody.includes(key)) {
        body = body ?? {}
        // @ts-expect-error
        body[key] = params[key]
      } else if (acceptedPath.includes(key)) {
        continue
      } else if (key !== 'body') {
        // @ts-expect-error
        querystring[key] = params[key]
      }
    }

    let method = ''
    let path = ''
    if (params.id != null) {
      method = body != null ? 'POST' : 'GET'
      path = `/_ingest/pipeline/${encodeURIComponent(params.id.toString())}/_simulate`
    } else {
      method = body != null ? 'POST' : 'GET'
      path = '/_ingest/pipeline/_simulate'
    }
    const meta: TransportRequestMetadata = {
      name: 'ingest.simulate',
      pathParts: {
        id: params.id
      }
    }
    return await this.transport.request({ path, method, querystring, body, meta }, options)
  }
}
