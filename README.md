# Eyego DevOps Task

## Agenda

1. [Introduction](#eyego-devops-task)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Implementation Details](#implementation-details)
   - [Application](#application)
   - [Docker](#docker)
   - [Kubernetes](#kubernetes)
5. [Installation and Usage](#installation-and-usage)
   - [Local Development](#local-development)
   - [Docker Usage](#docker-usage)
   - [Kubernetes Deployment](#kubernetes-deployment)
   - [Deploying to AWS EKS](#deploying-to-aws-eks)
   - [Migrating to GCB EKS or Alibaba Cloud](#migrating-to-gcb-eks-or-alibaba-cloud)
6. [Project Structure](#project-structure)
7. [Deploy URL](#deploy-url)
8. [GitHub Actions Secrets Required](#github-actions-secrets-required)

## Features

- **Express.js**: A lightweight and flexible Node.js web application framework.
- **Dockerized**: The application is containerized for easy deployment and scalability.
- **Kubernetes Integration**: Includes Kubernetes manifests for deployment and service configuration.
- **Modular Structure**: The project is organized for maintainability and scalability.

## Prerequisites

To run this project, ensure you have the following installed:
- **Node.js**: Version 18 or higher.
- **Docker**: Latest version.
- **Kubernetes**: A working Kubernetes cluster with `kubectl` configured.

## Implementation Details

### Application
The application is implemented using Express.js. It defines a single route (`/`) that responds with a "Hello Eyego" message. The server listens on port 3000.

### Docker
The application is containerized using a `Dockerfile`. The Dockerfile:
1. Uses the `node:22-alpine` base image for a lightweight Node.js environment.
2. Sets the working directory to `/app`.
3. Copies the `package.json` and `package-lock.json` files to install dependencies.
4. Copies the application files into the container.
5. Exposes port 3000 for the application.
6. Defines the command to start the application using `npm run start`.

### Kubernetes
The Kubernetes manifests include:
- **Deployment**: Deploys two replicas of the application container.
- **Service**: Exposes the application using a LoadBalancer service on port 80, forwarding traffic to port 3000 of the container.

## Installation and Usage

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/BishoySedra/eyego-devops-task.git
   cd eyego-devops-task
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm run start
   ```

   The application will be running at [http://localhost:3000](http://localhost:3000).

### Docker Usage

1. Build the Docker image:

   ```bash
   docker build -t eyego-devops-task .
   ```

2. Run the Docker container:

   ```bash
   docker run -p 3000:3000 eyego-devops-task
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000).

### Kubernetes Deployment

1. Create a Kubernetes namespace (optional):

   ```bash
   kubectl create namespace eyego
   ```

2. Apply the Kubernetes manifests:

   ```bash
   kubectl apply -f k8s/
   ```

3. Verify the deployment:

   ```bash
   kubectl get pods -n eyego
   ```

4. Access the application:

   * Getting the external IP from load balancer service:

     ```bash
     kubectl get svc -n eyego
     ```

### Deploying to AWS EKS

1. **Push the Docker Image to Amazon ECR**:

   * Authenticate Docker with ECR:

     ```bash
     aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<your-region>.amazonaws.com
     ```
   * Create an ECR repository:

     ```bash
     aws ecr create-repository --repository-name eyego-devops-task
     ```
   * Tag and push the Docker image:

     ```bash
     docker tag eyego-devops-task:latest <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     docker push <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     ```

2. **Set Up an EKS Cluster**:

   * Create an EKS cluster using the AWS Management Console or CLI.
   * Update your `kubeconfig` to connect to the cluster:

     ```bash
     aws eks update-kubeconfig --region <your-region> --name <your-cluster-name>
     ```

3. **Update Kubernetes Manifests**:

   * Update the `image` field in the `deployment.yaml` file to point to your ECR image:

     ```yaml
     image: <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     ```

4. **Deploy the Application**:

   * Create the namespace (if not already created):

     ```bash
     kubectl create namespace eyego
     ```
   * Apply the Kubernetes manifests:

     ```bash
     kubectl apply -f k8s/ -n eyego
     ```

5. **Verify the Deployment**:

   * Check the pods:

     ```bash
     kubectl get pods -n eyego
     ```
   * Check the services:

     ```bash
     kubectl get svc -n eyego
     ```

6. **Access the Application**:

   * If using a LoadBalancer service, get the external IP:

     ```bash
     kubectl get svc -n eyego
     ```

### Migrating to GCB EKS or Alibaba Cloud

#### Google Cloud GKE

1. **Push the Docker Image to Google Container Registry (GCR)**:
   * Authenticate Docker with GCR:
     ```bash
     gcloud auth configure-docker
     ```
   * Tag and push the Docker image:
     ```bash
     docker tag eyego-devops-task:latest gcr.io/<your-project-id>/eyego-devops-task:latest
     docker push gcr.io/<your-project-id>/eyego-devops-task:latest
     ```

2. **Set Up a GKE Cluster**:
   * Create a GKE cluster using the Google Cloud Console or CLI:
     ```bash
     gcloud container clusters create <cluster-name> --zone <zone>
     ```
   * Get credentials for the cluster:
     ```bash
     gcloud container clusters get-credentials <cluster-name> --zone <zone>
     ```

3. **Update Kubernetes Manifests**:
   * Update the `image` field in the `deployment.yaml` file to point to your GCR image:
     ```yaml
     image: gcr.io/<your-project-id>/eyego-devops-task:latest
     ```

4. **Deploy the Application**:
   * Apply the Kubernetes manifests:
     ```bash
     kubectl apply -f k8s/
     ```

5. **Verify the Deployment**:
   * Check the pods and services:
     ```bash
     kubectl get pods
     kubectl get svc
     ```

#### Alibaba Cloud ACK

1. **Push the Docker Image to Alibaba Cloud Container Registry (ACR)**:
   * Log in to ACR:
     ```bash
     docker login --username=<your-username> registry.<region>.aliyuncs.com
     ```
   * Tag and push the Docker image:
     ```bash
     docker tag eyego-devops-task:latest registry.<region>.aliyuncs.com/<your-namespace>/eyego-devops-task:latest
     docker push registry.<region>.aliyuncs.com/<your-namespace>/eyego-devops-task:latest
     ```

2. **Set Up an ACK Cluster**:
   * Create an ACK cluster using the Alibaba Cloud Console or CLI.
   * Configure `kubectl` to connect to the cluster:
     ```bash
     aliyun cs DescribeClusterUserKubeconfig --ClusterId <cluster-id>
     ```

3. **Update Kubernetes Manifests**:
   * Update the `image` field in the `deployment.yaml` file to point to your ACR image:
     ```yaml
     image: registry.<region>.aliyuncs.com/<your-namespace>/eyego-devops-task:latest
     ```

4. **Deploy the Application**:
   * Apply the Kubernetes manifests:
     ```bash
     kubectl apply -f k8s/
     ```

5. **Verify the Deployment**:
   * Check the pods and services:
     ```bash
     kubectl get pods
     kubectl get svc
     ```

## Project Structure

```
eyego-devops-task/
├── index.js          # Main application file
├── package.json      # Project metadata and dependencies
├── package-lock.json # Dependency lock file
├── Dockerfile        # Docker configuration
├── .dockerignore     # Files to ignore in Docker builds
├── k8s/              # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
├── .gitignore        # Files to ignore in Git
└── README.md         # Project documentation
```

## Deploy URL

The application is deployed and accessible at:

[http://a4f242c75362c4b6db0a75827264c9f6-1159224268.eu-north-1.elb.amazonaws.com](http://a4f242c75362c4b6db0a75827264c9f6-1159224268.eu-north-1.elb.amazonaws.com)

## GitHub Actions Secrets Required

To enable CI/CD deployment to AWS using GitHub Actions, you must set the following repository secrets:

* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `AWS_REGION`
* `AWS_ACCOUNT_ID`
* `EKS_CLUSTER_NAME`

These secrets allow GitHub Actions to authenticate with AWS, push to ECR, and deploy to your EKS cluster.
