import React, { useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  location: string;
  max_capacity: number;
  image_url: string;
}

export default function ActivitiesView() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_hours: '',
    location: '',
    max_capacity: '',
    image_url: ''
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = () => {
    setLoading(true);
    fetch('/api/activities')
      .then((res) => res.json())
      .then((json) => {
        setActivities(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching activities:', err);
        setLoading(false);
      });
  };

  const openCreateModal = () => {
    setEditingActivity(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration_hours: '',
      location: '',
      max_capacity: '',
      image_url: ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      price: activity.price.toString(),
      duration_hours: activity.duration_hours.toString(),
      location: activity.location,
      max_capacity: activity.max_capacity.toString(),
      image_url: activity.image_url
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const method = editingActivity ? 'PUT' : 'POST';
    const url = editingActivity ? `/api/activities/${editingActivity.id}` : '/api/activities';

    fetch(url, {
      method: method,
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
        fetchActivities();
      })
      .catch((err) => {
        console.error('Error saving activity:', err);
      });
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta actividad turística? Se borrarán también las reservas asociadas.')) {
      return;
    }

    fetch(`/api/activities/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })
      .then((res) => res.json())
      .then(() => {
        fetchActivities();
      })
      .catch((err) => {
        console.error('Error deleting activity:', err);
      });
  };

  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="view-container">
      {/* Table Header Controls */}
      <div className="table-header-controls" style={{ justifyContent: 'flex-end' }}>
        <button className="btn-primary" onClick={openCreateModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nueva Actividad Turística
        </button>
      </div>

      {/* Grid View */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p>Cargando catálogo de actividades...</p>
        </div>
      ) : activities.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '24px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No hay actividades registradas.</p>
        </div>
      ) : (
        <div className="grid-view">
          {activities.map((act) => (
            <div key={act.id} className="activity-card">
              <div className="activity-card-image-container">
                <img src={act.image_url} alt={act.name} className="activity-card-image" />
                <span className="activity-card-price-badge">{formatCOP(act.price)}</span>
              </div>

              <div className="activity-card-content">
                <h3 className="activity-card-title">{act.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-blue-light)', fontWeight: 600 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{act.location}</span>
                </div>

                <p className="activity-card-description">{act.description}</p>

                <div className="activity-meta-details">
                  <div className="activity-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>Duración: {act.duration_hours}h</span>
                  </div>
                  <div className="activity-meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>Capacidad: {act.max_capacity} personas</span>
                  </div>
                </div>
              </div>

              <div className="activity-card-actions">
                <button className="btn-secondary" style={{ flexGrow: 1, padding: '0.6rem 1rem', fontSize: '0.85rem' }} onClick={() => openEditModal(act)}>
                  Editar
                </button>
                <button className="btn-secondary" style={{ color: 'var(--color-cancelled)', padding: '0.6rem 1rem' }} onClick={() => handleDelete(act.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingActivity ? 'Modificar Actividad' : 'Registrar Nueva Actividad'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre del Tour / Actividad</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <span className="form-error">{errors.name[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Ubicación / Punto de Partida</label>
                <input
                  type="text"
                  name="location"
                  className="form-input"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
                {errors.location && <span className="form-error">{errors.location[0]}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Precio (COP)</label>
                  <input
                    type="number"
                    name="price"
                    className="form-input"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.price && <span className="form-error">{errors.price[0]}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Duración (Horas)</label>
                  <input
                    type="number"
                    name="duration_hours"
                    className="form-input"
                    value={formData.duration_hours}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.duration_hours && <span className="form-error">{errors.duration_hours[0]}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Capacidad Máxima (Personas)</label>
                <input
                  type="number"
                  name="max_capacity"
                  className="form-input"
                  value={formData.max_capacity}
                  onChange={handleInputChange}
                  required
                />
                {errors.max_capacity && <span className="form-error">{errors.max_capacity[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Enlace de Imagen (Imagen Scenery)</label>
                <input
                  type="url"
                  name="image_url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={handleInputChange}
                  required
                />
                {errors.image_url && <span className="form-error">{errors.image_url[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Detallada del Tour</label>
                <textarea
                  name="description"
                  className="form-textarea"
                  style={{ minHeight: '120px' }}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
                {errors.description && <span className="form-error">{errors.description[0]}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingActivity ? 'Guardar Cambios' : 'Registrar Actividad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
