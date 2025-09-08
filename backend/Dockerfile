# ---------------------
# Base image
# ---------------------
FROM bitnami/laravel:latest as base

WORKDIR /app

# Install Redis extension and other dependencies
RUN install_packages make build-essential php-pear php-dev \
&& install_packages netcat-openbsd \
&& pecl install redis \
&& echo "extension=redis.so" > /opt/bitnami/php/etc/conf.d/redis.ini \
&& rm -rf /var/lib/apt/lists/*

# Copy composer files first (for better Docker layer caching)
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy the rest of the application
COPY . .

# ---------------------
# Development stage
# ---------------------
FROM base as dev

# Install dev dependencies for development
RUN composer install --optimize-autoloader

# Generate application key if it doesn't exist
RUN php artisan key:generate --force

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

# ---------------------
# Production stage
# ---------------------
FROM base as prod
RUN sed -i 's|^listen =.*|listen = 0.0.0.0:9000|' /opt/bitnami/php/etc/php-fpm.d/www.conf


# Generate application key and optimize for production
RUN php artisan key:generate --force && \
    php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache
# Use PHP-FPM in prod
CMD ["php-fpm"]
