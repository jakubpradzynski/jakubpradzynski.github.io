---
title: Creating a Simple Application (Backend + Frontend) on a Local Minikube K8S Cluster
author: jakubpradzynski
date: 2023-07-25 15:00:00 +0800
categories: [ IT, Kubernetes ]
tags: [ it, kubernetes, k8s, minikube, micronaut, kotlin, reactts, nginx ]
pin: true
toc: true
---

In this article, you will learn how to create a simple web application using Micronaut with Kotlin for the backend and
React with TypeScript for the frontend. We will then configure a local Kubernetes (K8S) environment using Minikube to
deploy our application. Additionally, you will learn how to prepare the necessary configuration files for K8S and deploy
an NGINX proxy to efficiently manage traffic to our application. Finally, we will add access to the application through
localhost.

# Setting up the Environment

Before we begin working on the application, make sure you have the following tools installed:

- Java Development Kit (JDK) - for Micronaut and Kotlin
- Node.js and npm - for React
- Docker - for building container images
- kubectl - for managing Kubernetes clusters
- Minikube - for the local Kubernetes cluster

Ensure that Minikube is correctly installed and running on your local machine.

```shell
minikube start
```

# Setting up Kubernetes Dashboard in Minikube

Kubernetes Dashboard is a web-based user interface that allows you to manage and monitor your Kubernetes cluster. To use
the Dashboard, we need to set it up in Minikube and access it through a web browser.

Enable the Dashboard addon in Minikube:

```shell
minikube addons enable dashboard
```

Access the Dashboard using kubectl:

```shell
minikube dashboard
```

This command will open the Kubernetes Dashboard in your default web browser.

# Generating Micronaut + Kotlin Application

Micronaut is a lightweight framework for building microservices and applications in languages like Kotlin and Java.
Let's start by creating the backend part of our application.

Install Micronaut CLI if you haven't already:

```shell
npm install -g micronaut
```

Generate a new Micronaut project with Kotlin:

```shell
mn create-app backend --lang=kotlin
```

# Generating ReactTS Application

Next, we will create the frontend of our application using React with TypeScript.

Generate a new React project with TypeScript:

```shell
npx create-react-app frontend --template typescript
```

# Preparing K8S cluster

With the backend and frontend applications prepared, let's proceed to deploy them on the Minikube Kubernetes cluster.

## Build container images for the backend and frontend applications

In the backend directory add `Dockerfile`
```dockerfile
FROM eclipse-temurin:17
ADD build/libs/backend-0.1-all.jar backend.jar
ENTRYPOINT ["java", "-jar", "/backend.jar"]
```

and execute:

```shell
./gradlew shadowJar
docker build -t my-backend-image .
minikube image load my-backend-image
```

In the frontend directory add `Dockerfile`
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
CMD ["npm", "start"]
```

and execute:
```shell
docker build -t my-frontend-image .
minikube image load my-frontend-image
```

## Prepare configuration files for K8S

Sample configuration for the backend (backend-deployment.yaml):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "backend"
spec:
  selector:
    matchLabels:
      app: "backend"
  template:
    metadata:
      labels:
        app: "backend"
    spec:
      containers:
        - name: "backend"
          image: "my-backend-image:latest"
          imagePullPolicy: Never
          ports:
            - name: http
              containerPort: 8080
          readinessProbe:
            httpGet:
              path: /health/readiness
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 3
          livenessProbe:
            httpGet:
              path: /health/liveness
              port: 8080
            initialDelaySeconds: 5
            timeoutSeconds: 3
            failureThreshold: 10
---
apiVersion: v1
kind: Service
metadata:
  name: "backend"
spec:
  selector:
    app: "backend"
  type: ClusterIP
  ports:
    - protocol: "TCP"
      port: 8080
      targetPort: 8080⏎
```

Sample configuration for the frontend (frontend-deployment.yaml):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "frontend"
spec:
  selector:
    matchLabels:
      app: "frontend"
  template:
    metadata:
      labels:
        app: "frontend"
    spec:
      containers:
        - name: "frontend"
          image: "my-frontend-image:latest"
          imagePullPolicy: Never
          ports:
            - name: http
              containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: "frontend"
spec:
  selector:
    app: "frontend"
  type: ClusterIP
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000⏎
```

Deploying to Minikube K8S:

Ensure that Minikube is running and kubectl is correctly configured to work with the Minikube cluster.

Execute:

```shell
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
```

## Preparing Files for NGINX Proxy Deployment

To effectively manage traffic to our backend and frontend applications, we will use an NGINX proxy.

Prepare the configuration file for NGINX (nginx.conf):

```
events {
    worker_connections  1024;
}
http {
    upstream backend {
        server backend:8080;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;

        location /api/ {
            proxy_pass http://backend;
        }

        location / {
            proxy_pass http://frontend;
        }
    }
}
```

Dockerfile which uses above configuration:
```dockerfile
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/default.conf && rm -rf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx
```

Build the image and add to Minikube:
```shell
docker build -t nginx .
minikube image load nginx
```

And configuration file for K8S deployment (nginx-deployment.yaml):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: "nginx"
spec:
  selector:
    matchLabels:
      app: "nginx"
  template:
    metadata:
      labels:
        app: "nginx"
    spec:
      containers:
        - name: "nginx"
          image: "nginx:latest"
          imagePullPolicy: Never
          ports:
            - name: http
              containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: "nginx"
spec:
  selector:
    app: "nginx"
  type: NodePort
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 31000
```

Execute:

```shell
kubectl apply -f nginx-config.yaml
```

Now you should be able to see all deployments and services in kubernetes dashboard.

# Accessing the Application through Localhost

To access the application through localhost, we need to expose only the NGINX proxy service and configure it to route
traffic internally within the cluster.

Expose the NGINX proxy service:

```shell
minikube service nginx --url
```

Now you should be able to access the application through your browser using the URL given by command above.

Please note that the backend and frontend services are not directly accessible from localhost. The NGINX proxy will
handle routing traffic internally within the cluster, providing a seamless experience for the users.

# Summary

Congratulations! You have successfully created a simple application consisting of a backend built with Micronaut and
Kotlin and a frontend using React with TypeScript. Additionally, you have learned how to prepare configuration files for
the Minikube Kubernetes cluster, deploy an NGINX proxy to efficiently manage traffic to the applications, and access the
application through localhost. You can now experiment with expanding your application or further explore Kubernetes and
web application development. Happy learning and developing!
