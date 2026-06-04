FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libpng-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql zip pcntl gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .
RUN composer run-script post-autoload-dump

RUN php artisan storage:link 2>/dev/null || true

EXPOSE 8080 8085

CMD php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
