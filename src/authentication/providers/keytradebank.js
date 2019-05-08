module.exports = function (options) {
  options = options || {}

  const uri = options.uri || 'https://sandbox.keytradebank.be/public/berlingroup'
  const scopes = options.scopes

  return {
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: uri + '/authorize',
    token: uri + '/v1/token',
    scope: scopes,
    scopeSeparator: '|',
    pkce: 'S256'
  }
}
