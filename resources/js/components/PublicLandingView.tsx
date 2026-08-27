import React, { useState, useEffect } from 'react';

interface Activity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  location: string;
  max_capacity: number;
  image_url: string;
  itinerary: string[];
  includes: string[];
  excludes: string[];
  schedule: string;
}

const HARDCODED_ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Plan San Andrés Todo Incluido',
    description: 'Disfruta del mar de los siete colores en San Andrés. Incluye tiquetes aéreos ida y regreso, alojamiento en hotel frente al mar, vuelta a la isla en lancha, y visita guiada a Johnny Cay y el acuario natural con avistamiento de mantarrayas.',
    price: 1850000,
    duration_hours: 120, // 5 días
    location: 'San Andrés Isla',
    max_capacity: 30,
    image_url: '/images/san_andres.jpg',
    schedule: 'Salidas todos los miércoles y sábados a las 6:00 AM',
    itinerary: [
      'Día 1: Recepción en el aeropuerto Gustavo Rojas Pinilla, traslado privado al hotel frente al mar y acomodación. Tarde libre de descanso.',
      'Día 2: Desayuno buffet. Gran tour de vuelta a la isla en lancha rápida visitando la hermosa bahía interna y el soplador natural.',
      'Día 3: Excursión de día completo al espectacular cayo Johnny Cay y el acuario natural con avistamiento de mantarrayas y almuerzo típico.',
      'Día 4: Día de descanso libre para compras en el centro libre de impuestos o actividades de buceo guiadas.',
      'Día 5: Desayuno, mañana libre de playa, check-out y traslado al aeropuerto para emprender el vuelo de retorno.'
    ],
    includes: [
      'Tiquetes aéreos de ida y regreso con equipaje de bodega',
      'Alojamiento de 4 noches en habitación seleccionada con aire acondicionado',
      'Alimentación con tres comidas diarias en sistema buffet',
      'Bebidas refrescantes y licores nacionales ilimitados en el hotel',
      'Excursión marítima a Johnny Cay y el Acuario (con chaleco salvavidas)',
      'Seguro de asistencia médica integral'
    ],
    excludes: [
      'Tarjeta de entrada de turismo a la isla (aprox. $139,000 COP a pagar en aeropuerto)',
      'Actividades náuticas motorizadas de tipo personal',
      'Servicios complementarios de lavandería o llamadas internacionales'
    ]
  },
  {
    id: 2,
    name: 'Tour Cartagena Histórica e Isla del Rosario',
    description: 'Explora la hermosa ciudad amurallada de Cartagena de Indias, visita el histórico Castillo de San Felipe de Barajas y vive un día espectacular de sol y playa en las paradisíacas Islas del Rosario con almuerzo típico caribeño incluido.',
    price: 950000,
    duration_hours: 72, // 3 días
    location: 'Cartagena, Bolívar',
    max_capacity: 20,
    image_url: '/images/cartagena.jpg',
    schedule: 'Salidas diarias a las 7:30 AM',
    itinerary: [
      'Día 1: Recibimiento en el hotel de Cartagena, check-in. Por la tarde, recorrido a pie histórico con guía certificado por las murallas, plazas y calles coloniales.',
      'Día 2: Desayuno. Visita guiada al imponente Castillo de San Felipe de Barajas y ascenso al histórico Convento de la Popa.',
      'Día 3: Embarque en el muelle de la Bodeguita en lancha rápida hacia las Islas del Rosario. Baño de mar cristalino y almuerzo típico caribeño en playa privada.'
    ],
    includes: [
      'Transportes terrestres climatizados y traslados en lanchas rápidas compartidas',
      'Alojamiento de 2 noches en hotel turístico con desayuno incluido',
      'Guía turístico bilingüe profesional durante los recorridos históricos',
      'Entradas al Castillo de San Felipe y al Convento de la Popa',
      'Almuerzo típico caribeño (pescado frito, arroz con coco y patacón) en Islas del Rosario'
    ],
    excludes: [
      'Impuesto de zarpe en el muelle de la Bodeguita',
      'Entradas a monumentos o museos no especificados en el itinerario',
      'Cenas y consumo de bebidas alcohólicas adicionales'
    ]
  },
  {
    id: 3,
    name: 'Excursión Medellín y Peñol de Guatapé',
    description: 'Sube los 740 escalones del imponente Peñón de Guatapé para apreciar una vista panorámica inigualable del embalse. Recorre las coloridas calles del pueblo de los zócalos y disfruta de un tour guiado por los puntos clave de Medellín.',
    price: 480000,
    duration_hours: 48, // 2 días
    location: 'Guatapé, Antioquia',
    max_capacity: 25,
    image_url: '/images/medellin.jpg',
    schedule: 'Salidas los días viernes a las 9:00 PM desde Bogotá',
    itinerary: [
      'Día 1: Llegada a Medellín. Desayuno típico. Recorrido en Metro y Metrocable, visita a la Plaza de las Esculturas de Botero, el Parque Explora (exterior) y Pueblito Paisa.',
      'Día 2: Traslado matutino hacia Guatapé. Ascenso a la gran Piedra del Peñol para observar la represa. Recorrido en barco por el embalse y caminata por el colorido Pueblo de los Zócalos.'
    ],
    includes: [
      'Transporte terrestre ida y regreso en bus de turismo de dos pisos',
      'Alojamiento de 1 noche en hotel en la zona de El Poblado con desayuno',
      'Paseo guiado en barco por el embalse de Guatapé con música a bordo',
      'Coordinador de viaje permanente y tarjeta de asistencia médica'
    ],
    excludes: [
      'Ticket de ascenso a la piedra del Peñol (aprox. $25,000 COP)',
      'Almuerzos y cenas durante el recorrido',
      'Ingresos a parques o atracciones opcionales'
    ]
  },
  {
    id: 4,
    name: 'Plan Eje Cafetero y Valle de Cocora',
    description: 'Camina entre las palmas de cera más altas del mundo en el espectacular Valle de Cocora. Visita el pueblo colonial de Salento y vive una experiencia interactiva aprendiendo el proceso de cultivo y preparación en una finca cafetera tradicional.',
    price: 650000,
    duration_hours: 72, // 3 días
    location: 'Salento, Quindío',
    max_capacity: 15,
    image_url: '/images/eje_cafetero.jpg',
    schedule: 'Salidas los días jueves a las 10:00 PM desde Bogotá',
    itinerary: [
      'Día 1: Llegada al departamento del Quindío. Traslado a Salento y trekking ecológico guiado en el Valle de Cocora entre las palmas de cera.',
      'Día 2: Desayuno. Visita interactiva a una finca cafetera tradicional. Recorrido de los cafetales aprendiendo el proceso y degustación de café premium.',
      'Día 3: Desayuno. Visita de día completo a los famosos Termales de Santa Rosa de Cabal para disfrutar de baños de agua caliente natural en cascada.'
    ],
    includes: [
      'Transporte terrestre privado ida y regreso y traslados internos en vehículos tipo Jeep Willy',
      'Alojamiento de 2 noches en típica finca cafetera campestre con piscina',
      'Entradas y pasaportes a las termales de Santa Rosa y la finca cafetera',
      'Desayunos diarios campesinos y asistencia médica'
    ],
    excludes: [
      'Almuerzos y cenas',
      'Gastos de índole personal o compras de café para llevar',
      'Cabalgatas opcionales en el Valle de Cocora'
    ]
  },
  {
    id: 5,
    name: 'Trekking Tayrona: Cabo San Juan',
    description: 'Aventúrate en una caminata guiada por senderos ecológicos y bosques tropicales del Parque Nacional Tayrona hasta la playa de Cabo San Juan. Disfruta de la flora, fauna, arrecifes de coral y relájate en arenas blancas del Caribe.',
    price: 320000,
    duration_hours: 12, // 1 día (12 horas)
    location: 'Santa Marta, Magdalena',
    max_capacity: 15,
    image_url: '/images/tayrona.jpg',
    schedule: 'Salidas diarias a las 6:30 AM desde Santa Marta o Rodadero',
    itinerary: [
      'Día Único: Registro en la entrada de Cañaveral. Caminata ecológica guiada de 2 horas cruzando senderos, puentes colgantes, playas de Arrecifes y la Piscina Natural. Llegada a Cabo San Juan para tarde libre de baño y sol. Retorno caminando al atardecer.'
    ],
    includes: [
      'Transporte terrestre en van con aire acondicionado ida y regreso',
      'Boleto de ingreso nacional al Parque Nacional Natural Tayrona',
      'Guía profesional de turismo especializado en senderismo y paramédico',
      'Seguro de asistencia médica extremo para áreas naturales'
    ],
    excludes: [
      'Alimentación y bebidas (se detiene en zonas de restaurante local)',
      'Alquiler opcional de caballos para el sendero (aprox. $40,000 COP por trayecto)',
      'Impuestos de ingreso para turistas extranjeros'
    ]
  }
];

interface PublicLandingViewProps {
  onEnterAdmin: () => void;
}

export default function PublicLandingView({ onEnterAdmin }: PublicLandingViewProps) {
  const [activities] = useState<Activity[]>(HARDCODED_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalView, setModalView] = useState<'details' | 'booking'>('details');
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % activities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const handlePrevHeroImage = () => {
    setCurrentHeroImageIndex((prevIndex) => (prevIndex - 1 + activities.length) % activities.length);
  };

  const handleNextHeroImage = () => {
    setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % activities.length);
  };

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [date, setDate] = useState('');
  const [numPeople, setNumPeople] = useState('1');
  const [notes, setNotes] = useState('');

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);
  const [showPoliciesText, setShowPoliciesText] = useState(false);

  // Get duration descriptive label
  const getDurationLabel = (hours: number) => {
    if (hours >= 24) {
      const days = Math.round(hours / 24);
      return `${days} Días / ${days - 1} Noches`;
    }
    return `${hours} Horas`;
  };

  // Format currency
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Calculate discounted rate per person dynamically
  const getDiscountedRate = (price: number, people: number) => {
    if (people === 2) return price * 0.95;
    if (people === 3) return price * 0.92;
    if (people >= 4) return price * 0.88;
    return price;
  };

  const handleOpenDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalView('details');
    setBookingError(null);
    setBookingSuccess(null);
    setAcceptedPolicies(false);
    setShowPoliciesText(false);
    // Set tomorrow as default date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  };

  const handleCloseBooking = () => {
    setSelectedActivity(null);
    setName('');
    setEmail('');
    setPhone('');
    setDocumentId('');
    setNumPeople('1');
    setNotes('');
    setBookingError(null);
    setBookingSuccess(null);
    setAcceptedPolicies(false);
    setShowPoliciesText(false);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError(null);

    try {
      // 1. Check if client already exists by searching Document ID
      const searchRes = await fetch(`/api/clients?search=${encodeURIComponent(documentId)}`);
      const searchData = await searchRes.json();

      let clientId;

      if (searchData.length > 0) {
        clientId = searchData[0].id;
      } else {
        // Create new client
        const clientRes = await fetch('/api/clients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            document_id: documentId
          })
        });

        if (!clientRes.ok) {
          const errData = await clientRes.json();
          const validationMsg = errData.errors
            ? Object.values(errData.errors).flat().join(', ')
            : 'Error al registrar la información del cliente.';
          throw new Error(validationMsg);
        }

        const newClient = await clientRes.json();
        clientId = newClient.id;
      }

      // 2. Register Reservation
      const reservationRes = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          activity_id: selectedActivity?.id,
          reservation_date: date,
          num_people: parseInt(numPeople, 10),
          status: 'pending',
          travel_notes: notes
        })
      });

      if (!reservationRes.ok) {
        const errData = await reservationRes.json();
        const validationMsg = errData.errors
          ? Object.values(errData.errors).flat().join(', ')
          : (errData.message || 'Error al guardar tu reserva.');
        throw new Error(validationMsg);
      }

      const reservationData = await reservationRes.json();
      setBookingSuccess(reservationData);
    } catch (err: any) {
      setBookingError(err.message || 'Ocurrió un error inesperado al procesar la reserva.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="landing-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>

      {/* Top Contact Bar */}
      {!isMobile && (
        <div style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '0.4rem 2.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a
              href="https://instagram.com/danilotourst"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#E1306C')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            >
              <svg style={{ width: '0.95rem', height: '0.95rem', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              <span>@danilotourst</span>
            </a>
            <span style={{ color: '#374151' }}>|</span>
            <a
              href="https://tiktok.com/@agencia_danilotours"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#FFFFFF', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#00f2fe')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#FFFFFF')}
            >
              <svg style={{ width: '0.95rem', height: '0.95rem', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.24-.24V14c0 3.86-2.52 7.42-6.24 8.4-3.72.98-7.85-.45-9.87-3.82-2.02-3.37-1.41-7.98 1.48-10.66 2.89-2.68 7.37-2.73 10.3-.12V4.08C12.522 2.72 12.53 1.37 12.525.02zM12.01 18.01c1.8-.02 3.4-1.33 3.8-3.08.4-1.75-.41-3.67-1.95-4.57-.46-.27-.98-.44-1.52-.5v3.47c.5.07.96.34 1.25.75.29.41.38.93.25 1.42-.13.49-.49.88-.95 1.05-.46.17-.98.13-1.4-.1-.42-.23-.71-.65-.79-1.12H7.25c.08 1.94 1.44 3.65 3.32 4.09.47.11.96.11 1.44.09z" /></svg>
              <span>@agencia_danilotours</span>
            </a>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ color: '#25B45A', fontWeight: 'bold' }}> Lun a Sáb: 8:00 am - 6:00 pm</span>
            <button
              onClick={onEnterAdmin}
              style={{ background: 'transparent', border: '1px solid #0A74C9', color: '#0A74C9', padding: '0.2rem 0.6rem', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 'bold' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Administración
            </button>
          </div>
        </div>
      )}

      <header style={{ height: isMobile ? '70px' : '85px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7EB', padding: isMobile ? '0 1rem' : '0 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', position: 'relative', zIndex: 100 }}>
        <div className="header-logo-container" style={{ width: isMobile ? '120px' : '220px' }}>
          <img
            src="/images/logo.png"
            alt="DaniloTours Logo"
            style={{
              position: 'absolute',
              top: '56%',
              left: '10px',
              transform: 'translateY(-50%)',
              height: isMobile ? '95px' : '125px',
              width: 'auto',
              objectFit: 'contain',
              zIndex: 110,
              pointerEvents: 'none'
            }}
          />
        </div>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: '2rem', fontWeight: '700', fontSize: '0.95rem' }}>
            <a href="#inicio" style={{ color: '#111111', textDecoration: 'none' }}>Inicio</a>
            <a href="#tours" style={{ color: '#4B5563', textDecoration: 'none' }}>Planes Turísticos</a>
            <a href="#contacto" style={{ color: '#4B5563', textDecoration: 'none' }}>Contacto</a>
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://wa.me/573162531293?text=%C2%A1Hola!%20Estoy%20interesado%20en%20conocer%20m%C3%A1s%20sobre%20los%20planes%20tur%C3%ADsticos%20de%20DaniloTours."
            target="_blank"
            rel="noreferrer"
            style={isMobile ? {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              textDecoration: 'none',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              boxShadow: '0 4px 10px rgba(37,211,102,0.2)'
            } : {
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#25D366',
              color: '#FFFFFF',
              textDecoration: 'none',
              padding: '0.65rem 1.25rem',
              borderRadius: '30px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(37,211,102,0.15)',
              fontSize: '0.9rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width={isMobile ? "22" : "18"} height={isMobile ? "22" : "18"} viewBox="0 0 448 512" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l112.5-29.5c32.5 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-66.8 17.5 17.8-65.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
            {!isMobile && <span>Preguntar por WhatsApp</span>}
          </a>

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#111111',
                padding: '0.35rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 120
              }}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation Dropdown Menu */}
      {isMobile && mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            width: '100%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #E5E7EB',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 1.5rem',
            gap: '1rem',
            animation: 'slideUp 0.2s ease-out'
          }}
        >
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#111111', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}
          >
            Inicio
          </a>
          <a
            href="#tours"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#111111', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem 0', borderBottom: '1px solid #F3F4F6' }}
          >
            Planes Turísticos
          </a>
          <a
            href="#contacto"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#111111', textDecoration: 'none', fontWeight: 'bold', fontSize: '1rem', padding: '0.5rem 0' }}
          >
            Contacto
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section id="inicio" style={{
        display: isMobile ? 'flex' : 'grid',
        flexDirection: isMobile ? 'column' : undefined,
        gridTemplateColumns: isMobile ? undefined : 'repeat(12, 1fr)',
        gap: isMobile ? '2rem' : '3rem',
        padding: isMobile ? '2.5rem 1.25rem' : '4rem 2.5rem',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        alignItems: 'center'
      }}>
        <div style={{
          gridColumn: isMobile ? undefined : 'span 7',
          width: isMobile ? '100%' : undefined,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '1.25rem',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          <h1 style={{
            fontSize: isMobile ? '2.25rem' : '3.25rem',
            fontWeight: '800',
            color: '#111111',
            lineHeight: '1.05',
            letterSpacing: '-0.03em'
          }}>
            PAQUETES TURÍSTICOS EN <span style={{ color: '#0A74C9' }}>COLOMBIA</span>
          </h1>
          <p style={{ fontSize: isMobile ? '0.95rem' : '1.1rem', color: '#4B5563', lineHeight: '1.6', margin: '0.25rem 0' }}>
            Descubre la magia de viajar por todo el país. Desde las playas cristalinas de San Andrés y la historia de Cartagena, hasta el verde Valle de Cocora y las hermosas calles de Antioquia.
          </p>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            margin: isMobile ? '0.5rem auto 1rem' : '0.25rem 0 0.75rem',
            padding: 0,
            textAlign: 'left'
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: '#25B45A', fontSize: '1.1rem', fontWeight: 'bold' }}>✓</span> Planes Todo Incluido con tiquetes, hoteles y traslados
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: '#25B45A', fontSize: '1.1rem', fontWeight: 'bold' }}>✓</span> Guías turísticos profesionales y certificados
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563', fontSize: '0.95rem', fontWeight: '600' }}>
              <span style={{ color: '#25B45A', fontSize: '1.1rem', fontWeight: 'bold' }}>✓</span> Asistencia personalizada 24/7 en tu viaje
            </li>
          </ul>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a
              href="#tours"
              className="btn-primary"
              style={{ padding: '0.9rem 2.25rem', textDecoration: 'none', fontSize: '1rem', display: 'inline-flex', boxShadow: '0 4px 12px rgba(10, 116, 201, 0.25)' }}
            >
              ¡RESERVA AHORA!
            </a>
          </div>
        </div>

        {/* Hero Interactive Slideshow */}
        <div style={{
          gridColumn: isMobile ? undefined : 'span 5',
          height: isMobile ? '280px' : '420px',
          width: isMobile ? '100%' : undefined,
          maxWidth: isMobile ? '450px' : 'none',
          position: 'relative',
          margin: isMobile ? '1rem auto 0' : '0'
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 15px 30px rgba(0,0,0,0.12)', border: '4px solid #FFFFFF', position: 'relative' }}>
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: index === currentHeroImageIndex ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                  zIndex: index === currentHeroImageIndex ? 1 : 0,
                }}
              >
                <img
                  src={activity.image_url}
                  alt={activity.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}

            {/* Left navigation arrow */}
            <button
              onClick={handlePrevHeroImage}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(10, 116, 201, 0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            {/* Right navigation arrow */}
            <button
              onClick={handleNextHeroImage}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: 'none',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(10, 116, 201, 0.8)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          {/* Dynamic location label badge matching current image */}
          <div style={{ position: 'absolute', bottom: '-15px', left: '-15px', backgroundColor: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '10px', boxShadow: '0 8px 16px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', zIndex: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#111111' }}>
                {activities[currentHeroImageIndex]?.name}
              </span>
              <span style={{ fontSize: '0.65rem', color: '#4B5563', fontWeight: 'bold' }}>
                {activities[currentHeroImageIndex]?.location}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tours Section */}
      <section id="tours" style={{ padding: '4rem 2.5rem', flexGrow: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#111111', textTransform: 'uppercase' }}>
            Nuestros Planes Turísticos Destacados
          </h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#25B45A', margin: '0.75rem auto 0.75rem' }}></div>
          <p style={{ color: '#4B5563', maxWidth: '600px', margin: '0 auto' }}>
            Selecciona tu destino ideal en toda Colombia. Planes con tiquetes, alojamiento, guías profesionales y cupos garantizados.
          </p>
        </div>

        <div className="grid-view">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="activity-card-image-container">
                <img
                  src={activity.image_url || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800'}
                  alt={activity.name}
                  className="activity-card-image"
                />
                <div className="activity-card-price-badge">
                  {formatCOP(activity.price)}
                </div>
                <div style={{ position: 'absolute', top: '1rem', left: '1rem', backgroundColor: '#25B45A', color: '#FFFFFF', fontWeight: '800', fontSize: '0.8rem', padding: '0.3rem 0.75rem', borderRadius: '4px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                </div>
              </div>

              <div className="activity-card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#0A74C9', fontWeight: 'bold', textTransform: 'uppercase' }}>
                </div>
                <h3 className="activity-card-title">{activity.name}</h3>
                <p className="activity-card-description">{activity.description}</p>

                <div className="activity-meta-details" style={{ marginTop: 'auto' }}>
                  <div className="activity-meta-item">
                    <span>👥 Capacidad: <strong>{activity.max_capacity} personas</strong></span>
                  </div>
                </div>
              </div>

              <div className="activity-card-actions">
                <button
                  onClick={() => handleOpenDetails(activity)}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  ¡RESERVA AHORA!
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking Form Banner */}
      <section style={{ backgroundColor: '#0A74C9', padding: '3rem 2.5rem', textAlign: 'center', color: '#FFFFFF' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: '0.5rem' }}>
          ¿QUIERES PERSONALIZAR TU PLAN TURÍSTICO?
        </h2>
        <p className="banner-schedule" style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem', color: '#E3F2FD', padding: '0 1rem', lineHeight: '1.5' }}>
          Lunes a Sábado: 8:15 am - 6:00 pm <span className="schedule-divider">|</span> Domingos: 8:00 am - 4:00 pm
        </p>
        <a
          href="https://wa.me/573162531293?text=%C2%A1Hola!%20Estoy%20interesado%20en%20conocer%20m%C3%A1s%20sobre%20los%20planes%20tur%C3%ADsticos%20de%20DaniloTours."
          target="_blank"
          rel="noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#FFFFFF', color: '#0A74C9', padding: '0.85rem 2rem', borderRadius: '30px', fontWeight: '800', textDecoration: 'none', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}
        >
          HABLA CON UN ASESOR
        </a>
      </section>

      {/* Footer (Bogotravel Inspired) */}
      <footer id="contacto" style={{ backgroundColor: '#111111', color: '#FFFFFF', padding: '4rem 2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '2.5rem', maxWidth: '1200px', margin: '0 auto', borderBottom: '1px solid #222222', paddingBottom: '3rem' }}>

          {/* Col 1 */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#FFFFFF', borderBottom: '2px solid #25B45A', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
              DaniloTours
            </h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', lineHeight: '1.6' }}>
              Operadora de Turismo con sede en Bogotá, especializada en ofrecer los mejores planes turísticos, recorridos históricos y expediciones a nivel nacional en toda Colombia. Registrados oficialmente bajo R.N.T. 14316.
            </p>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="rnt-badge">R.N.T. 14316</span>
            </div>
          </div>

          {/* Col 2 */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', borderBottom: '2px solid #25B45A', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
              PLANES TURÍSTICOS
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', padding: 0 }}>
              {activities.slice(0, 4).map((activity) => (
                <li key={activity.id}>
                  <a href="#tours" style={{ color: '#9CA3AF', textDecoration: 'none' }}>• {activity.name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', borderBottom: '2px solid #25B45A', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
              CONTÁCTANOS
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', padding: 0, color: '#9CA3AF' }}>
              <li> Celular: +57 316 2531293</li>
              <li> Email: danilotours@yahoo.es</li>
              <li> Horario de Atención: Lun a Sáb 8:15 am - 6:00 pm | Dom 8:00 am - 4:00 pm</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF', borderBottom: '2px solid #25B45A', paddingBottom: '0.5rem', display: 'inline-block', width: 'fit-content' }}>
              SÍGUENOS
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', padding: 0 }}>
              <li>
                <a
                  href="https://instagram.com/danilotourst"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#E1306C')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  <svg style={{ width: '1.1rem', height: '1.1rem', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@agencia_danilotours"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#00f2fe')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  <svg style={{ width: '1.1rem', height: '1.1rem', fill: 'currentColor' }} viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.24-.24V14c0 3.86-2.52 7.42-6.24 8.4-3.72.98-7.85-.45-9.87-3.82-2.02-3.37-1.41-7.98 1.48-10.66 2.89-2.68 7.37-2.73 10.3-.12V4.08C12.522 2.72 12.53 1.37 12.525.02zM12.01 18.01c1.8-.02 3.4-1.33 3.8-3.08.4-1.75-.41-3.67-1.95-4.57-.46-.27-.98-.44-1.52-.5v3.47c.5.07.96.34 1.25.75.29.41.38.93.25 1.42-.13.49-.49.88-.95 1.05-.46.17-.98.13-1.4-.1-.42-.23-.71-.65-.79-1.12H7.25c.08 1.94 1.44 3.65 3.32 4.09.47.11.96.11 1.44.09z" /></svg>
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/573162531293?text=%C2%A1Hola!%20Estoy%20interesado%20en%20conocer%20m%C3%A1s%20sobre%20los%20planes%20tur%C3%ADsticos%20de%20DaniloTours."
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#25D366')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#9CA3AF')}
                >
                  <svg style={{ width: '1.1rem', height: '1.1rem', fill: 'currentColor' }} viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l112.5-29.5c32.5 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-66.8 17.5 17.8-65.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                  <span>WhatsApp</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem', color: '#9CA3AF', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <span>© 2026 DaniloTours. Todos los derechos reservados. Diseñado bajo estándares de alta calidad.</span>
          <a href="/politicas-de-cancelacion" target="_blank" rel="noreferrer" style={{ color: '#0A74C9', textDecoration: 'underline', fontWeight: 'bold', fontSize: '0.8rem' }}>
            Términos, Condiciones y Políticas de Reserva y Cancelación
          </a>
        </div>
      </footer>

      {/* Booking Form Modal */}
      {selectedActivity && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: modalView === 'details' ? '850px' : '600px', transition: 'max-width 0.25s ease' }}>

            <div className="modal-header">
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#0A74C9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {modalView === 'details' ? 'Detalles del Plan' : 'Reservar Actividad'}
                </span>
                <h3 className="modal-title" style={{ marginTop: '0.15rem' }}>
                  {selectedActivity.name}
                </h3>
              </div>
              <button onClick={handleCloseBooking} className="modal-close">&times;</button>
            </div>

            {modalView === 'details' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Cover Image */}
                <div style={{ position: 'relative', height: '240px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={selectedActivity.image_url}
                    alt={selectedActivity.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', backgroundColor: 'rgba(0, 0, 0, 0.65)', color: '#FFFFFF', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                    {selectedActivity.location}
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center', backgroundColor: '#F3F4F6', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#4B5563', fontWeight: 'bold' }}>Duración</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{getDurationLabel(selectedActivity.duration_hours)}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#4B5563', fontWeight: 'bold' }}>Horarios</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{selectedActivity.schedule.replace('Salidas ', '')}</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#4B5563', fontWeight: 'bold' }}>Cupos Max</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{selectedActivity.max_capacity} personas</span>
                  </div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#4B5563', fontWeight: 'bold' }}>Desde</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#4B5563' }}>{formatCOP(selectedActivity.price)}</span>
                  </div>
                </div>

                {/* Content columns */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>

                  {/* Left Column (Description and Itinerary) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111111', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Descripción</h4>
                      <p style={{ fontSize: '0.85rem', color: '#4B5563', lineHeight: '1.5' }}>{selectedActivity.description}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#111111', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Itinerario del Viaje</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderLeft: '2px solid #0A74C9', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
                        {selectedActivity.itinerary.map((step, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-1.35rem', top: '0.2rem', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0A74C9' }} />
                            <p style={{ fontSize: '0.82rem', color: '#374151', lineHeight: '1.45' }}>{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column (Includes, Excludes, Prices) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.85rem', borderRadius: '6px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#065F46', marginBottom: '0.5rem', textTransform: 'uppercase' }}>✓ El Plan Incluye</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {selectedActivity.includes.map((item, idx) => (
                          <li key={idx} style={{ fontSize: '0.78rem', color: '#047857', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 'bold' }}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.85rem', borderRadius: '6px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#991B1B', marginBottom: '0.5rem', textTransform: 'uppercase' }}>✗ El Plan No Incluye</h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {selectedActivity.excludes.map((item, idx) => (
                          <li key={idx} style={{ fontSize: '0.78rem', color: '#B91C1C', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                            <span style={{ fontWeight: 'bold' }}>✗</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#111111', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Tabla de Precios por Persona</h4>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', border: '1px solid #E5E7EB', borderRadius: '4px', overflow: 'hidden' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '1px solid #E5E7EB', fontWeight: 'bold' }}>
                            <th style={{ padding: '0.45rem', textAlign: 'left' }}>Grupo</th>
                            <th style={{ padding: '0.45rem', textAlign: 'right' }}>Valor c/u</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '0.4rem' }}>1 Persona</td>
                            <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700' }}>{formatCOP(selectedActivity.price)}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                            <td style={{ padding: '0.4rem' }}>2 Personas</td>
                            <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{formatCOP(selectedActivity.price * 0.95)} <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 'normal' }}>(-5%)</span></td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                            <td style={{ padding: '0.4rem' }}>3 Personas</td>
                            <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{formatCOP(selectedActivity.price * 0.92)} <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 'normal' }}>(-8%)</span></td>
                          </tr>
                          <tr style={{ backgroundColor: '#F9FAFB' }}>
                            <td style={{ padding: '0.4rem' }}>4+ Personas</td>
                            <td style={{ padding: '0.4rem', textAlign: 'right', fontWeight: '700', color: '#059669' }}>{formatCOP(selectedActivity.price * 0.88)} <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 'normal' }}>(-12%)</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #E5E7EB', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseBooking}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}
                  >
                    Volver a los planes
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalView('booking')}
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: 'center', backgroundColor: '#0A74C9', border: 'none', padding: '0.8rem', fontSize: '0.95rem', fontWeight: 'bold' }}
                  >
                    ¡RESERVAR AHORA!
                  </button>
                </div>
              </div>
            ) : (
              <>
                {bookingSuccess ? (
                  <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ECFDF5', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontSize: '2rem' }}>
                      ✓
                    </div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>
                      ¡Reserva Creada con Éxito!
                    </h4>
                    <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      Tu reserva ha sido registrada bajo el estado <strong>PENDIENTE</strong>. Para coordinar el método de pago (transferencia bancaria, efectivo, etc.) y confirmar los cupos de tu viaje, por favor comunícate con un asesor a través de WhatsApp.
                    </p>
                    <div style={{ border: '1px dashed #25B45A', borderRadius: '8px', padding: '1rem', width: '100%', backgroundColor: '#F4FAF6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem', textAlign: 'left', marginTop: '0.5rem' }}>
                      <div>ID Reserva: <strong>#{bookingSuccess.id}</strong></div>
                      <div>Cliente: <strong>{name}</strong></div>
                      <div>Fecha de Viaje: <strong>{date}</strong></div>
                      <div>Personas: <strong>{numPeople} pax</strong></div>
                      <div style={{ gridColumn: 'span 2', borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                        Precio Total: <strong style={{ color: '#00B050', fontSize: '1rem' }}>{formatCOP(bookingSuccess.total_price)}</strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '1rem' }}>
                      <a
                        href={`https://wa.me/573162531293?text=${encodeURIComponent(
                          `¡Hola! Acabo de registrar una reserva (ID: #${bookingSuccess.id}) para el plan "${selectedActivity.name}" para ${numPeople} personas en la fecha ${date}. El valor total con el descuento aplicado es de ${formatCOP(bookingSuccess.total_price)}. Me gustaría coordinar el pago de mi plan.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-primary"
                        style={{
                          width: '100%',
                          justifyContent: 'center',
                          backgroundColor: '#25D366',
                          border: 'none',
                          padding: '0.8rem',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          borderRadius: '4px'
                        }}
                      >
                        <svg style={{ width: '1.4rem', height: '1.4rem', fill: 'currentColor' }} viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l112.5-29.5c32.5 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-66.8 17.5 17.8-65.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" /></svg>
                        <span>HABLAR CON UN ASESOR</span>
                      </a>

                      <button
                        onClick={handleCloseBooking}
                        className="btn-secondary"
                        style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.9rem' }}
                      >
                        Cerrar Ventana
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit}>

                    {bookingError && (
                      <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: '600' }}>
                        ⚠️ {bookingError}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                      <div className="form-group">
                        <label className="form-label">Cédula / Pasaporte</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej. 1018245678"
                          required
                          value={documentId}
                          onChange={(e) => setDocumentId(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Nombre Completo</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej. Alejandro Gómez"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Correo Electrónico</label>
                        <input
                          type="email"
                          className="form-input"
                          placeholder="ejemplo@correo.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Número de Celular</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Ej. 3123456789"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Fecha del Viaje</label>
                        <input
                          type="date"
                          className="form-input"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Número de Personas</label>
                        <input
                          type="number"
                          min="1"
                          max={selectedActivity.max_capacity.toString()}
                          className="form-input"
                          required
                          value={numPeople}
                          onChange={(e) => setNumPeople(e.target.value)}
                        />
                      </div>

                    </div>

                    <div className="form-group" style={{ marginTop: '0.5rem' }}>
                      <label className="form-label">Notas Adicionales / Requerimientos</label>
                      <textarea
                        className="form-textarea"
                        placeholder="Ej. Restricciones alimenticias, requerimiento de guía bilingüe, etc."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#F3F4F6', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {/* Price per person */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: '#4B5563' }}>Valor por Persona:</span>
                        <div style={{ textAlign: 'right' }}>
                          {(parseInt(numPeople) || 1) > 1 && (
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through', marginRight: '0.5rem' }}>
                              {formatCOP(selectedActivity.price)}
                            </span>
                          )}
                          <span style={{ fontWeight: '600', color: '#111111' }}>
                            {formatCOP(getDiscountedRate(selectedActivity.price, parseInt(numPeople) || 1))}
                          </span>
                        </div>
                      </div>

                      {/* Discount Tag */}
                      {(parseInt(numPeople) || 1) > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '0.7rem', fontWeight: '800', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' }}>
                            ¡{((parseInt(numPeople) || 1) === 2 ? 5 : (parseInt(numPeople) || 1) === 3 ? 8 : 12)}% Descuento Grupal Aplicado!
                          </span>
                        </div>
                      )}

                      {/* Total Price */}
                      {(parseInt(numPeople) || 1) > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#0A74C9' }}>Valor Total ({numPeople} personas):</span>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                              {formatCOP(selectedActivity.price * (parseInt(numPeople) || 1))}
                            </span>
                            <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#059669' }}>
                              {formatCOP(getDiscountedRate(selectedActivity.price, parseInt(numPeople) || 1) * (parseInt(numPeople) || 1))}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Terms and Conditions Checkbox */}
                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.8rem', color: '#374151' }}>
                        <input
                          type="checkbox"
                          required
                          checked={acceptedPolicies}
                          onChange={(e) => setAcceptedPolicies(e.target.checked)}
                          style={{ marginTop: '0.15rem', accentColor: '#0A74C9' }}
                        />
                        <span>
                          Acepto las <a href="/politicas-de-cancelacion" target="_blank" rel="noreferrer" style={{ color: '#0A74C9', textDecoration: 'underline', fontWeight: '600' }}>Políticas de Reserva y Cancelación</a> de DaniloTours.
                        </span>
                      </label>
                    </div>

                    <div className="form-actions">
                      <button type="button" onClick={() => setModalView('details')} className="btn-secondary" disabled={bookingLoading}>
                        Atrás
                      </button>
                      <button type="submit" className="btn-primary" disabled={bookingLoading}>
                        {bookingLoading ? 'Reservando...' : 'Confirmar Reserva'}
                      </button>
                    </div>

                  </form>
                )}
              </>
            )}

          </div>
        </div>
      )}

      {isMobile && (
        <a
          href="https://wa.me/573162531293?text=%C2%A1Hola!%20Estoy%20interesado%20en%20conocer%20m%C3%A1s%20sobre%20los%20planes%20tur%C3%ADsticos%20de%20DaniloTours."
          target="_blank"
          rel="noreferrer"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#25D366',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 9999
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 448 512" fill="currentColor">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l112.5-29.5c32.5 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-66.8 17.5 17.8-65.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
          </svg>
        </a>
      )}

    </div>
  );
}
