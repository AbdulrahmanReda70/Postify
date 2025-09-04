FROM bitnami/laravel:latest

WORKDIR /app

RUN install_packages make build-essential php-pear php-dev \
    && pecl install redis \
    && echo "extension=redis.so" > /opt/bitnami/php/etc/conf.d/redis.ini \
    && rm -rf /var/lib/apt/lists/*

COPY . .

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
