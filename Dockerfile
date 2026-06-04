FROM php:8.4-alpine

# Set IPv4 precedence to avoid DNS/network timeout issues in cloud builds
RUN echo "precedence ::ffff:0:0/96 100" >> /etc/gai.conf

# Install git, unzip, and bash (required for Composer and scripts)
RUN apk add --no-cache git unzip bash

# Copy the pre-compiled PHP extension installer script
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/

# Install PHP extensions (speeds up compilation and auto-installs system dependencies)
RUN install-php-extensions gd pdo_mysql pdo_pgsql zip pcntl

# Copy official composer binary
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure composer environment to prevent network timeouts and enforce IPv4
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_PROCESS_TIMEOUT=3600
ENV COMPOSER_IPRESOLVE=4

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --prefer-dist

COPY . .
RUN composer run-script post-autoload-dump

RUN php artisan storage:link 2>/dev/null || true

EXPOSE 8080 8085

CMD (php artisan migrate --force && php artisan db:seed --force) || echo 'Database migrations or seeding failed' ; php artisan serve --host=0.0.0.0 --port=${PORT:-8080}

