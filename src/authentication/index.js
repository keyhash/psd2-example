'use strict'

const Bell = require('@hapi/bell')
const Joi = require('@hapi/joi')

const schemaOauth = Joi.object({
  oauth: Joi.object({
    uri: Joi.string().optional(),
    scopes: Joi.array().default([]),
    clientId: Joi.string(),
    secret: Joi.string().allow(''),
    cookie: Joi.object({
      password: Joi.string().min(32)
    })
  })
})

exports.plugin = {
  pkg: require('./package.json'),
  dependencies: [
    'bell',
    'hapi-auth-cookie'
  ],
  register: async (server, options) => {
    const config = Joi.attempt(options, Joi.object().required().keys({
      bnpparibas: schemaOauth,
      keytradebank: schemaOauth,
      cookie: Joi.object().required().keys({
        name: Joi.string().optional().default('sid'),
        password: Joi.string().min(32)
      })
    }))

    await server.register(Bell, { once: true })

    const keytradebank = require('./providers/keytradebank')(config.oauth)

    server.auth.strategy('oauth-keytradebank', 'bell', {
      cookie: 'oauth-keytradebank',
      provider: keytradebank,
      password: config.keytradebank.oauth.cookie.password,
      clientId: config.keytradebank.oauth.clientId,
      clientSecret: config.keytradebank.oauth.secret,
      forceHttps: true,
      isSecure: false,
      location: 'http://localhost',
      providerParams: {
        'redirect_uri': 'http://localhost'
      }
    })

    server.auth.strategy('session-keytradebank', 'cookie', {
      cookie: {
        name: config.cookie.name + 'keytradebank',
        password: config.cookie.password,
        isSecure: false
      },
      redirectTo: '/login-keytradebank',
      requestDecoratorName: 'keytradeCookieAuth',
      validateFunc: async (request, session) => {
        return { valid: (new Date(session.expires)).getTime() > (new Date()).getTime() }
      }
    })

    server.route({
      method: 'GET',
      path: '/login-keytradebank',
      options: {
        auth: 'oauth-keytradebank',
        handler: (request, h) => {
          const { token, expires } = request.auth.artifacts

          const profile = {
            token,
            expires
          }

          request.keytradeCookieAuth.clear()
          request.keytradeCookieAuth.set(profile)

          return h.redirect('/')
        }
      }
    })

    const bnpparibas = require('./providers/bnpparibasfortis')(config.oauth)

    server.auth.strategy('oauth-bnpparibas', 'bell', {
      cookie: 'oauth-bnpparibas',
      provider: bnpparibas,
      password: config.bnpparibas.oauth.cookie.password,
      clientId: config.bnpparibas.oauth.clientId,
      clientSecret: config.bnpparibas.oauth.secret,
      forceHttps: true,
      isSecure: false
    })

    server.auth.strategy('session-bnpbaribas', 'cookie', {
      cookie: {
        name: config.cookie.name + 'bnpbaribas',
        password: config.cookie.password,
        isSecure: false
      },
      requestDecoratorName: 'bnpCookieAuth',
      redirectTo: '/login',
      validateFunc: async (request, session) => {
        return { valid: (new Date(session.expires)).getTime() > (new Date()).getTime() }
      }
    })

    server.route({
      method: 'GET',
      path: '/login-bnpbaribas',
      options: {
        auth: 'oauth-bnpparibas',
        handler: (request, h) => {
          const { token, expires } = request.auth.artifacts

          const profile = {
            token,
            expires
          }

          request.bnpCookieAuth.clear()
          request.bnpCookieAuth.set(profile)

          return h.redirect('/')
        }
      }
    })
  }
}
