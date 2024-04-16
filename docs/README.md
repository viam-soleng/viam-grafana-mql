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


## Build the Grafana Plugin



## Setup & Installation


## Data Source Configuration


## Query Viam Cloud with MQL


## Create a Dashboard


## Additional Resources


