FROM php:8.2-cli

RUN apt-get update && apt-get install -y     git unzip libpng-dev libjpeg-dev libfreetype6-dev zip     && docker-php-ext-configure gd --with-freetype --with-jpeg     && docker-php-ext-install gd pdo pdo_mysql     && pecl install redis     && docker-php-ext-enable redis

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader


RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

RUN php artisan storage:link

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000

