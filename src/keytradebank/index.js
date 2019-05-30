'use strict'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const Request = require('request-promise-native')

const KEYTRADE_BASE_URI = 'https://sandbox.keytradebank.be/public/berlingroup'

exports.plugin = {
  pkg: require('./package.json'),
  register: async (server, options) => {
    server.route({
      method: 'GET',
      path: '/keytradebank',
      options: {
        auth: 'session-keytradebank'
      },
      handler: async (request, h) => {
        console.log(KEYTRADE_BASE_URI + '/v1/token?code=AIS_VALID_CODE')
        const response = await Request(Object.assign({}, options, {
          method: 'GET',
          uri: KEYTRADE_BASE_URI + '/v1/token?code=AIS_VALID_CODE',
          body: {
            'client_id': 'VALID_CLIENT_ID',
            'code': 'AIS_VALID_CODE',
            'code_verifier': 'CODE',
            'grant_type': 'authorization_code',
            'redirect_uri': 'http://localhost'
          },
          json: true
        }))

        return response
      }
    })
  }
}
