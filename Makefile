SHELL	= /bin/sh

NAME	= help-desk

# Parse .env file and fail if not found
-include .env

ifeq ($(wildcard .env),)
$(error .env file is required)
endif


# Trigger deployment by CI/CD pipeline (github actions)

update_repo:
	git pull origin main

restart_caddy_prod:
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml restart helpdesk-caddy

deploy_frontend: update_repo build_frontend_prod restart_caddy_prod

deploy_backend: update_repo
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml build
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml up -d
	docker image prune -f


# Produce common-library artifact and install into local repo
common_jar:
	cd backend/helpdesk-common-library && mvn clean install -DskipTests

# Produce backend jar artifacts
build_jars:
	cd backend && mvn clean package -DskipTests


# Clean / build frontend

clean_frontend:
	rm -rf frontend/dist
	mkdir -p frontend/dist

build_frontend_local: clean_frontend
	cd frontend && npm ci && \
	VITE_API_BASE_URL="$(API_SERVER_URL_LOCAL)" \
	VITE_CLOUDINARY_CLOUD_NAME="$(CLOUDINARY_CLOUD_NAME)" \
	VITE_CLOUDINARY_UPLOAD_PRESET="$(CLOUDINARY_UPLOAD_PRESET)" \
	VITE_CLOUDINARY_API_KEY="$(CLOUDINARY_API_KEY)" \
	npm run build

build_frontend_localprod: clean_frontend
	cd frontend && npm ci && \
	VITE_API_BASE_URL="$(API_SERVER_URL_LOCALPROD)" \
	VITE_CLOUDINARY_CLOUD_NAME="$(CLOUDINARY_CLOUD_NAME)" \
	VITE_CLOUDINARY_UPLOAD_PRESET="$(CLOUDINARY_UPLOAD_PRESET)" \
	VITE_CLOUDINARY_API_KEY="$(CLOUDINARY_API_KEY)" \
	npm run build

build_frontend_prod: clean_frontend
	cd frontend && npm ci && \
	VITE_API_BASE_URL="$(API_SERVER_URL_PROD)" \
	VITE_CLOUDINARY_CLOUD_NAME="$(CLOUDINARY_CLOUD_NAME)" \
	VITE_CLOUDINARY_UPLOAD_PRESET="$(CLOUDINARY_UPLOAD_PRESET)" \
	VITE_CLOUDINARY_API_KEY="$(CLOUDINARY_API_KEY)" \
	npm run build

# Build environments

dev: #common_jar
	docker compose --project-name helpdesk_dev \
	  -f docker-compose.dev.yml up --build

prod: build_frontend_prod build_jars
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml up --build

prod_detached: build_frontend_prod build_jars
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml up -d --build

local_prod: build_frontend_localprod build_jars
	docker compose --project-name helpdesk_localprod \
	  -f docker-compose.prod.yml -f docker-compose.localprod.yml up --build

# Maintenance tasks

clean: clean_frontend
	cd backend && mvn clean

down_dev:
	docker compose --project-name helpdesk_dev \
	  -f docker-compose.dev.yml down
stop_dev:
	docker compose --project-name helpdesk_dev \
	  -f docker-compose.dev.yml stop

down_prod:
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml down
stop_prod:
	docker compose --project-name helpdesk_prod \
	  -f docker-compose.prod.yml stop

down_prod_local:
	docker compose --project-name helpdesk_localprod \
	  -f docker-compose.prod.yml -f docker-compose.localprod.yml down
stop_prod_local:
	docker compose --project-name helpdesk_localprod \
	  -f docker-compose.prod.yml -f docker-compose.localprod.yml stop


reset:
	docker stop $$(docker ps -qa); \
	docker rm $$(docker ps -qa); \
	docker rmi -f $$(docker images -qa); \
	docker volume rm $$(docker volume ls -q); \
	docker network rm $$(docker network ls -q) 2>/dev/null


.PHONY: _no_default dev prod prod_detached local_prod \
	down_dev stop_dev down_prod stop_prod down_prod_local stop_prod_local \
	common_jar build_jars \
	clean_frontend build_frontend_local build_frontend_prod restart_caddy_prod \
	clean reset \
	update_repo deploy_frontend deploy_backend

.DEFAULT_GOAL := _no_default

_no_default:
	@echo "No default target. Please run 'make <target>'." >&2
	@exit 1