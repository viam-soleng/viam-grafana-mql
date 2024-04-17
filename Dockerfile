FROM grafana/grafana

WORKDIR /app

ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=viam-datasource

ADD dist /var/lib/grafana/plugins/viam-grafana

