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

export default class Sql {
  transport: Transport
  constructor (transport: Transport) {
    this.transport = transport
  }

  /**
    * Clears the SQL cursor
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/clear-sql-cursor-api.html | Elasticsearch API documentation}
    */
  async clearCursor (this: That, params: T.SqlClearCursorRequest | TB.SqlClearCursorRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlClearCursorResponse>
  async clearCursor (this: That, params: T.SqlClearCursorRequest | TB.SqlClearCursorRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlClearCursorResponse, unknown>>
  async clearCursor (this: That, params: T.SqlClearCursorRequest | TB.SqlClearCursorRequest, options?: TransportRequestOptions): Promise<T.SqlClearCursorResponse>
  async clearCursor (this: That, params: T.SqlClearCursorRequest | TB.SqlClearCursorRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = []
    const acceptedBody: string[] = ['cursor']
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

    const method = 'POST'
    const path = '/_sql/close'
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Deletes an async SQL search or a stored synchronous SQL search. If the search is still running, the API cancels it.
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/delete-async-sql-search-api.html | Elasticsearch API documentation}
    */
  async deleteAsync (this: That, params: T.SqlDeleteAsyncRequest | TB.SqlDeleteAsyncRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlDeleteAsyncResponse>
  async deleteAsync (this: That, params: T.SqlDeleteAsyncRequest | TB.SqlDeleteAsyncRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlDeleteAsyncResponse, unknown>>
  async deleteAsync (this: That, params: T.SqlDeleteAsyncRequest | TB.SqlDeleteAsyncRequest, options?: TransportRequestOptions): Promise<T.SqlDeleteAsyncResponse>
  async deleteAsync (this: That, params: T.SqlDeleteAsyncRequest | TB.SqlDeleteAsyncRequest, options?: TransportRequestOptions): Promise<any> {
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
    const path = `/_sql/async/delete/${encodeURIComponent(params.id.toString())}`
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Returns the current status and available results for an async SQL search or stored synchronous SQL search
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/get-async-sql-search-api.html | Elasticsearch API documentation}
    */
  async getAsync (this: That, params: T.SqlGetAsyncRequest | TB.SqlGetAsyncRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlGetAsyncResponse>
  async getAsync (this: That, params: T.SqlGetAsyncRequest | TB.SqlGetAsyncRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlGetAsyncResponse, unknown>>
  async getAsync (this: That, params: T.SqlGetAsyncRequest | TB.SqlGetAsyncRequest, options?: TransportRequestOptions): Promise<T.SqlGetAsyncResponse>
  async getAsync (this: That, params: T.SqlGetAsyncRequest | TB.SqlGetAsyncRequest, options?: TransportRequestOptions): Promise<any> {
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

    const method = 'GET'
    const path = `/_sql/async/${encodeURIComponent(params.id.toString())}`
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Returns the current status of an async SQL search or a stored synchronous SQL search
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/get-async-sql-search-status-api.html | Elasticsearch API documentation}
    */
  async getAsyncStatus (this: That, params: T.SqlGetAsyncStatusRequest | TB.SqlGetAsyncStatusRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlGetAsyncStatusResponse>
  async getAsyncStatus (this: That, params: T.SqlGetAsyncStatusRequest | TB.SqlGetAsyncStatusRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlGetAsyncStatusResponse, unknown>>
  async getAsyncStatus (this: That, params: T.SqlGetAsyncStatusRequest | TB.SqlGetAsyncStatusRequest, options?: TransportRequestOptions): Promise<T.SqlGetAsyncStatusResponse>
  async getAsyncStatus (this: That, params: T.SqlGetAsyncStatusRequest | TB.SqlGetAsyncStatusRequest, options?: TransportRequestOptions): Promise<any> {
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

    const method = 'GET'
    const path = `/_sql/async/status/${encodeURIComponent(params.id.toString())}`
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Executes a SQL request
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/sql-search-api.html | Elasticsearch API documentation}
    */
  async query (this: That, params?: T.SqlQueryRequest | TB.SqlQueryRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlQueryResponse>
  async query (this: That, params?: T.SqlQueryRequest | TB.SqlQueryRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlQueryResponse, unknown>>
  async query (this: That, params?: T.SqlQueryRequest | TB.SqlQueryRequest, options?: TransportRequestOptions): Promise<T.SqlQueryResponse>
  async query (this: That, params?: T.SqlQueryRequest | TB.SqlQueryRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = []
    const acceptedBody: string[] = ['catalog', 'columnar', 'cursor', 'fetch_size', 'filter', 'query', 'request_timeout', 'page_timeout', 'time_zone', 'field_multi_value_leniency', 'runtime_mappings', 'wait_for_completion_timeout', 'params', 'keep_alive', 'keep_on_completion', 'index_using_frozen']
    const querystring: Record<string, any> = {}
    // @ts-expect-error
    const userBody: any = params?.body
    let body: Record<string, any> | string
    if (typeof userBody === 'string') {
      body = userBody
    } else {
      body = userBody != null ? { ...userBody } : undefined
    }

    params = params ?? {}
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

    const method = body != null ? 'POST' : 'GET'
    const path = '/_sql'
    return await this.transport.request({ path, method, querystring, body }, options)
  }

  /**
    * Translates SQL into Elasticsearch queries
    * @see {@link https://www.elastic.co/guide/en/elasticsearch/reference/master/sql-translate-api.html | Elasticsearch API documentation}
    */
  async translate (this: That, params: T.SqlTranslateRequest | TB.SqlTranslateRequest, options?: TransportRequestOptionsWithOutMeta): Promise<T.SqlTranslateResponse>
  async translate (this: That, params: T.SqlTranslateRequest | TB.SqlTranslateRequest, options?: TransportRequestOptionsWithMeta): Promise<TransportResult<T.SqlTranslateResponse, unknown>>
  async translate (this: That, params: T.SqlTranslateRequest | TB.SqlTranslateRequest, options?: TransportRequestOptions): Promise<T.SqlTranslateResponse>
  async translate (this: That, params: T.SqlTranslateRequest | TB.SqlTranslateRequest, options?: TransportRequestOptions): Promise<any> {
    const acceptedPath: string[] = []
    const acceptedBody: string[] = ['fetch_size', 'filter', 'query', 'time_zone']
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

    const method = body != null ? 'POST' : 'GET'
    const path = '/_sql/translate'
    return await this.transport.request({ path, method, querystring, body }, options)
  }
}