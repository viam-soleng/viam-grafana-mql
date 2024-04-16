# Viam - Grafana Data Source Plugin - Development Environment

These instructions help you with the setup of a local development environment to customize or enhance the Viam - Grafana plugin as well as building and signing the plugin for distribution.

Prerequisites:
- Docker runtime environment installed and started e.g Docker desktop

Clone the Github repository and run the following commands from the root directory.

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
