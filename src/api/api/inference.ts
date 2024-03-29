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

export default class Inference {
  transport: Transport
  constructor (transport: Transport) {
    this.transport = transport
  }

  /**
    * Delete model in the Inference API
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/delete-inference-api.html | Elasticsearch API documentation}
    */
  async deleteModel (this: That, params: T.InferenceDeleteModelRequest | TB.InferenceDeleteModelRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.InferenceDeleteModelResponse>
  async deleteModel (this: That, params: T.InferenceDeleteModelRequest | TB.InferenceDeleteModelRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.InferenceDeleteModelResponse, unknown>>
  async deleteModel (this: That, params: T.InferenceDeleteModelRequest | TB.InferenceDeleteModelRequest, options?: TransportRequestOptions): Promise<T.InferenceDeleteModelResponse>
  async deleteModel (this: That, params: T.InferenceDeleteModelRequest | TB.InferenceDeleteModelRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['task_type', 'inference_id']
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

    let method = ''
    let path = ''
    if (params.task_type != null && params.inference_id != null) {
      method = 'DELETE'
      path = `/_inference/${encodeURIComponent(params.task_type.toString())}/${encodeURIComponent(params.inference_id.toString())}`
    } else {
      method = 'DELETE'
      path = `/_inference/${encodeURIComponent(params.inference_id.toString())}`
    }
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Get a model in the Inference API
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/get-inference-api.html | Elasticsearch API documentation}
    */
  async getModel (this: That, params: T.InferenceGetModelRequest | TB.InferenceGetModelRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.InferenceGetModelResponse>
  async getModel (this: That, params: T.InferenceGetModelRequest | TB.InferenceGetModelRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.InferenceGetModelResponse, unknown>>
  async getModel (this: That, params: T.InferenceGetModelRequest | TB.InferenceGetModelRequest, options?: TransportRequestOptions): Promise<T.InferenceGetModelResponse>
  async getModel (this: That, params: T.InferenceGetModelRequest | TB.InferenceGetModelRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['task_type', 'inference_id']
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

    let method = ''
    let path = ''
    if (params.task_type != null && params.inference_id != null) {
      method = 'GET'
      path = `/_inference/${encodeURIComponent(params.task_type.toString())}/${encodeURIComponent(params.inference_id.toString())}`
    } else {
      method = 'GET'
      path = `/_inference/${encodeURIComponent(params.inference_id.toString())}`
    }
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Perform inference on a model
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/post-inference-api.html | Elasticsearch API documentation}
    */
  async inference (this: That, params: T.InferenceInferenceRequest | TB.InferenceInferenceRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.InferenceInferenceResponse>
  async inference (this: That, params: T.InferenceInferenceRequest | TB.InferenceInferenceRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.InferenceInferenceResponse, unknown>>
  async inference (this: That, params: T.InferenceInferenceRequest | TB.InferenceInferenceRequest, options?: TransportRequestOptions): Promise<T.InferenceInferenceResponse>
  async inference (this: That, params: T.InferenceInferenceRequest | TB.InferenceInferenceRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['task_type', 'inference_id']
    const acceptedBody: string[] = ['input', 'task_settings']
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
    if (params.task_type != null && params.inference_id != null) {
      method = 'POST'
      path = `/_inference/${encodeURIComponent(params.task_type.toString())}/${encodeURIComponent(params.inference_id.toString())}`
    } else {
      method = 'POST'
      path = `/_inference/${encodeURIComponent(params.inference_id.toString())}`
    }
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Configure a model for use in the Inference API
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/put-inference-api.html | Elasticsearch API documentation}
    */
  async putModel (this: That, params: T.InferencePutModelRequest | TB.InferencePutModelRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.InferencePutModelResponse>
  async putModel (this: That, params: T.InferencePutModelRequest | TB.InferencePutModelRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.InferencePutModelResponse, unknown>>
  async putModel (this: That, params: T.InferencePutModelRequest | TB.InferencePutModelRequest, options?: TransportRequestOptions): Promise<T.InferencePutModelResponse>
  async putModel (this: That, params: T.InferencePutModelRequest | TB.InferencePutModelRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = ['task_type', 'inference_id']
    const acceptedBody: string[] = ['model_config']
    const querystring: Record<string, any> = {}
    // @ts-expect-error
    let body: any = params.body ?? undefined

    for (const key in params) {
      if (acceptedBody.includes(key)) {
        // @ts-expect-error
        body = params[key]
      } else if (acceptedPath.includes(key)) {
        continue
      } else if (key !== 'body') {
        // @ts-expect-error
        querystring[key] = params[key]
      }
    }

    let method = ''
    let path = ''
    if (params.task_type != null && params.inference_id != null) {
      method = 'PUT'
      path = `/_inference/${encodeURIComponent(params.task_type.toString())}/${encodeURIComponent(params.inference_id.toString())}`
    } else {
      method = 'PUT'
      path = `/_inference/${encodeURIComponent(params.inference_id.toString())}`
    }
    return await this.transport.request({ path, method, querystring, body }, options)
  }
}
