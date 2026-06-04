#!/bin/sh

# Run database migrations and seeders, log errors, but don't crash container startup
(php artisan migrate --force && php artisan db:seed --force) || echo "Database migration/seeding failed. Proceeding to boot server."

# Start the Laravel application server using exec to forward signals (like SIGTERM) properly
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
