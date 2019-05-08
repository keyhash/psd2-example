
Development
-----------

This service is ready to be used immediatly for prototyping.
To use it:

 1. `npm install`
 2. `docker-compose up`

This will start a MariaDB database and starts up the server which starts listening on port http://localhost:8080/.

This service uses `nodemon` to reload the server whenever a change is made.
Currently, `/src`, `index.js` and `manifest.js` are monitored. You can change this configuration in `package.json`.

If you do not desire to use docker, and prefer to connect to an existing database:
 1. Update `database.development` section in `config.ini`, to point to your database.
 2. `npm install`
 3. `npm start` (nodemon)

Production
----------

For production the following files are required:

```
.
|-- index.js
|-- manifest.js
|-- package-lock.json
|-- package.json
|-- node_modules
`-- src
```

You can then start the server with: `node index -c config.ini`

Plugins
-------

All new features added must be included as plugins.
Custom plugins must be stored in a directory under `src/` as described below.
When adding a new plugin: do not forget to include it in the `manifest.js` file.

### Models

Models must be store under the `src/model/models`. 
You can use the `sequelize` command to create models. 
When using this command the models will automatically be placed in the correct place.

You can use the `sequelize` migrations and seeders.

To avoid typing `node_modules/.bin/sequelize` and use `sequelize` cli directly add `./node_modules/.bin` to your path.
```
export PATH="$PATH:./node_modules/.bin"
```
More permanently:
```
echo 'PATH="$PATH:./node_modules/.bin"' >> ~/.bash_profile
```

Structure
---------

```
.
|-- README.md                    (this file)
|-- .editorconfig                (configures your editor to use correct coding style)
|-- .sequelizerc                 (configures `sequelize` cli)
|-- .npmrc                       (ensures `npm` does not pollute external directories)
|-- config.ini                   (configuration used for development)
|-- docker                       (requirements for docker environment)
|   |-- Dockerfile
|   |-- database                 (development database files are stored here)
|   `-- wait-for-it.sh           (script which waits for a port to be available)
|-- docker-compose.yml
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

Issues
------

When launching docker, it will change onwership of `docker/database`, preventing you to remove/change files.
You can fix this using `sudo chown $(whoami) docker/database -R`
