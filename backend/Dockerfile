FROM bitnami/laravel:latest

WORKDIR /app

COPY . .

RUN php artisan storage:link

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
