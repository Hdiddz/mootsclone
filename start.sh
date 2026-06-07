#!/bin/sh

# Check if APP_KEY is set, print warning if missing
if [ -z "$APP_KEY" ]; then
    echo "=========================================================="
    echo "WARNING: APP_KEY is empty! Laravel will throw a 500 error."
    echo "Please configure APP_KEY in your Railway environment variables."
    echo "=========================================================="
fi

# Run database migrations and seeders, log errors, but don't crash container startup
(php artisan migrate --force && php artisan db:seed --force) || echo "Database migration/seeding failed. Proceeding to boot server."

# Start with FrankenPHP only when explicitly enabled and installed. This keeps Vercel and
# existing PHP deployments on their current path while allowing a future domain/container
# deployment to switch runtimes with USE_FRANKENPHP=1.
if [ "${USE_FRANKENPHP:-0}" = "1" ] && command -v frankenphp >/dev/null 2>&1; then
    exec frankenphp run --config /app/Caddyfile
fi

# Start the Laravel application server using exec to forward signals (like SIGTERM) properly.
exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
