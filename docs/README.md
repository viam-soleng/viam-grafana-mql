# Create Your Own Grafana Server

The Viam - Grafana data source plugin is open source and you can install it in any self managed Grafana instance.
The following instructions shoulp help with setting up your own instance on private infrastructure or in the public cloud.

## On Personal Infrastructure

```bash
# Build the image for local use
docker build -t viam-grafana .

# Run the image locally
docker run -d --name=viam-grafana -p 3000:3000 viam-grafana
```

You can now login to your Grafana instance with these credentials: admin password: admin (Don't forget to change!!) [localhost:3001](http://localhost:3001).

## On GCP

Additional useful links:

- [GCP Artifactory - How to upload container images](https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images)
- [GCP Cloud Run - How to deploy container](https://cloud.google.com/run/docs/deploying)

```
# Build the image
docker build -t viam-grafana --platform linux/amd64 .

# Tag the image
docker tag viam-grafana us-central1-docker.pkg.dev/shared-playground-414521/viam-soleng/viam-grafana:latest

# Upload the image to GCP Artifactory
docker push ARTIFACTORY-INSTANCE/PROJECT-ID/REPOSITORY-ID/viam-grafana:latest
```


## Finally - Configure a Dashboard Displaying Viam Data

Dashboard configuration instructions: [Create a Viam Dashboard](configure-dashboard.md)


