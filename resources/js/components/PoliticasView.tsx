import React from 'react';

export default function PoliticasView() {
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div style={{ fontFamily: '"Outfit", sans-serif', backgroundColor: '#F9FAFB', minHeight: '100vh', padding: '2rem 1.5rem', color: '#1F2937' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ borderBottom: '2px solid #F3F4F6', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ height: '60px' }}>
              <img src="/images/logo.png" alt="DaniloTours Logo" style={{ height: '100%', width: 'auto', objectFit: 'contain' }} />
            </div>
            <button 
              onClick={() => window.close()} 
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', fontWeight: 'bold', color: '#0A74C9', backgroundColor: 'transparent', border: '1px solid #0A74C9', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              Cerrar Ventana
            </button>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#111111', margin: '0.5rem 0 0 0', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
            Políticas de Reserva y Cancelación
          </h1>
          <p style={{ fontSize: '0.85rem', color: '#6B7280', margin: 0, fontWeight: '500' }}>
            Última actualización: Agosto 2026 | DaniloTours Colombia
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Intro Alert */}
          <div style={{ backgroundColor: '#EFF6FF', borderLeft: '4px solid #0A74C9', padding: '1rem', borderRadius: '0 8px 8px 0', fontSize: '0.9rem', color: '#1E40AF', lineHeight: '1.5' }}>
            Cuando el cliente reserve cualquier servicio o tour con nosotros, el cliente está de acuerdo, entiende y acepta las siguientes políticas, términos y condiciones de <strong>DaniloTours</strong>.
          </div>

          {/* Section 1: Individual Tours */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0A74C9', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
              1. Tours y Servicios Individuales
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.1. Reservas con Depósitos / Abonos
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Para garantizar la reserva de nuestros servicios turísticos, el cliente deberá realizar el pago con anticipación de mínimo el <strong>30%</strong> del valor total de la reserva. En caso de cancelación, el 50% del valor total previamente pagado (correspondiente a ese 30%) será devuelto sin importar la fecha de cancelación. Esto no aplica para cancelaciones confirmadas 72 horas (3 días) antes de la operación del tour. Si la cancelación se genera dentro de las 72 horas (3 días) antes de la operación del tour, DaniloTours NO realizará ninguna devolución.
                </p>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.2. Reservas con Pagos Totales (100%)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Si el cliente realizó el pago del 100% del tour con anticipación y por cualquier razón desea cancelar:
                </p>
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0 0', fontSize: '0.88rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Con <strong>72 horas (3 días) o más</strong> de antelación: se hará la devolución del <strong>85%</strong> del valor total pagado.</li>
                  <li>Entre <strong>72 horas y 24 horas (2 días)</strong> de antelación: se hará la devolución del <strong>70%</strong> del valor total pagado.</li>
                  <li>Dentro de las <strong>23 horas previas</strong>: se hará la devolución del <strong>70%</strong> del valor total pagado.</li>
                </ul>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.3. Modificaciones y Cambio de Fecha
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Si el cliente necesita o desea cambiar la fecha del tour, DaniloTours confirmará su disponibilidad para realizar el cambio. En caso de que no sea posible el cambio, se le ofrecerá una segunda opción de tour o servicio; de lo contrario, se cancelará la reserva y se procederá a generar la correspondiente devolución de dinero según las políticas detalladas en P.1 y P.2.
                </p>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.4. Variación de Tarifas según Pasajeros
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Los valores de los servicios turísticos pueden variar según el número de personas. Es recomendable que el cliente confirme la reserva cuando tenga absoluta certeza del número total de personas, ya que cambiar el número de pasajeros alterará el valor final por persona.
                </p>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.5. Cancelaciones para Tours en Bicicleta
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  El depósito pagado (50%) será devuelto según la fecha de cancelación. Esto no aplica para cancelaciones confirmadas 72 horas (3 días) antes de la operación del tour. Si la cancelación se genera dentro de las 72 horas, no habrá devolución. Si el cliente desea cancelar el mismo día por lluvia o mal clima, <strong>NO habrá devolución del depósito</strong>; si pagó el total, se le devolverá el 50% de la tarifa pagada.
                </p>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  P.6. Compromiso de Calidad y Compensación
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Si nuestra agencia o personal incurren en negligencia durante la operación del servicio resultando en la insatisfacción del cliente, evaluaremos de forma justa y realista el desarrollo del servicio para ofrecer la compensación más adecuada, sin descartar la devolución parcial o total.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Airport Transfers */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0A74C9', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
              2. Traslados y Transporte (Aeropuertos)
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  Condiciones Generales y Tiempos de Espera
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  Los traslados desde/hasta aeropuertos de Bogotá, Medellín y Cartagena requieren el pago del 100% de la tarifa para su reserva. Si el vuelo está dentro del itinerario programado y el cliente no se presenta, DaniloTours esperará un máximo de <strong>45 minutos</strong>. En caso de no presentarse, el servicio se cobrará en su totalidad.
                </p>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', marginTop: '0.5rem' }}>
                  Si la aerolínea presenta retrasos no reportados oficialmente con antelación en sus portales web, el inicio del servicio se tomará desde la hora de recogida acordada inicialmente, y el traslado se cobrará en su totalidad.
                </p>
              </div>

              <div style={{ backgroundColor: '#F9FAFB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#111111', margin: '0 0 0.5rem 0' }}>
                  Políticas por Cancelación de Vuelo Comprobada
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.5', margin: 0 }}>
                  En caso de cancelaciones o cambios de fecha hechos por la aerolínea (debidamente comprobados con pantallazos o correos oficiales), DaniloTours aplicará las siguientes políticas de reintegro:
                </p>
                <ul style={{ paddingLeft: '1.25rem', margin: '0.5rem 0 0 0', fontSize: '0.88rem', color: '#4B5563', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <li>Cancelaciones entre <strong>25 a 71 horas</strong> de anticipación: se devolverá el <strong>90%</strong> de la tarifa.</li>
                  <li>Cancelaciones entre <strong>8 a 24 horas</strong> de anticipación: se devolverá el <strong>80%</strong> de la tarifa.</li>
                  <li>Cancelaciones entre <strong>8 a 0 horas</strong> de anticipación: se devolverá el <strong>50%</strong> de la tarifa.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Section 3: No Show and Fees */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0A74C9', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.5rem' }}>
              3. No Presentación y Costos de Transacción
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flexWrap: 'wrap' }}>
              
              <div style={{ backgroundColor: '#FFFBEB', padding: '1.25rem', borderRadius: '8px', border: '1px solid #FCD34D' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#92400E', margin: '0 0 0.5rem 0' }}>
                  No Show (No presentación)
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#78350F', lineHeight: '1.5', margin: 0 }}>
                  Para tours terrestres, esperaremos un máximo de <strong>35 minutos</strong> en el punto de encuentro. Si no se recibe respuesta del cliente, la reserva se cancelará sin derecho a devolución.
                </p>
              </div>

              <div style={{ backgroundColor: '#FEF2F2', padding: '1.25rem', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#991B1B', margin: '0 0 0.5rem 0' }}>
                  Costos de Transacción
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#B91C1C', lineHeight: '1.5', margin: 0 }}>
                  Las devoluciones corresponden al valor neto recibido. Se restará un <strong>8%</strong> correspondiente a los costos inherentes a las plataformas de transacción bancarias para realizar la devolución.
                </p>
              </div>

            </div>
          </div>

          {/* Exception Note */}
          <div style={{ fontSize: '0.8rem', color: '#6B7280', textAlign: 'center', borderTop: '1px solid #E5E7EB', paddingTop: '1.5rem', marginTop: '1rem' }}>
            * ESTA POLÍTICA NO APLICA PARA RESERVAS Y CANCELACIONES DE PAQUETES TURÍSTICOS EN COLOMBIA.
          </div>

        </div>

      </div>
    </div>
  );
}
