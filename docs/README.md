# Viam - Grafana Documentation

The Viam - Grafana data source plugin is open source and you can install it in any self managed Grafana instance.


## Start Development Environment

Clone the Github repository and run the following commands from the root directory.

Prerequisites:
- Docker runtime environment installed and started

1. Install dependencies

   ```bash
   npm install
   ```

2. Build plugin in development mode and run in watch mode

   ```bash
   npm run dev
   ```
3. [optional] Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes, requires git init first
   npm run test

   # Exits after running all the tests
   npm run test:ci
   ```

4. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   npm run server
   ```

5. [optional] Run the E2E tests (using Cypress)

   ```bash
   # Spins up a Grafana instance first that we tests against
   npm run server

   # Starts the tests
   npm run e2e
   ```

6. [optional] Run the linter

   ```bash
   npm run lint

   # or

   npm run lint:fix
   ```

7. Open the webbrowser at [localhost:3000](http://localhost:3000) 
    - Credentials: username: admin / password: admin


## Build & Sign the Plugin

The following commad will build a deployable version into the `dist` folder.

   ```bash
   npm run build
   ```

While you can manually copy/paste the dist folder, it is more convenient to share compressed files.

TODO: Probably makes sense to rename the dist folder

    ```bash
    tar -czf viam-grafana-v0.0.1.tar.gz dist
    ```

To make sure the plugins are not altered, you also have the option of signing the plugin.
More information: [Grafana Plugin Signatures](https://grafana.com/docs/grafana/latest/administration/plugin-management/#plugin-signatures)
You can also configure your Grafana instance to allow unsigned plugins: [Allow Unsigned Plugins](https://grafana.com/docs/grafana/latest/administration/plugin-management/#allow-unsigned-plugins)

# Setup Grafana Instance (Docker)

## Install & Run Docker Container

```bash
# Pull Grafana docker image
docker pull grafana/grafana

# Start Grafana instance on port 3001
docker run -d --name=grafana -p 3001:3000 grafana/grafana
```

You can now login to your Grafana instance with username: admin password: admin (Don't forget to change!!) [localhost:3001](http://localhost:3001).



## Plugin Installation

TODO: Maybe a nice way of automating it: https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/#install-plugins-from-other-sources

```bash
# If plugin is not signed you have to start the container allowing to run unsigned plugins
docker run -d --name=grafana -p 3001:3000 -e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=viam-viam-datasource grafana/grafana

# You must first build and compress the plugin see above
docker cp viam-grafana-v0.0.1.tar.gz grafana:/var/lib/grafana/plugins

# Extract plugin from inside the docker container
tar -xvzf viam-grafana-v0.0.1.tar.gz
```

# Create a Grafana Dashboard with Viam Data

Dashboard configuration instructions: [Create a Viam Dashboard](configure-dashboard.md)


