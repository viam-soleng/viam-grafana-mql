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

## Upload and Run the Image on GCP

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



