# Viam-Grafana Plugin Build / Release New Version

For enhancements or bug fixes we might have to release new versions of the plugin and make it available in the "releases" folder in this projects root.
You can find instructions to do so following.

## Build New Docker Image

```
# Build the image for local use
docker build -t viam-grafana .

# Or in the case you want to upload it to an image registry and your environment is different
docker build -t viam-grafana --platform linux/amd64 .
```

## Create New Plugin Release (zip file)
The zip files in the releases folder can be used for automated deployments without embedding the plugin into the image.
This process is used in the Kubernetes deployment in the [README.md](README.md)

```
# Creates the build into the "dist" folder
npm run build

# Rename the dist folder
mv dist/ viam-datasource

# Create the zip file in the `releases`folder
zip ./releases/viam-grafana-x.x.x.zip viam-datasource -r

# Verify the zip file
zipinfo releases/viam-grafana-x.x.x.zip
```
To download/reference the zip files use the following url:

https://github.com/viam-soleng/viam-grafana/raw/main/viam-datasource-0.1.0.zip

Otherwise the file will be in the wrong format!

