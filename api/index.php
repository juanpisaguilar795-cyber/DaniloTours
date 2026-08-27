<?php

// Prevent PHP from printing warnings/errors to the output buffer (prevents corrupting JSON responses)
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

// Force SCRIPT_NAME to root index to prevent Laravel from stripping /api prefix on Vercel
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Forward all serverless request URI endpoints to Laravel's public index controller
require __DIR__ . '/../public/index.php';
