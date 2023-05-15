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

The code for the current APIs `info`, `bulk` and `search` was taken from the Elasticsearch client's code for this prototype, but there'll be further work with code generation.
As such, a lot of the code used in `@elastic/elasticsearch` is being duplicated here.
