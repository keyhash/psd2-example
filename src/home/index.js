'use strict'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const Request = require('request-promise-native')
const Uuid = require('uuid/v4')

const BNP_PARIBAS_BASE_URI = 'https://sandbox.api.bnpparibasfortis.com'
const KEYTRADE_BASE_URI = 'https://sandbox.keytradebank.be/public/berlingroup'

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

    server.route({
      method: 'GET',
      path: '/keytradebank',
      // options: {
      //   auth: 'session-keytradebank'
      // },
      handler: async (request, h) => {
        console.log(KEYTRADE_BASE_URI + '/v1/token?code=AIS_VALID_CODE')
        const response = await Request(Object.assign({}, options, {
          method: 'GET',
          uri: KEYTRADE_BASE_URI + '/v1/token?code=AIS_VALID_CODE'
          // body: {
          //   'client_id': 'VALID_CLIENT_ID',
          //   'code': 'AIS_VALID_CODE',
          //   'code_verifier': 'CODE',
          //   'grant_type': 'authorization_code',
          //   'redirect_uri': 'http://localhost'
          // },
          // json: true
        }))

        return response
      }
    })

    server.route({
      method: 'GET',
      path: '/bnpparibas',
      options: {
        auth: 'session-bnpbaribas'
      },
      handler: async (request, h) => {
        const requestId = Uuid()

        const options = {
          auth: {
            bearer: request.auth.credentials.token
          },
          headers: {
            'X-Openbank-Organization': '',
            'X-Openbank-Stet-Version': '1.4.0.47.develop',
            'X-Request-Id': requestId,
            'Signature': 'A signature'
          }
        }

        const { accounts } = await Request(Object.assign({}, options, {
          uri: BNP_PARIBAS_BASE_URI + '/v1/accounts',
          json: true
        }))

        const transactions = []

        for (let account of accounts) {
          const { _links: { transactions: { href: uri } } } = account

          console.log(uri, options)
          const response = await Request(Object.assign({}, options, {
            uri: BNP_PARIBAS_BASE_URI + uri,
            resolveWithFullResponse: true
          }))

          transactions.push(response)
        }

        return transactions
      }
    })
  }
}
