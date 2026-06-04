FROM php:8.4-cli

# Configure apt retries to make package installation robust against network timeouts
RUN echo "Acquire::Retries \"5\";" > /etc/apt/apt.conf.d/80-retries && \
    apt-get update && apt-get install -y \
    git unzip libpq-dev libzip-dev libpng-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql zip pcntl gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Configure composer environment to prevent network timeouts
ENV COMPOSER_ALLOW_SUPERUSER=1
ENV COMPOSER_PROCESS_TIMEOUT=3600

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --no-interaction --prefer-dist

COPY . .
RUN composer run-script post-autoload-dump

RUN php artisan storage:link 2>/dev/null || true

EXPOSE 8080 8085

CMD php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
