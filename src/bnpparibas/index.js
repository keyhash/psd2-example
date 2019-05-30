'use strict'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const Request = require('request-promise-native')
const Uuid = require('uuid/v4')

const BNP_PARIBAS_BASE_URI = 'https://sandbox.api.bnpparibasfortis.com'

exports.plugin = {
  pkg: require('./package.json'),
  register: async (server, options) => {
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
