<?php

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

foreach ($defaults as $key => $value) {
    if (getenv($key) === false) {
        putenv("{$key}={$value}");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;
    }
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

    putenv("APP_KEY={$fallbackKey}");
    $_ENV['APP_KEY'] = $fallbackKey;
    $_SERVER['APP_KEY'] = $fallbackKey;
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

require __DIR__.'/../public/index.php';
