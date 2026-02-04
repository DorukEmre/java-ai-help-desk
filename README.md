A full-stack help desk application for managing support tickets, featuring a **React**, **TypeScript**, **Bootstrap** frontend and a microservices-based backend with **Java Spring Boot**, all deployed in **Docker** containers.  

The platform incorporates **AI-driven automation** through external integrations to streamline ticket classification and handling.

A **Caddy web server** serves a static React application and reverse proxies API requests to an API Gateway.

**Cloud deployment** to **AWS EC2**.

**CI/CD** pipeline via **GitHub Actions** for automatic deployment.



## Application Architecture

![Architecture diagram](architecture_diagram.jpg)  

### Key components:

- **Frontend**: Built with **React** + **TypeScript** and **Bootstrap**
- **Backend**: Microservices powered by **Spring Boot** and **Java** in **Docker** containers
- **Database**: **MongoDB**, connected to cloud-based MongoDB Atlas service
- **Authentication**: JWT (JSON Web Tokens) with Spring Security
- **Image Handling**: Hosted on **Cloudinary** and automated image processing with AI via **Pollinations.ai**


### Microservices

**API Gateway**  

- Routes requests to the appropriate service.
- Implements JWT-based authentication for role-specific functionalities.

**User Service**  

- Manages user registration, authentication, and JWT generation.
- Stores user details and refresh tokens in MongoDB.

**Ticket Service**  

- Manages ticket creation, updates, and status tracking.
- Stores ticket details in MongoDB.
- Supports signed image uploads via Cloudinary.
- Handles AI-based image processing via Pollinations.ai endpoint.

  
#### Backend Directory Structure

Multi-module Maven project

```
backend/
├── pom.xml                     # Parent POM (packaging=pom)
└── api-gateway/                # API gateway for routing
│       └── pom.xml
├── user-service/               # User management microservice
│       └── pom.xml
└── ticket-service/             # Ticket management microservice
        └── pom.xml
```

## AI-Driven Automation

When an image is attached to a ticket, the backend service publishes an event for asynchronous processing. The image is then sent to the Pollinations.ai endpoint for AI-based analysis, enabling automatic tagging and categorisation without blocking the ticket creation flow.

## Ticket status Lifecycle

- Active:
    - Open: Newly created tickets that haven't been assigned.
    - In-progress: Tickets that are currently being worked on.
- Completed:
    - Closed: Tickets that have been completed and marked as such.

## Authentication & Authorisation (JWT)

  - Access token created by user-service on registration, login and refresh.
  - Validated by api-gateway to extract user roles for routing permission.
  - Refresh token verification performed to issue new access token.


## Hosting on AWS EC2

- Add frontend url to CORS_ALLOWED_ORIGINS in `.env` file
- Build frontend with backend api url as VITE_API_BASE_URL, see `Makefile`
- Ensure security group of EC2 instance allows HTTP (port 80) and/or HTTPS (port 443) traffic
- Update Caddyfile (Caddyfile.prod) to use the EC2 public DNS or IP.

### Central proxy Caddy

The AWS EC2 instance is running an edge proxy Caddy that binds ports 80/443 and handles all TLS certificates and HTTPS termination.
- Routes by hostname to per-app Caddy containers over a shared Docker network `proxy-network`
- Each app Caddy terminates internal HTTP and routes to its own frontend/API services via its private Docker `app-network`.
- App networks are isolated; only app Caddies are connected to the shared proxy network.

![reverse proxy diagram](architecture_ec2-reverse-proxy.jpg)


## CI / CD

- CI/CD is implemented with GitHub Actions. 
- Pushes to `main` trigger the deployment workflow.
- The workflow:
  - Detects frontend/backend changes 
  - Configures AWS credentials via AWS OIDC to assume an AWS role 
  - Runs remote commands on EC2 via AWS SSM to update the repo and trigger local build/deploy steps.
  - Make targets invoked on the instance are defined in [Makefile](Makefile):
    - `update_repo`: Pulls latest changes from origin/main.
    - `deploy_frontend`: Updates repo and rebuilds static frontend.
    - `deploy_backend`: Updates repo, and rebuilds and restarts backend services.

Required GitHub secrets:
- AWS_ACCOUNT_ID
- AWS_REGION
- SSM_INSTANCE_IDS

## How to Run

### Dev Mode

Run the application using docker-compose.dev.yml with:

``` bash
make dev
```

#### Frontend

- React app runs in a Docker container
- The ./frontend directory is mounted to /app in the container, allowing live code updates
- Served using the Vite development server
- Accessible on port 5173: http://localhost:5173

#### Backend

- Builds the common library
- Each microservice runs in a Docker container using Maven: `mvn spring-boot:run`
- Accessible at: https://localhost:443

### Prod Mode

Run the application using docker-compose.prod.yml with:

``` bash
make prod

make prod_detached # for detached background
```

#### Frontend

- React app is built statically and served by Caddy
- https://ticket-booking.dorukemre.dev/

#### Backend

- Builds Java artifacts for all services
- Each microservice Dockerfile runs the service using `java -jar app.jar`
- https://api.ticket-booking.dorukemre.dev/

### Local Prod Mode

To simulate production locally, run the application using both docker-compose.prod.yml and docker-compose.localprod.yml with:

``` bash
make local_prod
```

`docker-compose.localprod.yml` overrides `docker-compose.prod.yml` to use `Caddyfile.localprod` to serve frontend at https://localhost:5443 and backend at https://localhost:8443