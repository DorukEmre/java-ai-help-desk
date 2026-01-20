# java-service-desk

## Microservices Structure

1. API Gateway
    - Responsibilities:
        - Routes requests to the appropriate service (user-service or ticket-service).
        - Handles cross-cutting concerns (authentication, logging).

2. User Service
    - Responsibilities:
        - Manages user registration, authentication, and role management.
        - Interacts with MongoDB to store user data (profiles, roles, JWT tokens).
    - Cloudinary Access: None

3. Ticket Service
    - Responsibilities:
        - Manages ticket creation, updates, and status tracking.
        - Interacts with MongoDB for storing ticket details and histories.
        - Handles media uploads directly with Cloudinary and receive URLs back. Stores these URLs in MongoDB.
    - Cloudinary Access: Direct access to handle media uploads.


## Backend Directory Structure

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

## Ticket status

- Active:
    - Open: Newly created tickets that haven't been assigned.
    - Assigned: Tickets that are assigned to a user but not yet in progress.
    - In-progress: Tickets that are currently being worked on.
- Completed:
    - Closed: Tickets that have been completed and marked as such.
