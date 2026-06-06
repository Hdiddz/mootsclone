<?php

use Illuminate\Contracts\Console\Kernel as ConsoleKernel;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

$defaults = [
    'LOG_CHANNEL' => 'stderr',
    'LOG_LEVEL' => 'error',
    'CACHE_STORE' => 'array',
    'SESSION_DRIVER' => 'cookie',
    'QUEUE_CONNECTION' => 'sync',
    'APP_CONFIG_CACHE' => '/tmp/config.php',
    'APP_EVENTS_CACHE' => '/tmp/events.php',
    'APP_PACKAGES_CACHE' => '/tmp/packages.php',
    'APP_ROUTES_CACHE' => '/tmp/routes.php',
    'APP_SERVICES_CACHE' => '/tmp/services.php',
    'VIEW_COMPILED_PATH' => '/tmp/storage/framework/views',
    'LARAVEL_STORAGE_PATH' => '/tmp/storage',
];

function mutualizmUseLaravelPath(string $path): void
{
    $path = '/'.ltrim($path, '/');

    $query = http_build_query($_GET);
    $_SERVER['REQUEST_URI'] = $path.($query !== '' ? "?{$query}" : '');
    $_SERVER['PATH_INFO'] = $path;
    $_SERVER['ORIG_PATH_INFO'] = $path;
    $_SERVER['REDIRECT_URL'] = $path;
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['PHP_SELF'] = '/index.php';
}

function mutualizmSetEnv(string $key, string $value): void
{
    putenv("{$key}={$value}");
    $_ENV[$key] = $value;
    $_SERVER[$key] = $value;
}

function mutualizmHasEnv(string $key): bool
{
    $value = getenv($key);

    return $value !== false && trim((string) $value) !== '';
}

function mutualizmPrepareServerlessDatabase(Application $app): void
{
    if (getenv('MUTUALIZM_SERVERLESS_SQLITE') !== '1') {
        return;
    }

    $database = (string) getenv('DB_DATABASE');
    $directory = dirname($database);

    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    $freshDatabase = ! file_exists($database);
    if ($freshDatabase) {
        touch($database);
    }

    $lock = fopen('/tmp/mutualizm-database.lock', 'c');
    if ($lock === false) {
        return;
    }

    try {
        flock($lock, LOCK_EX);

        $migratedFlag = '/tmp/mutualizm-database-ready.flag';
        if ($freshDatabase || ! file_exists($migratedFlag)) {
            $kernel = $app->make(ConsoleKernel::class);
            $kernel->call('migrate', [
                '--force' => true,
                '--no-interaction' => true,
            ]);

            if ($freshDatabase) {
                $kernel->call('db:seed', [
                    '--force' => true,
                    '--no-interaction' => true,
                ]);
            }

            file_put_contents($migratedFlag, (string) time());
        }
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

foreach ($defaults as $key => $value) {
    if (getenv($key) === false) {
        mutualizmSetEnv($key, $value);
    }
}

if (! mutualizmHasEnv('DATABASE_URL') && ! mutualizmHasEnv('DB_URL') && ! mutualizmHasEnv('DB_HOST')) {
    mutualizmSetEnv('DB_CONNECTION', 'sqlite');
    mutualizmSetEnv('DB_DATABASE', '/tmp/mutualizm.sqlite');
    mutualizmSetEnv('MUTUALIZM_SERVERLESS_SQLITE', '1');
}

if (isset($_GET['__laravel_path'])) {
    $path = (string) $_GET['__laravel_path'];
    unset($_GET['__laravel_path']);
    mutualizmUseLaravelPath($path);
} else {
    $currentPath = parse_url((string) ($_SERVER['REQUEST_URI'] ?? '/'), PHP_URL_PATH) ?: '/';
    $firstSegment = explode('/', trim($currentPath, '/'))[0] ?? '';
    $apiSegments = [
        'ai',
        'discover',
        'forgot-password',
        'health',
        'login',
        'logout',
        'matches',
        'me',
        'notifications',
        'profile',
        'projects',
        'register',
        'reset-password',
        'swipe',
        'users',
    ];

    if ($currentPath !== '/' && ! str_starts_with($currentPath, '/api/') && in_array($firstSegment, $apiSegments, true)) {
        mutualizmUseLaravelPath('/api'.$currentPath);
    }
}

$appKey = getenv('APP_KEY');
if ($appKey === false || trim((string) $appKey) === '') {
    $seed = getenv('VERCEL_PROJECT_PRODUCTION_URL')
        ?: getenv('VERCEL_URL')
        ?: getenv('VERCEL_GIT_REPO_ID')
        ?: 'mutualizm-vercel-fallback-key';

    $fallbackKey = 'base64:'.base64_encode(hash('sha256', 'mutualizm:'.$seed, true));

    mutualizmSetEnv('APP_KEY', $fallbackKey);
}

foreach ([
    '/tmp/storage/framework/cache/data',
    '/tmp/storage/framework/sessions',
    '/tmp/storage/framework/testing',
    '/tmp/storage/framework/views',
    '/tmp/storage/logs',
] as $directory) {
    if (! is_dir($directory)) {
        mkdir($directory, 0755, true);
    }
}

define('LARAVEL_START', microtime(true));

if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

require __DIR__.'/../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

mutualizmPrepareServerlessDatabase($app);

$app->handleRequest(Request::capture());
