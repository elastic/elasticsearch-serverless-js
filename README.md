# Elasticsearch Serverless Client

[![main](https://github.com/elastic/elasticsearch-serverless-js/actions/workflows/tests.yml/badge.svg?branch=main)](https://github.com/elastic/elasticsearch-serverless-js/actions/workflows/tests.yml)

This is the official Node.js Elastic client for the **Elasticsearch Serverless** service.
If you're looking to develop your Node.js application with the Elasticsearch Stack, you should look at the [Elasticsearch Client](https://github.com/elastic/elasticsearch-js) instead.
If you're looking to develop your Node.js application with Elastic Enterprise Search, you should look at the [Enterprise Search Client](https://github.com/elastic/enterprise-search-js/).

## Installation

Install via npm:

```shell
npm install @elastic/elasticsearch-serverless
```

### Instantiate a Client

```javascript
const { Client } = require('@elastic/elasticsearch-serverless')
const client = new Client({
  node: 'https://', // serverless project URL
  auth: { apiKey: 'your_api_key' }, // project API key
})
```

### Using the API

Once you've instantiated a client with your API key and Elasticsearch endpoint, you can start ingesting documents into Elasticsearch Service.
You can use the **Bulk API** for this.
This API allows you to index, update and delete several documents in one request.
You call the `bulk` API on the client with a body parameter, an Array of hashes that define the action and a document.
Here's an example of indexing some classic books into the `books` index:

```javascript
// First we build our data:
const body = [
  {name: "Snow Crash", "author": "Neal Stephenson", "release_date": "1992-06-01", "page_count": 470},
  {name: "Revelation Space", "author": "Alastair Reynolds", "release_date": "2000-03-15", "page_count": 585},
  {name: "1984", "author": "George Orwell", "release_date": "1985-06-01", "page_count": 328},
  {name: "Fahrenheit 451", "author": "Ray Bradbury", "release_date": "1953-10-15", "page_count": 227},
  {name: "Brave New World", "author": "Aldous Huxley", "release_date": "1932-06-01", "page_count": 268},
  {name: "The Handmaid's Tale", "author": "Margaret Atwood", "release_date": "1985-06-01", "page_count": 311}
]

// Then we send the data using the bulk API helper:
const result = await client.helpers.bulk({
  datasource: body,
  onDocument (doc) {
    // instructs the bulk indexer to add each item in `body` to the books index
    // you can optionally inspect each `doc` object to alter what action is performed per document
    return {
      index: { _index: 'books' }
    }
  }
})
```

Now that some data is available, you can search your documents using the **Search API**:

```js
const result = await client.search({
  index: 'books',
  query: {
    match: {
      author: 'Ray Bradbury'
    }
  }
})
console.log(result.hits.hits)
```

## Development

See [CONTRIBUTING](./CONTRIBUTING.md).

### Docs

Some questions, assumptions and general notes about this project can be found in [the docs directory](./docs/questions-and-assumptions.md).
