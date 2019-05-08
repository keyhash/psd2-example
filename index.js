#!/usr/bin/env node

'use strict'

const Glue = require('@hapi/glue')

const defaultConfigFile = (process.env.NODE_ENV === 'development')
  ? 'config.ini'
  : '/etc/' + require('./package.json').name + '/config.ini'

const config = require('yargs')
  .usage('Usage: $0 [options]')
  .config('c', 'Configuration file', (configPath) =>
    require('ini').parse(require('fs').readFileSync(configPath, 'utf-8'))
  ).default('c', defaultConfigFile).demand('c').alias('c', 'config')
  .alias('p', 'prefix').nargs('p', 1).describe('p', 'Server route prefix')
  .version().alias('v', 'version')
  .help().alias('h', 'help')
  .argv

const options = {
  relativeTo: __dirname
}

Glue.compose(require('./manifest')(config), options)
  // Start the server
  .then(server => { server.start(); return server })
  // Display running data
  .then(server => {
    console.log(`Server running at: ${server.info.uri}`)
  })
  // Notify parent process that we are up and running
  .then(() => {
    if (process.connected) {
      process.send('started')
    }
  })
  // Handle startup error
  .catch((reason) => {
    console.error('Unable to start server', (reason && reason.stack) || reason)
    process.exit(1)
  })
