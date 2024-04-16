# Viam-Grafana Plugin: Create Your Private Grafana Instance Including the Viam-Grafana Plugin

The Viam - Grafana data source plugin is open source and you can install it in any self managed Grafana instance.
The following instructions help you start your personal local Grafana instance using the official Grafana docker image.

## Install & Run Docker Container

```bash
# Pull Grafana docker image
docker pull grafana/grafana

# Start Grafana instance on port 3001 for use with a signed Viam-Grafana plugin
docker run -d --name=grafana -p 3001:3000 grafana/grafana

# If your plugin version is not signed use this command
docker run -d --name=grafana -p 3001:3000 -e GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=viam-viam-datasource grafana/grafana
```

You can now login to your Grafana instance with username: admin password: admin (Don't forget to change!!) [localhost:3001](http://localhost:3001).

## Install The Viam-Grafana Plugin

TODO: Maybe a nice way of automating it: https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/#install-plugins-from-other-sources

```bash
# You must first build and compress the plugin see above
docker cp viam-grafana-v0.0.1.tar.gz grafana:/var/lib/grafana/plugins

# Extract plugin from inside the docker container
tar -xvzf viam-grafana-v0.0.1.tar.gz
```

## Create a Grafana Dashboard with Viam Data

Dashboard configuration instructions: [Create a Viam Dashboard](configure-dashboard.md)


