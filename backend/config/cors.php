    <?php

    /*
        |--------------------------------------------------------------------------
        | Cross-Origin Resource Sharing (CORS) Configuration
        |--------------------------------------------------------------------------
        |
        | Here you may configure your settings for cross-origin resource sharing
        | or "CORS". This determines what cross-origin operations may execute
        | in web browsers. You are free to adjust these settings as needed.
        |
        | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
        |
        */
    return [
        'paths' => ['api/*', 'sanctum/csrf-cookie', 'googleAuth', 'auth/*'],
        'allowed_methods' => ['*'],
        // Do not use '*' when supports_credentials is true
        'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000', 'https://d116q68nntzqo2.cloudfront.net'],
        'allowed_headers' => ['*'],
        'exposed_headers' => [],
        'max_age' => 0,
        'supports_credentials' => true,

    ];
