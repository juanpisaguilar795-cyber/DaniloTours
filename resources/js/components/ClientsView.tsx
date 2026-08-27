import React, { useEffect, useState } from 'react';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  document_id: string;
  address?: string;
  notes?: string;
}

export default function ClientsView() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document_id: '',
    address: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = () => {
    setLoading(true);
    const url = search ? `/api/clients?search=${encodeURIComponent(search)}` : '/api/clients';
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setClients(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching clients:', err);
        setLoading(false);
      });
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      document_id: '',
      address: '',
      notes: ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      document_id: client.document_id,
      address: client.address || '',
      notes: client.notes || ''
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

    const method = editingClient ? 'PUT' : 'POST';
    const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';

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
      .then((data) => {
        setModalOpen(false);
        fetchClients();
      })
      .catch((err) => {
        console.error('Error saving client:', err);
      });
  };

  const handleDelete = (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Se borrarán también sus reservas asociadas.')) {
      return;
    }

    fetch(`/api/clients/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })
      .then((res) => res.json())
      .then(() => {
        fetchClients();
      })
      .catch((err) => {
        console.error('Error deleting client:', err);
      });
  };

  return (
    <div className="view-container">
      {/* Top Filter and Add Controls */}
      <div className="table-header-controls">
        <div className="search-input-wrapper">
          <svg className="search-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre, documento o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={openCreateModal}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Registrar Cliente
        </button>
      </div>

      {/* Grid of Passport Cards */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <p>Cargando lista de clientes...</p>
        </div>
      ) : clients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', border: '1px dashed var(--border-color)', borderRadius: '24px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No se encontraron clientes.</p>
        </div>
      ) : (
        <div className="grid-view">
          {clients.map((client) => (
            <div key={client.id} className="client-passport-card">
              <div className="passport-watermark">COLOMBIA</div>
              
              <div className="passport-header">
                <div className="passport-title">Pasaporte Turista</div>
                <div className="passport-stamp">DaniloTours</div>
              </div>

              <div className="passport-body">
                <div className="passport-row">
                  <span className="passport-label">Nombres:</span>
                  <span className="passport-value" style={{ fontSize: '1.05rem', color: '#fff' }}>{client.name}</span>
                </div>
                <div className="passport-row">
                  <span className="passport-label">Doc. ID:</span>
                  <span className="passport-value" style={{ fontFamily: 'var(--font-title)', color: 'var(--color-blue-light)' }}>{client.document_id}</span>
                </div>
                <div className="passport-row">
                  <span className="passport-label">Email:</span>
                  <span className="passport-value">{client.email}</span>
                </div>
                <div className="passport-row">
                  <span className="passport-label">Celular:</span>
                  <span className="passport-value">{client.phone}</span>
                </div>
                {client.address && (
                  <div className="passport-row">
                    <span className="passport-label">Dirección:</span>
                    <span className="passport-value">{client.address}</span>
                  </div>
                )}
                {client.notes && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '8px', borderLeft: '2px solid var(--color-blue-primary)' }}>
                    <strong>Notas:</strong> {client.notes}
                  </div>
                )}
              </div>

              <div className="passport-actions">
                <button className="passport-btn-icon" onClick={() => openEditModal(client)} title="Editar Cliente">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button className="passport-btn-icon" style={{ color: 'var(--color-cancelled)' }} onClick={() => handleDelete(client.id)} title="Eliminar Cliente">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form for Create & Edit */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingClient ? 'Modificar Registro de Cliente' : 'Registrar Nuevo Cliente'}</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre Completo</label>
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
                <label className="form-label">Documento de Identidad (Cédula o Pasaporte)</label>
                <input
                  type="text"
                  name="document_id"
                  className="form-input"
                  value={formData.document_id}
                  onChange={handleInputChange}
                  required
                />
                {errors.document_id && <span className="form-error">{errors.document_id[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <span className="form-error">{errors.email[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono / Celular</label>
                <input
                  type="text"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
                {errors.phone && <span className="form-error">{errors.phone[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Dirección (Ciudad, Residencia)</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  value={formData.address}
                  onChange={handleInputChange}
                />
                {errors.address && <span className="form-error">{errors.address[0]}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Notas Especiales / Preferencias</label>
                <textarea
                  name="notes"
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleInputChange}
                />
                {errors.notes && <span className="form-error">{errors.notes[0]}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingClient ? 'Guardar Cambios' : 'Confirmar Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
