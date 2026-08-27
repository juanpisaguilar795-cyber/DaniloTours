import React, { useEffect, useState } from 'react';

interface Client {
  id: number;
  name: string;
}

interface Activity {
  id: number;
  name: string;
  price: number;
  location: string;
  max_capacity: number;
}

interface Reservation {
  id: number;
  client_id: number;
  activity_id: number;
  client: { name: string };
  activity: { name: string };
  reservation_date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  num_people: number;
  total_price: number;
  travel_notes?: string;
}

export default function ReservationsView() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    client_id: '',
    activity_id: '',
    reservation_date: '',
    num_people: '1',
    status: 'pending',
    travel_notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchReservations();
    fetchClientsAndActivities();
  }, []);

  // Compute estimated price dynamically in form
  useEffect(() => {
    const selectedAct = activities.find(a => a.id === parseInt(formData.activity_id));
    const pax = parseInt(formData.num_people);
    if (selectedAct && pax > 0) {
      setEstimatedPrice(selectedAct.price * pax);
    } else {
      setEstimatedPrice(null);
    }
  }, [formData.activity_id, formData.num_people, activities]);

  const fetchReservations = () => {
    setLoading(true);
    fetch('/api/reservations')
      .then((res) => res.json())
      .then((json) => {
        setReservations(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reservations:', err);
        setLoading(false);
      });
  };

  const fetchClientsAndActivities = () => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((json) => setClients(json))
      .catch((err) => console.error('Error fetching clients for select:', err));

    fetch('/api/activities')
      .then((res) => res.json())
      .then((json) => setActivities(json))
      .catch((err) => console.error('Error fetching activities for select:', err));
  };

  const openBookModal = () => {
    setFormData({
      client_id: clients[0]?.id.toString() || '',
      activity_id: activities[0]?.id.toString() || '',
      reservation_date: new Date().toISOString().split('T')[0],
      num_people: '1',
      status: 'pending',
      travel_notes: ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    fetch('/api/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(formData)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            if (json.errors) {
              setErrors(json.errors);
            }
            throw new Error('Validation failed');
          });
        }
        return res.json();
      })
      .then(() => {
        setModalOpen(false);
        fetchReservations();
      })
      .catch((err) => {
        console.error('Error creating booking:', err);
      });
  };

  // Change reservation status inline
  const updateStatus = (id: number, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    const payload = {
      client_id: reservation.client_id,
      activity_id: reservation.activity_id,
      reservation_date: reservation.reservation_date,
      num_people: reservation.num_people,
      status: newStatus,
      travel_notes: reservation.travel_notes || ''
    };

    fetch(`/api/reservations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            if (json.errors && json.errors.num_people) {
              alert(json.errors.num_people[0]);
            } else {
              alert('Error al actualizar el estado de la reserva.');
            }
            throw new Error('Update failed');
          });
        }
        return res.json();
      })
      .then(() => {
        fetchReservations();
      })
      .catch((err) => {
        console.error('Error updating status:', err);
      });
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar permanentemente esta reserva?')) {
      return;
    }

    fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })
      .then((res) => res.json())
      .then(() => {
        fetchReservations();
      })
      .catch((err) => {
        console.error('Error deleting reservation:', err);
      });
  };

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Group reservations by status
  const pendingReservations = reservations.filter(r => r.status === 'pending');
  const confirmedReservations = reservations.filter(r => r.status === 'confirmed');
  const cancelledReservations = reservations.filter(r => r.status === 'cancelled');

  return (
    <div className="view-container">
      {/* Top Controls */}
      <div className="table-header-controls" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={openBookModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          Agendar Nueva Reserva
        </button>
      </div>

      {/* Board Pipeline */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p>Cargando flujo de reservas...</p>
        </div>
      ) : (
        <div className="pipeline-board">
          {/* COLUMN 1: PENDING */}
          <div className="pipeline-column pending-col">
            <div className="pipeline-column-header">
              <span className="pipeline-title">
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-pending)' }}></span>
                Pendientes
              </span>
              <span className="pipeline-count">{pendingReservations.length}</span>
            </div>
            
            {pendingReservations.map((res) => (
              <div key={res.id} className="ticket-card">
                <div className="ticket-header">
                  <span className="ticket-id">#RES-0{res.id}</span>
                  <span className="ticket-date">{res.reservation_date}</span>
                </div>
                <div className="ticket-body">
                  <div className="ticket-client">{res.client.name}</div>
                  <div className="ticket-activity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    </svg>
                    <span>{res.activity.name}</span>
                  </div>
                  {res.travel_notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      "{res.travel_notes}"
                    </div>
                  )}
                </div>
                <div className="ticket-footer">
                  <span className="ticket-pax">{res.num_people} {res.num_people === 1 ? 'Pasajero' : 'Pasajeros'}</span>
                  <span className="ticket-total">{formatCOP(res.total_price)}</span>
                </div>
                <div className="ticket-actions-row">
                  <button className="ticket-action-btn confirm" onClick={() => updateStatus(res.id, 'confirmed')}>
                    Confirmar
                  </button>
                  <button className="ticket-action-btn cancel" onClick={() => updateStatus(res.id, 'cancelled')}>
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 2: CONFIRMED */}
          <div className="pipeline-column confirmed-col">
            <div className="pipeline-column-header">
              <span className="pipeline-title">
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-confirmed)' }}></span>
                Confirmadas
              </span>
              <span className="pipeline-count">{confirmedReservations.length}</span>
            </div>

            {confirmedReservations.map((res) => (
              <div key={res.id} className="ticket-card">
                <div className="ticket-header">
                  <span className="ticket-id">#RES-0{res.id}</span>
                  <span className="ticket-date">{res.reservation_date}</span>
                </div>
                <div className="ticket-body">
                  <div className="ticket-client">{res.client.name}</div>
                  <div className="ticket-activity">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    </svg>
                    <span>{res.activity.name}</span>
                  </div>
                  {res.travel_notes && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                      "{res.travel_notes}"
                    </div>
                  )}
                </div>
                <div className="ticket-footer">
                  <span className="ticket-pax">{res.num_people} {res.num_people === 1 ? 'Pasajero' : 'Pasajeros'}</span>
                  <span className="ticket-total" style={{ color: 'var(--color-green-light)' }}>{formatCOP(res.total_price)}</span>
                </div>
                <div className="ticket-actions-row">
                  <button className="ticket-action-btn cancel" onClick={() => updateStatus(res.id, 'cancelled')}>
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 3: CANCELLED */}
          <div className="pipeline-column cancelled-col">
            <div className="pipeline-column-header">
              <span className="pipeline-title">
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-cancelled)' }}></span>
                Canceladas
              </span>
              <span className="pipeline-count">{cancelledReservations.length}</span>
            </div>

            {cancelledReservations.map((res) => (
              <div key={res.id} className="ticket-card" style={{ opacity: 0.65 }}>
                <div className="ticket-header">
                  <span className="ticket-id" style={{ color: 'var(--text-muted)' }}>#RES-0{res.id}</span>
                  <span className="ticket-date">{res.reservation_date}</span>
                </div>
                <div className="ticket-body">
                  <div className="ticket-client" style={{ textDecoration: 'line-through' }}>{res.client.name}</div>
                  <div className="ticket-activity">
                    <span>{res.activity.name}</span>
                  </div>
                </div>
                <div className="ticket-footer">
                  <span className="ticket-pax">{res.num_people} PAX</span>
                  <span className="ticket-total" style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatCOP(res.total_price)}</span>
                </div>
                <div className="ticket-actions-row">
                  <button className="ticket-action-btn confirm" onClick={() => updateStatus(res.id, 'pending')}>
                    Reabrir
                  </button>
                  <button className="ticket-action-btn delete" onClick={() => handleDelete(res.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Agendar Reserva (Emitir Boleto)</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Cliente Pasajero</label>
                <select
                  name="client_id"
                  className="form-select"
                  value={formData.client_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Selecciona un cliente...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.client_id && <span className="form-error">{errors.client_id[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Actividad / Destino Turístico</label>
                <select
                  name="activity_id"
                  className="form-select"
                  value={formData.activity_id}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Selecciona una actividad...</option>
                  {activities.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({formatCOP(a.price)} / persona)</option>
                  ))}
                </select>
                {errors.activity_id && <span className="form-error">{errors.activity_id[0]}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Fecha de Viaje</label>
                  <input
                    type="date"
                    name="reservation_date"
                    className="form-input"
                    value={formData.reservation_date}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.reservation_date && <span className="form-error">{errors.reservation_date[0]}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Pasajeros (PAX)</label>
                  <input
                    type="number"
                    name="num_people"
                    className="form-input"
                    value={formData.num_people}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.num_people && <span className="form-error">{errors.num_people[0]}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estado Inicial</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="pending">Pendiente (Reservado)</option>
                  <option value="confirmed">Confirmado (Pagado)</option>
                </select>
                {errors.status && <span className="form-error">{errors.status[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Indicaciones Especiales (Notas de Viaje)</label>
                <textarea
                  name="travel_notes"
                  className="form-textarea"
                  placeholder="Ej. Hotel de recogida, alergias, requerimientos de transporte..."
                  value={formData.travel_notes}
                  onChange={handleInputChange}
                />
                {errors.travel_notes && <span className="form-error">{errors.travel_notes[0]}</span>}
              </div>

              {/* Dynamic Cost Estimator Section */}
              {estimatedPrice !== null && (
                <div style={{
                  padding: '1rem', background: 'rgba(5, 117, 230, 0.08)',
                  borderRadius: '12px', border: '1px solid rgba(5, 117, 230, 0.2)',
                  marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Costo Estimado Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-blue-light)', fontFamily: 'var(--font-title)' }}>
                    {formatCOP(estimatedPrice)}
                  </span>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Emitir Boleto de Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
