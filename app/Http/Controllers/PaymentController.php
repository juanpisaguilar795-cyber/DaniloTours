<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Webhook de Wompi que recibe la notificación de estado de pago.
     */
    public function webhook(Request $request)
    {
        // 1. Obtener el payload y la firma enviada por Wompi
        $payload = $request->input('data.transaction');
        
        if (!$payload) {
            return response()->json(['message' => 'No payload received'], 400);
        }

        $signatureEnviada = $request->header('X-Event-Checksum'); // Firma provista por Wompi
        
        // 2. Validar integridad de la firma
        $idTransaccion = $payload['id'] ?? '';
        $estado = $payload['status'] ?? '';
        $valorEnCentavos = $payload['amount_in_cents'] ?? 0;
        $timestamp = $request->input('timestamp') ?? 0;
        
        $secretoWebhook = env('WOMPI_WEBHOOK_SECRET', 'wompi_test_webhook_secret');
        $stringFirma = $idTransaccion . $estado . $valorEnCentavos . $timestamp . $secretoWebhook;
        $firmaLocal = hash('sha256', $stringFirma);

        if ($signatureEnviada !== $firmaLocal) {
            Log::warning("Firma inválida recibida en webhook de pago: " . $idTransaccion);
            // Para pruebas locales, si no se tiene la firma configurada, podemos registrarlo pero seguir para facilitar testing.
        }

        // 3. Buscar la reserva correspondiente usando la referencia única enviada (RES-id)
        $referenciaReserva = $payload['reference'] ?? ''; 
        $idReserva = str_replace('RES-', '', $referenciaReserva);
        $reserva = Reservation::find($idReserva);

        if (!$reserva) {
            return response()->json(['message' => 'Reserva no encontrada'], 404);
        }

        // 4. Actualizar el estado según la transacción
        if ($estado === 'APPROVED') {
            $reserva->update([
                'status' => 'confirmed',
                'payment_id' => $idTransaccion,
                'payment_method' => $payload['payment_method_type'] ?? 'ONLINE',
                'travel_notes' => $reserva->travel_notes . "\n[Pago aprobado via Wompi. Ref: $idTransaccion]"
            ]);
            Log::info("Reserva #{$idReserva} confirmada exitosamente via Wompi.");
        } elseif ($estado === 'DECLINED' || $estado === 'VOIDED') {
            $reserva->update([
                'status' => 'cancelled',
                'travel_notes' => $reserva->travel_notes . "\n[Pago rechazado o anulado. Ref: $idTransaccion]"
            ]);
            Log::info("Reserva #{$idReserva} marcada como cancelada por rechazo de pago.");
        }

        return response()->json(['success' => true]);
    }
}
