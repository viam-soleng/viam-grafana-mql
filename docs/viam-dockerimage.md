# Grafana Docker Image Viam Plugin Included

To make installation and use of Grafana as simple as possible, we have created a Docker image which includes the Viam-Grafana plugin already.
Feel free to use and provide feedback / suggestions!

## Installation & Use

Build the image:

```
docker build -t viam-grafana .
```


Run the image:

```
docker run -d --name=viam-grafana -p 3000:3000 viam-grafana
```




