PSD2 Examples
-------------

This repository attemps to document how to integrate Belgian banks using the PSD2 API.


| Bank               | Developer Portal | API Documentation | Sandbox | Key |Stub |
|--------------------|------------------|-------------------|---------|-----|-----|
| AXA                | [Yes](https://api-portal.axabank.be/) | [Yes](https://api-portal.axabank.be/apis) |         | | No |
| bPost              | [Yes](https://portal.psd2.bpostbank.be/howto) | [Yes](https://portal.psd2.bpostbank.be/apis) |         | | No |
| Belfius            | [Yes](https://developer.belfius.be/) | [Yes](https://developer.belfius.be/devportal/en/apis/index.aspx) |        | | No |
| Beobank            | [Yes](https://online.beobank.be/oauth2/nl/devportal/index.html) | [Yes](https://online.beobank.be/oauth2/nl/devportal/oauth2-spec.html) |         | | No |
| BNP Paribas Fortis | [Yes](https://developer.bnpparibasfortis.com/) | [Yes](https://developer.bnpparibasfortis.com/api-references) |        | | Yes |
| Deutche Bank       | [Yes](https://developer.db.com/)
| ING                | ?               |                   |         |     | No |
| Keytrade Bank      | [Yes](https://developer.keytradebank.be/) | [Yes](https://developer.keytradebank.be/apis) |        | | Yes |
| KBC                | [Yes](https://developer.kbc-group.com/kbc-be/en.html) | [Yes](https://developer.kbc-group.com/kbc-be/en/apis.html?zone=topnav) |         |     | No |
| Rabobank           | [Yes](https://www.rabobank.be/fr/developer)                 |                   |         |     | No |


Trust providers
---------------

https://webgate.ec.europa.eu/tl-browser/#/


Development
-----------

This service is ready to be used immediatly for prototyping.
To use it:

 1. `npm install`
 2. `npm start` (nodemon)

This service uses `nodemon` to reload the server whenever a change is made.
Currently, `/src`, `index.js` and `manifest.js` are monitored. You can change this configuration in `package.json`.


Plugins
-------

All new features added must be included as plugins.
Custom plugins must be stored in a directory under `src/` as described below.
When adding a new plugin: do not forget to include it in the `manifest.js` file.


Structure
---------

```
.
|-- README.md                    (this file)
|-- .editorconfig                (configures your editor to use correct coding style)
|-- .sequelizerc                 (configures `sequelize` cli)
|-- .npmrc                       (ensures `npm` does not pollute external directories)
|-- config.ini                   (configuration used for development)
|-- index.js                     (entry point of the application)
|-- manifest.js                  (defines which plugins and configuration is loaded)
|-- package-lock.json
|-- package.json
`-- src
    |-- database                 (database plugin)
    |   |-- config.js            (map of configuration for usage with `sequelize` cli)
    |   |-- index.js             (initialises the database connection)
    |   `-- package.json
    `-- model                    (model plugin)
        |-- index.js             (loads all models)
        |-- models               (modes must be stored here)
        `-- package.json
```
