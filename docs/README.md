# Create Your Own Grafana Environment

The Viam - Grafana data source plugin is open source and you can install it in any self managed Grafana instance.
The following instructions shoulp help with setting up your own instance on private infrastructure or in the public cloud.

## On Personal Infrastructure

```bash
# Build the image for local use
docker build -t viam-grafana .

# Run the image locally
docker run -d --name=viam-grafana -p 3000:3000 viam-grafana
```

You can now login to your Grafana instance with these credentials: admin password: admin (Don't forget to change!!) [localhost:3000](http://localhost:3000).

## Deploy to GCP Kubernetes Engine "GKE"

Create a stateful Grafana instance in your private GCP environment.
The deployment is a stateful set and thus creates a persistent volume which will keep the Grafana persistent on restart / or redeployment of the workload.

### TODO
- [ ] [Add SSL certificates](https://estl.tech/configuring-https-to-a-web-service-on-google-kubernetes-engine-2d71849520d)

Create a Kubernetes cluster:

```
gcloud container clusters create-auto soleng-grafana --location=us-central1
```

Get authentication credentials for the cluster:

```
gcloud container clusters get-credentials soleng-grafana \
    --location us-central1
```

Create the deployment:

```
kubectl apply -f viam-grafana-kubdep.yaml
```

You can now login to your Grafana instance with these credentials: admin password: admin

*DO NOT FORGET TO CHANGE THE PASSWORD!*


## Finally - Configure a Dashboard Displaying Viam Data

Dashboard configuration instructions: [Create a Viam Dashboard](configure-dashboard.md)


