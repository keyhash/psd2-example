module.exports = function (options) {
  options = options || {}

  const uri = options.uri || 'https://sandbox.auth.bnpparibasfortis.com'
  const scopes = options.scopes

  return {
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: uri + '/authorize',
    token: uri + '/token',
    scope: scopes,
    scopeSeparator: '|',
    headers: {
      'User-Agent': 'Keyhash Server',
      'X-Openbank-Organization': '9d234312-c347-4fca-8127-1fae5964a1e8',
      'X-Openbank-Stet-Version': '1.4.0.47.develop'
    }
  }
}
