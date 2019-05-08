'use strict'

module.exports = (options) => ({
  server: options.server,
  register: {
    plugins: [
      `@hapi/inert`,
      `@hapi/vision`,
      `hapi-swagger`,
      `hapi-auth-cookie`,
      {
        plugin: `@hapi/good`,
        options: {
          reporters: {
            console: [
              {
                module: '@hapi/good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
              },
              {
                module: '@hapi/good-console'
              },
              'stderr'
            ]
          }
        }
      },
      {
        plugin: `./src/authentication`,
        options: options.authentication
      },
      `./src/home`
    ]
  }
})
