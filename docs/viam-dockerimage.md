# Grafana Docker Image Viam Plugin Included

To make installation and use of Grafana as simple as possible, we have created a Docker image which includes the Viam-Grafana plugin already.
Feel free to use and provide feedback / suggestions!

## Local Use

```
# Build the image for local use
docker build -t viam-grafana .

# Run the image locally
docker run -d --name=viam-grafana -p 3000:3000 viam-grafana
```

## Upload and Run the Image on GCP Cloud Run

Additional useful links:

- [GCP Artifactory - How to upload container images](https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images)
- [GCP Cloud Run - How to deploy container](https://cloud.google.com/run/docs/deploying)

```
# Build the image
docker build -t viam-grafana --platform linux/amd64 .

# Tag the image
docker tag viam-grafana us-central1-docker.pkg.dev/shared-playground-414521/viam-soleng/viam-grafana:latest

# Upload the image to GCP Artifactory
docker push us-central1-docker.pkg.dev/PROJECT-ID/REPOSITORY-ID/viam-grafana:latest
```

## Run the Image on GCP Kubernetes Engine "GKE"

Create a stateful Grafana instance in your private GCP environment.
The deployment is a stateful set and thus creates a persistent volume which will keep the Grafana persistent on restart / or redeployment of the workload.

Create a Kubernetes cluster:

```
gcloud container clusters create-auto soleng-grafana \                                                        
    --location=us-central1
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





