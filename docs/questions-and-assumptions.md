# Questions and assumptions

## Initial questions

### Do we have a specification?

Not yet.
For now we've decided to extract 3 APIs from the Elasticsearch spec and generate code based on that.

### How do we test against a running server?

Initially I tested the code with Stack Elasticsearch and API Key authentication.
But I've now tested it with a Cloud instance of Serverless in our QA Cloud and it's working there too.

### YAML Tests

The Elasticsearch team is working on YAML tests.
Enrico proposed we could maintain our own set of lighter YAML tests for Serverless clients since the API will be smaller.
This way we wouldn't need to worry about the cleanup phase and all the errors it produces, and we wouldn't need to be on top of the changes in the Java code to understand how to run our integration tests.

## Docs

One of the outcomes of this work is coordinating with the docs team to create doc books for this client and tie that up together with the docs infra.

## Notes

### Code generation

The code for this prototype was generated using a process nearly identical to how we generate the Elasticsearch client's code, just filtering out most APIs except for a short list (see below).
As such, a lot of the code used in `@elastic/elasticsearch` is duplicated here.
There will be further work done on refining the code generation process when a serverless API spec is made available.

The APIs available in this prototype include `bulk`, `search`, and `info`, along with several other APIs to support functions in the `helpers` namespace, which is nearly identical to [the `helpers` namespace in `@elastic/elasticsearch`](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-helpers.html).
The full list of included APIs in this prototype:

- `bulk`
- `info`
- `search`
- `msearch`
- `msearch_template`
- `scroll`
- `clear_scroll`
- `indices.refresh`

