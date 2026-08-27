<?php

// Force SCRIPT_NAME to root index to prevent Laravel from stripping /api prefix on Vercel
$_SERVER['SCRIPT_NAME'] = '/index.php';

// Forward all serverless request URI endpoints to Laravel's public index controller
require __DIR__ . '/../public/index.php';
