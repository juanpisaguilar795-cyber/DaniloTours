<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Client;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // 0. Seed Admin User
        User::create([
            'name' => 'Administrador DaniloTours',
            'email' => 'admin@danilotours.com',
            'password' => Hash::make('danilo2026'),
        ]);

        // 1. Seed Colombia National Activities
        $activities = [
            [
                'name' => 'Plan San Andrés Todo Incluido',
                'description' => 'Disfruta del mar de los siete colores en San Andrés. Incluye tiquetes aéreos ida y regreso, alojamiento en hotel frente al mar, vuelta a la isla en lancha, y visita guiada a Johnny Cay y el acuario natural con avistamiento de mantarrayas.',
                'price' => 1850000.00,
                'duration_hours' => 120, // 5 días
                'location' => 'San Andrés Isla',
                'max_capacity' => 30,
                'image_url' => '/images/san_andres.jpg',
            ],
            [
                'name' => 'Tour Cartagena Histórica e Isla del Rosario',
                'description' => 'Explora la hermosa ciudad amurallada de Cartagena de Indias, visita el histórico Castillo de San Felipe de Barajas y vive un día espectacular de sol y playa en las paradisíacas Islas del Rosario con almuerzo típico caribeño incluido.',
                'price' => 950000.00,
                'duration_hours' => 72, // 3 días
                'location' => 'Cartagena, Bolívar',
                'max_capacity' => 20,
                'image_url' => '/images/cartagena.jpg',
            ],
            [
                'name' => 'Excursión Medellín y Peñol de Guatapé',
                'description' => 'Sube los 740 escalones del imponente Peñón de Guatapé para apreciar una vista panorámica inigualable del embalse. Recorre las coloridas calles del pueblo de los zócalos y disfruta de un tour guiado por los puntos clave de Medellín.',
                'price' => 480000.00,
                'duration_hours' => 48, // 2 días
                'location' => 'Guatapé, Antioquia',
                'max_capacity' => 25,
                'image_url' => '/images/medellin.jpg',
            ],
            [
                'name' => 'Plan Eje Cafetero y Valle de Cocora',
                'description' => 'Camina entre las palmas de cera más altas del mundo en el espectacular Valle de Cocora. Visita el pueblo colonial de Salento y vive una experiencia interactiva aprendiendo el proceso de cultivo y preparación en una finca cafetera tradicional.',
                'price' => 650000.00,
                'duration_hours' => 72, // 3 días
                'location' => 'Salento, Quindío',
                'max_capacity' => 15,
                'image_url' => '/images/eje_cafetero.jpg',
            ],
            [
                'name' => 'Trekking Tayrona: Cabo San Juan',
                'description' => 'Aventúrate en una caminata guiada por senderos ecológicos y bosques tropicales del Parque Nacional Tayrona hasta la playa de Cabo San Juan. Disfruta de la flora, fauna, arrecifes de coral y relájate en arenas blancas del Caribe.',
                'price' => 320000.00,
                'duration_hours' => 12, // 1 día (12 horas)
                'location' => 'Santa Marta, Magdalena',
                'max_capacity' => 15,
                'image_url' => '/images/tayrona.jpg',
            ]
        ];

        $seededActivities = [];
        foreach ($activities as $act) {
            $seededActivities[] = Activity::create($act);
        }

        // 2. Seed Clients
        $clients = [
            [
                'name' => 'Alejandro Gómez',
                'email' => 'alejandro.gomez@gmail.com',
                'phone' => '+57 312 345 6789',
                'document_id' => '1018245678',
                'address' => 'Calle 45 # 12-34, Chapinero, Bogotá D.C.',
                'notes' => 'Cliente frecuente. Prefiere tours de naturaleza e islas caribeñas.',
            ],
            [
                'name' => 'María Camila Restrepo',
                'email' => 'mcamila.restrepo@outlook.com',
                'phone' => '+57 320 987 6543',
                'document_id' => '1032456789',
                'address' => 'Carrera 15 # 85-90, Chicó, Bogotá D.C.',
                'notes' => 'Suele viajar en parejas. Interesada en fotografía y cultura.',
            ],
            [
                'name' => 'Jean-Pierre Laurent',
                'email' => 'jp.laurent@travelmail.fr',
                'phone' => '+33 6 1234 5678',
                'document_id' => 'PAS98765432',
                'address' => 'Hotel Casa Medina, Carrera 7 # 69A-22, Bogotá D.C.',
                'notes' => 'Turista extranjero (Francia). Requiere guía bilingüe en inglés o francés.',
            ],
            [
                'name' => 'Isabella Santos',
                'email' => 'isabella.santos@yahoo.com',
                'phone' => '+57 315 555 4321',
                'document_id' => '1020304050',
                'address' => 'Calle 100 # 19-50, Usaquén, Bogotá D.C.',
                'notes' => 'Prefiere actividades culturales y gastronómicas en el Eje Cafetero.',
            ]
        ];

        $seededClients = [];
        foreach ($clients as $cli) {
            $seededClients[] = Client::create($cli);
        }

        // 3. Seed Reservations
        $reservations = [
            [
                'client_id' => $seededClients[0]->id,
                'activity_id' => $seededActivities[0]->id, // San Andrés
                'reservation_date' => date('Y-m-d', strtotime('+3 days')),
                'status' => 'confirmed',
                'num_people' => 2,
                'total_price' => 3700000.00,
                'travel_notes' => 'Celebración de aniversario. Hotel Royal Decameron.',
            ],
            [
                'client_id' => $seededClients[1]->id,
                'activity_id' => $seededActivities[2]->id, // Medellín/Peñol
                'reservation_date' => date('Y-m-d', strtotime('+5 days')),
                'status' => 'confirmed',
                'num_people' => 1,
                'total_price' => 480000.00,
                'travel_notes' => 'Recoger en punto de encuentro parque El Poblado.',
            ],
            [
                'client_id' => $seededClients[2]->id,
                'activity_id' => $seededActivities[1]->id, // Cartagena
                'reservation_date' => date('Y-m-d', strtotime('+1 day')),
                'status' => 'pending',
                'num_people' => 3,
                'total_price' => 2850000.00,
                'travel_notes' => 'Requiere guía bilingüe en francés para tour histórico.',
            ],
            [
                'client_id' => $seededClients[3]->id,
                'activity_id' => $seededActivities[3]->id, // Eje Cafetero
                'reservation_date' => date('Y-m-d', strtotime('-2 days')),
                'status' => 'cancelled',
                'num_people' => 2,
                'total_price' => 1300000.00,
                'travel_notes' => 'Cancelado por reprogramación de vuelo.',
            ],
            [
                'client_id' => $seededClients[0]->id,
                'activity_id' => $seededActivities[4]->id, // Tayrona
                'reservation_date' => date('Y-m-d', strtotime('+12 days')),
                'status' => 'pending',
                'num_people' => 4,
                'total_price' => 1280000.00,
                'travel_notes' => 'Grupo familiar. Solicita carpa extra en Cabo San Juan.',
            ]
        ];

        foreach ($reservations as $res) {
            Reservation::create($res);
        }
    }
}
