<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PaymentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
| API prefixes all these routes with "/api" automatically.
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::apiResource('clients', ClientController::class);
Route::apiResource('activities', ActivityController::class);
Route::apiResource('reservations', ReservationController::class);
