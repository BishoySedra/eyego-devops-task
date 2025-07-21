# Eyego DevOps Task

This project is a simple Node.js application built using Express.js. It is designed to demonstrate the deployment of a containerized application using Docker and Kubernetes. The application serves a basic "Hello Eyego" message on the root endpoint.

## Features

- **Express.js**: A lightweight and flexible Node.js web application framework.
- **Dockerized**: The application is containerized for easy deployment and scalability.
- **Kubernetes Integration**: Includes Kubernetes manifests for deployment, service, and ingress configuration.
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
- **Ingress**: Configures an ingress resource to route traffic to the application using the hostname `eyego.local`.

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
   - If using a LoadBalancer service, get the external IP:
     ```bash
     kubectl get svc -n eyego
     ```
   - If using Ingress, ensure your Ingress controller is set up and access the application via the hostname `eyego.local`.

### Deploying to AWS EKS

1. **Push the Docker Image to Amazon ECR**:
   - Authenticate Docker with ECR:
     ```bash
     aws ecr get-login-password --region <your-region> | docker login --username AWS --password-stdin <your-account-id>.dkr.ecr.<your-region>.amazonaws.com
     ```
   - Create an ECR repository:
     ```bash
     aws ecr create-repository --repository-name eyego-devops-task
     ```
   - Tag and push the Docker image:
     ```bash
     docker tag eyego-devops-task:latest <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     docker push <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     ```

2. **Set Up an EKS Cluster**:
   - Create an EKS cluster using the AWS Management Console or CLI.
   - Update your `kubeconfig` to connect to the cluster:
     ```bash
     aws eks update-kubeconfig --region <your-region> --name <your-cluster-name>
     ```

3. **Update Kubernetes Manifests**:
   - Update the `image` field in the [deployment.yaml](http://_vscodecontentref_/1) file to point to your ECR image:
     ```yaml
     image: <your-account-id>.dkr.ecr.<your-region>.amazonaws.com/eyego-devops-task:latest
     ```

4. **Deploy the Application**:
   - Create the namespace (if not already created):
     ```bash
     kubectl create namespace eyego
     ```
   - Apply the Kubernetes manifests:
     ```bash
     kubectl apply -f k8s/ -n eyego
     ```

5. **Verify the Deployment**:
   - Check the pods:
     ```bash
     kubectl get pods -n eyego
     ```
   - Check the services:
     ```bash
     kubectl get svc -n eyego
     ```

6. **Access the Application**:
   - If using a LoadBalancer service, get the external IP:
     ```bash
     kubectl get svc -n eyego
     ```
   - If using Ingress, configure your DNS to point to the Ingress controller's external IP and access the app via `http://eyego.local`.

## Project Structure

```
eyego-devops-task/
├── index.js          # Main application file
├── package.json      # Project metadata and dependencies
├── Dockerfile        # Docker configuration
├── .dockerignore     # Files to ignore in Docker builds
├── k8s/              # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── .gitignore        # Files to ignore in Git
└── README.md         # Project documentation
```

## License

This project is licensed under the ISC License.