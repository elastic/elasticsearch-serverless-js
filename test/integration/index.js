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

'use strict'

process.on('unhandledRejection', function (err) {
  console.error(err)
  process.exit(1)
})

const { writeFileSync, readFileSync, mkdirSync } = require('fs')
const { join, sep } = require('path')
const yaml = require('js-yaml')
const minimist = require('minimist')
const ms = require('ms')
const globby = require('globby')
const { Client } = require('../../index')
const build = require('./test-runner')
const createJunitReporter = require('./reporter')
const downloadArtifacts = require('../../scripts/download-artifacts')

const yamlFolder = downloadArtifacts.locations.testYamlFolder

const MAX_FILE_TIME = 1000 * 90
const MAX_TEST_TIME = 1000 * 60

const options = minimist(process.argv.slice(2), {
  boolean: ['bail'],
  string: ['suite', 'test', 'local'],
})

const skips = {
  // TODO: sql.getAsync does not set a content-type header but ES expects one
  // transport only sets a content-type if the body is not empty
  'sql/10_basic.yml': ['*'],
  // TODO: bulk call in setup fails due to "malformed action/metadata line"
  // bulk body is being sent as a Buffer, unsure if related.
  'transform/10_basic.yml': ['*'],
  // TODO: scripts_painless_execute expects {"result":"0.1"}, gets {"result":"0"}
  // body sent as Buffer, unsure if related
  'script/10_basic.yml': ['*'],
  // TODO: expects {"outlier_detection.auc_roc.value":0.99995}, gets {"outlier_detection.auc_roc.value":0.5}
  // remove if/when https://github.com/elastic/elasticsearch-clients-tests/issues/37 is resolved
  'machine_learning/data_frame_evaluate.yml': ['*'],
  // TODO: Cannot perform requested action because job [job-crud-test-apis] is not open
  'machine_learning/jobs_crud.yml': ['*'],
  // TODO: test runner needs to support ignoring 410 errors
  'enrich/10_basic.yml': ['*'],
  // TODO: parameter `enabled` is not allowed in source
  // Same underlying problem as https://github.com/elastic/elasticsearch-clients-tests/issues/55
  'cluster/component_templates.yml': ['*'],
  // TODO: expecting `ct_field` field mapping to be returned, but instead only finds `field`
  'indices/simulate_template.yml': ['*'],
  'indices/simulate_index_template.yml': ['*'],
  // TODO: test currently times out
  'inference/10_basic.yml': ['*'],
  // TODO: Fix: "Trained model deployment [test_model] is not allocated to any nodes"
  'machine_learning/20_trained_model_serverless.yml': ['*'],
  // TODO: query_rules api not available yet
  'query_rules/10_query_rules.yml': ['*'],
  'query_rules/20_rulesets.yml': ['*'],
  'query_rules/30_test.yml': ['*'],
  // TODO: security.putRole API not available
  'security/50_roles_serverless.yml': ['*'],
  // TODO: expected undefined to equal 'some_table'
  'entsearch/50_connector_updates.yml': ['*'],
  // TODO: resource_not_found_exception
  'tasks_serverless.yml': ['*'],
}

const shouldSkip = (file, name) => {
  if (options.suite || options.test) return false

  let keys = Object.keys(skips)
  for (let key of keys) {
    if (key.endsWith(file) || file.endsWith(key)) {
      const tests = skips[key]
      if (tests.includes('*') || tests.includes(name)) {
        log(`Skipping test "${file}: ${name}" because it is on the skip list`)
        return true
      }
    }
  }

  return false
}

const getAllFiles = async dir => {
  const files = await globby(dir, {
    expandDirectories: {
      extensions: ['yml', 'yaml']
    }
  })
  return files.sort()
}

function runner (opts = {}) {
  const options = {
    node: opts.node,
    auth: { apiKey: opts.apiKey },
    requestTimeout: 45000
  }
  const client = new Client(options)
  log('Loading yaml suite')
  start({ client })
    .catch(err => {
      if (err.name === 'ResponseError') {
        console.error(err)
        console.log(JSON.stringify(err.meta, null, 2))
      } else {
        console.error(err)
      }
      process.exit(1)
    })
}

async function start ({ client }) {
  log(`Downloading YAML test artifacts...`)
  await downloadArtifacts(options.local)

  log(`Testing serverless API...`)
  const junit = createJunitReporter()
  const junitTestSuites = junit.testsuites(`Integration test for serverless API`)

  const stats = {
    total: 0,
    skip: 0,
    pass: 0,
    assertions: 0
  }
  const files = await getAllFiles(yamlFolder)

  const totalTime = now()
  for (const file of files) {
    // pretty name
    const apiName = file.split(`${sep}tests${sep}`)[1]

    log('Testing ' + apiName)
    const testRunner = build({ client })
    const fileTime = now()
    const data = readFileSync(file, 'utf8')

    // get the test yaml as an object. files have multiple YAML documents inside,
    // separated by '---', so we split on the separator and remove the empty strings
    // before parsing them
    const tests = data
      .split('\n---\n')
      .map(s => s.trim())
      // empty strings
      .filter(Boolean)
      .map(parse)
      // null values
      .filter(Boolean)

    // get setup, teardown and requires rules if present
    let setupTest = null
    let teardownTest = null
    let requires = null
    for (const test of tests) {
      if (test.setup) setupTest = test.setup
      if (test.teardown) teardownTest = test.teardown
      if (test.requires) requires = test.requires
    }

    const cleanPath = file.slice(file.lastIndexOf(apiName))

    // skip if --suite CLI arg doesn't match
    if (options.suite && !cleanPath.endsWith(options.suite)) continue

    // skip if `requires.serverless` is not true
    if (typeof requires === 'object' && requires.serverless != true) continue

    const junitTestSuite = junitTestSuites.testsuite(apiName.slice(1) + ' - ' + cleanPath)

    for (const test of tests) {
      const testTime = now()
      const name = Object.keys(test)[0]

      // skip setups, teardowns and anything that doesn't match --test flag when present
      if (name === 'setup' || name === 'teardown' || name === 'requires') continue
      if (options.test && !name.endsWith(options.test)) continue

      const junitTestCase = junitTestSuite.testcase(name, `node_${process.version}: ${cleanPath}`)

      stats.total += 1
      if (shouldSkip(file, name)) {
        stats.skip += 1
        junitTestCase.skip('This test is on the skip list')
        junitTestCase.end()
        continue
      }
      log('  - ' + name)
      try {
        await testRunner.run(setupTest, test[name], teardownTest, stats, junitTestCase)
        stats.pass += 1
      } catch (err) {
        junitTestCase.failure(err)
        junitTestCase.end()
        junitTestSuite.end()
        junitTestSuites.end()
        generateJunitXmlReport(junit, 'serverless')
        err.meta = JSON.stringify(err.meta ?? {}, null, 2)
        console.error(err)

        if (options.bail) {
          process.exit(1)
        } else {
          continue
        }
      }
      const totalTestTime = now() - testTime
      junitTestCase.end()
      if (totalTestTime > MAX_TEST_TIME) {
        log('    took too long: ' + ms(totalTestTime))
      } else {
        log('    took: ' + ms(totalTestTime))
      }
    }
    junitTestSuite.end()
    const totalFileTime = now() - fileTime
    if (totalFileTime > MAX_FILE_TIME) {
      log(`  ${cleanPath} took too long: ` + ms(totalFileTime))
    } else {
      log(`  ${cleanPath} took: ` + ms(totalFileTime))
    }
  }
  junitTestSuites.end()
  generateJunitXmlReport(junit, 'serverless')
  log(`Total testing time: ${ms(now() - totalTime)}`)
  log(`Test stats:
  - Total: ${stats.total}
  - Skip: ${stats.skip}
  - Pass: ${stats.pass}
  - Fail: ${stats.total - (stats.pass + stats.skip)}
  - Assertions: ${stats.assertions}
  `)
}

function log (text) {
  process.stdout.write(text + '\n')
}

function now () {
  const ts = process.hrtime()
  return (ts[0] * 1e3) + (ts[1] / 1e6)
}

function parse (data) {
  let doc
  try {
    doc = yaml.load(data, { schema: yaml.CORE_SCHEMA })
  } catch (err) {
    console.error(err)
    return
  }
  return doc
}

function generateJunitXmlReport (junit, suite) {
  mkdirSync(
    join(__dirname, '..', '..', 'junit-output'),
    { recursive: true },
  )
  writeFileSync(
    join(__dirname, '..', '..', 'junit-output', `${suite}-report-junit.xml`),
    junit.prettyPrint()
  )
}

if (require.main === module) {
  const node = process.env.ELASTICSEARCH_URL
  const apiKey = process.env.ES_API_SECRET_KEY
  const opts = { node, apiKey }
  runner(opts)
}

module.exports = runner
