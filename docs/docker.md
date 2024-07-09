# Viam Grafana MQL Plugin in Docker Container

Easiest way to spin up a docker container with the plugin preinstalled in the official Grafana container image:

```
docker run -d -p 3000:3000 --name=grafana \
  -e "GF_INSTALL_PLUGINS=https://github.com/viam-soleng/grafana-tabulardata/raw/main/releases/viam-grafana-0.3.0.zip;viam-datasource" \
  -e "GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=viam-datasource" \
  grafana/grafana
```
