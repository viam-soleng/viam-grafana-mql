# Grafana Viam Data Source Frontend Plugin

This is a first version of an open source Viam - Grafana data source pluging ready for use in self managed environments.
It connects to your Viam organization on [app.viam.com](https://app.viam.com) and exposes your collected sensor data as source for configuring Grafana dashboards.

We will continue to make improvements over time therfore please don't hesitate to reach out or submit pull requests with enhancements.

## How To Setup Your Grafana Instance (Docker)
Detailed instruction on how to create your own Grafan instance, using the Grafana docker image in combination with the Viam - Grafana data source plugin: [Grafana Setup Instructions](docs/README.md)

## How To Create A Dashboard
See here for detailed instructions on how to configure your own Grafana dashboard displaying Viam data: [Configure a Dashboard](docs/configure-dashboard.md)


## TODO
1. Testing and improvements
2. make use of go for backend

## Getting started

### Frontend

1. Install dependencies

   ```bash
   npm install
   ```

2. Build plugin in development mode and run in watch mode

   ```bash
   npm run dev
   ```

3. Build plugin in production mode

   ```bash
   npm run build
   ```

4. Run the tests (using Jest)

   ```bash
   # Runs the tests and watches for changes, requires git init first
   npm run test

   # Exits after running all the tests
   npm run test:ci
   ```

5. Spin up a Grafana instance and run the plugin inside it (using Docker)

   ```bash
   npm run server
   ```

6. Run the E2E tests (using Cypress)

   ```bash
   # Spins up a Grafana instance first that we tests against
   npm run server

   # Starts the tests
   npm run e2e
   ```

7. Run the linter

   ```bash
   npm run lint

   # or

   npm run lint:fix
   ```
