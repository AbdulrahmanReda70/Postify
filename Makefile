# Makefile for Laravel + Docker

copy-backend-env:
	cd backend && cp .env.example .env

copy-frontend-env:
	cd frontend && cp .env.example .env

# Run composer install inside the Laravel container
composer-install:
	cd backend && composer install

# Generate Laravel app key
key-generate:
	cd backend && php artisan key:generate

docker:
	docker compose up -d --build

storage-link:
	cd backend && php artisan storage:link

# Fresh setup (install + key)
setup: copy-backend-env copy-frontend-env composer-install key-generate docker storage-link