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

process.on('unhandledRejection', function (err) {
  console.error(err)
  process.exit(1)
})

import { Client } from '../../'
import assert from 'node:assert'

async function main () {
  // a simple manual smoke test that can be run against a fresh serverless instance
  const { ELASTICSEARCH_URL, ES_API_SECRET_KEY } = process.env

  assert(Boolean(ELASTICSEARCH_URL), "ELASTICSEARCH_URL is required")
  assert(Boolean(ES_API_SECRET_KEY), "ES_API_SECRET_KEY is required")

  const client = new Client({
    node: ELASTICSEARCH_URL,
    auth: { apiKey: ES_API_SECRET_KEY },
  })

  const indicesBefore = await client.cat.indices()
  assert.equal(indicesBefore.trim().length, 0, "There should not be any indices.")

  await client.indices.create({
    index: 'books',
    aliases: { novels: {}, 'things_to_read': {} },
  })

  const indicesDuring = await client.cat.indices()
  assert(indicesDuring.includes('books'), "Books index should exist")

  const body = [
    {name: "Snow Crash", "author": "Neal Stephenson", "release_date": "1992-06-01", "page_count": 470},
    {name: "Revelation Space", "author": "Alastair Reynolds", "release_date": "2000-03-15", "page_count": 585},
    {name: "1984", "author": "George Orwell", "release_date": "1985-06-01", "page_count": 328},
    {name: "Fahrenheit 451", "author": "Ray Bradbury", "release_date": "1953-10-15", "page_count": 227},
    {name: "Brave New World", "author": "Aldous Huxley", "release_date": "1932-06-01", "page_count": 268},
    {name: "The Handmaid's Tale", "author": "Margaret Atwood", "release_date": "1985-06-01", "page_count": 311}
  ]

  let docCount = 0
  const bulkResult = await client.helpers.bulk({
    datasource: body,
    onDocument () {
      docCount++
      return {
        index: { _index: 'books' }
      }
    }
  })
  assert.equal(docCount, 6, "Docs indexed should be 6")
  assert.equal(bulkResult.total, 6, "Total docs indexed should be 6")
  assert.equal(bulkResult.failed, 0, "Total failed docs should be 0")
  assert.equal(bulkResult.successful, 6, "Total successful docs should be 6")

  await client.indices.refresh({ index: 'books' })

  const result = await client.search({
    index: 'things_to_read',
    query: {
      match: {
        author: 'Ray Bradbury'
      }
    }
  })
  assert.equal(result.hits.hits.length, 1)
  assert.equal(result.hits.hits[0]._source.name, "Fahrenheit 451")

  const docId = result.hits.hits[0]._id
  const doc = await client.get({ index: 'novels', id: docId })

  assert.equal(doc._source.author, "Ray Bradbury")

  await client.update({ index: 'novels', id: docId, doc: { author: 'Ray Bradberry', 'rating': 3.2 }})
  await client.indices.refresh({ index: 'books' })

  const doc2 = await client.get({ index: 'novels', id: docId })
  assert.equal(doc2._source.author, "Ray Bradberry")
  assert.equal(doc2._source.rating, 3.2)

  await client.indices.delete({ index: 'books' })

  const indicesAfter = await client.cat.indices()
  assert.equal(indicesAfter.trim().length, 0, "There should not be any indices.")
}

main()
  .catch(err => console.error(err))
  .finally(() => console.log('Test succeeded'))
