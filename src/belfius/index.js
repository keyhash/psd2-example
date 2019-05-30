'use strict'

const Request = require('request-promise-native')

exports.plugin = {
  pkg: require('./package.json'),
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: '/belfius',
      handler: async (request, h) => {
        const options = {
          headers: {
            'Client-ID': '',
            'Accept': 'application/vnd.belfius.api+json; version=1',
            'Code-Challenge-Method': 'plain',
            'Code-Challenge': '12345678901234567890123456789012',
            'Redirect-URI': 'https://localhost',
            'Accept-Language': 'fr'
          }
        }

        const response = await Request(Object.assign({}, options, {
          uri: 'https://sandbox.api.belfius.be:8443/sandbox/psd2/consent-uris?iban=BE68429619512134',
          json: true
        }))

        return response
      }
    })
  }
}
