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

const { writeFileSync, readFileSync, readdirSync, statSync, mkdirSync } = require('fs')
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

const MAX_API_TIME = 1000 * 90
const MAX_FILE_TIME = 1000 * 30
const MAX_TEST_TIME = 1000 * 6

const options = minimist(process.argv.slice(2), {
  boolean: ['bail'],
  string: ['suite', 'test'],
})

const getAllFiles = async dir => {
  const files = await globby(dir, {
    expandDirectories: {
      extensions: ['yml', 'yaml']
    }
  })
  return files.sort()
}

function runner (opts = {}) {
  const options = { node: opts.node, auth: { apiKey: opts.apiKey } }
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
  await downloadArtifacts()

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
    const fileTime = now()
    const data = readFileSync(file, 'utf8')

    // get the test yaml (as object), some file has multiple yaml documents inside,
    // every document is separated by '---', so we split on the separator
    // and then we remove the empty strings, finally we parse them
    const tests = data
      .split('\n---\n')
      .map(s => s.trim())
      // empty strings
      .filter(Boolean)
      .map(parse)
      // null values
      .filter(Boolean)

    // get setup and teardown if present
    let setupTest = null
    let teardownTest = null
    for (const test of tests) {
      if (test.setup) setupTest = test.setup
      if (test.teardown) teardownTest = test.teardown
    }

    const cleanPath = file.slice(file.lastIndexOf(apiName))

    // skip if --suite CLI arg doesn't match
    if (options.suite && !cleanPath.endsWith(options.suite)) continue

    const junitTestSuite = junitTestSuites.testsuite(apiName.slice(1) + ' - ' + cleanPath)

    for (const test of tests) {
      const testTime = now()
      const name = Object.keys(test)[0]

      // skip setups, teardowns and anything that doesn't match --test flag when present
      if (name === 'setup' || name === 'teardown') continue
      if (options.test && !name.endsWith(options.test)) continue

      const junitTestCase = junitTestSuite.testcase(name, `node_${process.version}/${cleanPath}`)

      stats.total += 1
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
