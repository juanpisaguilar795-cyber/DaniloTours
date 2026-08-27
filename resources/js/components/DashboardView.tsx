import React, { useEffect, useState } from 'react';

interface Reservation {
  id: number;
  client: { name: string };
  activity: { name: string };
  reservation_date: string;
  num_people: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface MonthRevenue {
  month: string;
  total: number;
}

interface PopularActivity {
  id: number;
  name: string;
  location: string;
  reservations_count: number;
}

interface DashboardData {
  total_revenue: number;
  total_reservations: number;
  total_clients: number;
  active_activities: number;
  reservations_by_status: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };
  recent_reservations: Reservation[];
  revenue_by_month: MonthRevenue[];
  popular_activities: PopularActivity[];
}

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <p>Cargando estadísticas de DaniloTours...</p>
      </div>
    );
  }

  // Format currency
  const formatCOP = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Custom SVG Chart calculations
  const chartWidth = 500;
  const chartHeight = 150;
  const paddingX = 40;
  const paddingY = 20;

  const maxRevenue = Math.max(...data.revenue_by_month.map((d) => d.total), 100000);
  const chartPoints = data.revenue_by_month.map((d, index) => {
    const divider = data.revenue_by_month.length > 1 ? data.revenue_by_month.length - 1 : 1;
    const x = data.revenue_by_month.length > 1 
      ? paddingX + (index / divider) * (chartWidth - paddingX * 2)
      : chartWidth / 2;
    // Y points downwards in SVG, so subtract from chartHeight
    const y = chartHeight - paddingY - (d.total / maxRevenue) * (chartHeight - paddingY * 2);
    return { x, y, label: d.month, value: d.total };
  });

  const pathD = data.revenue_by_month.length > 1
    ? chartPoints.reduce((acc, p, i) => {
        return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
      }, '')
    : '';

  const areaD = pathD
    ? `${pathD} L ${chartPoints[chartPoints.length - 1].x} ${chartHeight - paddingY} L ${chartPoints[0].x} ${chartHeight - paddingY} Z`
    : '';

  // Custom SVG Donut Chart calculations
  const totalReservations = data.total_reservations || 1;
  const pendingPct = (data.reservations_by_status.pending / totalReservations) * 100;
  const confirmedPct = (data.reservations_by_status.confirmed / totalReservations) * 100;
  const cancelledPct = (data.reservations_by_status.cancelled / totalReservations) * 100;

  // Circle properties
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const strokePending = circumference * (pendingPct / 100);
  const strokeConfirmed = circumference * (confirmedPct / 100);
  const strokeCancelled = circumference * (cancelledPct / 100);

  const offsetConfirmed = circumference - strokePending;
  const offsetCancelled = offsetConfirmed - strokeConfirmed;

  return (
    <div className="view-container">
      {/* Metrics Row */}
      <div className="dashboard-grid">
        <div className="stats-card revenue">
          <div className="stats-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0575E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
          <div className="stats-label">Ingresos Totales</div>
          <div className="stats-value">{formatCOP(data.total_revenue)}</div>
        </div>

        <div className="stats-card reservations">
          <div className="stats-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7F00FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <div className="stats-label">Reservas Registradas</div>
          <div className="stats-value">{data.total_reservations}</div>
        </div>

        <div className="stats-card clients">
          <div className="stats-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00B050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stats-label">Clientes Activos</div>
          <div className="stats-value">{data.total_clients}</div>
        </div>

        <div className="stats-card activities">
          <div className="stats-icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
              <polyline points="2 17 12 22 22 17"></polyline>
              <polyline points="2 12 12 17 22 12"></polyline>
            </svg>
          </div>
          <div className="stats-label">Actividades Turísticas</div>
          <div className="stats-value">{data.active_activities}</div>
        </div>
      </div>

      {/* Charts & Interactive Rows */}
      <div className="dashboard-grid">
        {/* Left Side: Custom Monthly Revenue Chart */}
        <div className="widget-row-1">
          <div className="card-widget">
            <div className="widget-title">
              <span>Ingresos por Reservas (Mensual COP)</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-blue-light)', fontWeight: 600 }}>Solo Reservas Confirmadas</span>
            </div>
            
            <div className="chart-container">
              <svg className="chart-svg" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                {/* Defs for gradients */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-primary)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--color-blue-primary)" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.03)" />
                <line x1={paddingX} y1={(chartHeight) / 2} x2={chartWidth - paddingX} y2={(chartHeight) / 2} stroke="rgba(255,255,255,0.03)" />
                <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="rgba(255,255,255,0.08)" />

                {/* Area under the line */}
                {areaD && <path d={areaD} fill="url(#chartGradient)" />}

                {/* Line Path */}
                {pathD && <path d={pathD} fill="none" stroke="var(--color-blue-light)" strokeWidth="3" strokeLinecap="round" />}

                {/* Interactive Dots */}
                {chartPoints.map((p, i) => (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5" fill="var(--bg-main)" stroke="var(--color-blue-light)" strokeWidth="2" />
                    <circle cx={p.x} cy={p.y} r="2" fill="var(--color-blue-light)" />
                    {/* Tooltip-like values */}
                    <text x={p.x} y={p.y - 10} fill="var(--text-main)" fontSize="8" fontWeight="bold" textAnchor="middle">
                      {p.value > 0 ? (p.value / 1000) + 'k' : ''}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="chart-axis-labels">
                {chartPoints.map((p, i) => (
                  <span key={i} style={{ width: `${100 / chartPoints.length}%`, textAlign: 'center' }}>
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Status Distribution Donut Chart */}
        <div className="widget-row-2">
          <div className="card-widget">
            <div className="widget-title">
              <span>Estados de Reservas</span>
            </div>

            <div className="status-wheel-container">
              <svg width="120" height="120" viewBox="0 0 120 120" className="svg-donut">
                <circle className="donut-ring" cx="60" cy="60" r={radius} fill="transparent" strokeWidth="12" />
                
                {/* Pending portion */}
                <circle 
                  className="donut-segment" 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--color-pending)" 
                  strokeWidth="12" 
                  strokeDasharray={`${strokePending} ${circumference - strokePending}`} 
                  strokeDashoffset="0" 
                />

                {/* Confirmed portion */}
                <circle 
                  className="donut-segment" 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--color-confirmed)" 
                  strokeWidth="12" 
                  strokeDasharray={`${strokeConfirmed} ${circumference - strokeConfirmed}`} 
                  strokeDashoffset={offsetConfirmed} 
                />

                {/* Cancelled portion */}
                <circle 
                  className="donut-segment" 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--color-cancelled)" 
                  strokeWidth="12" 
                  strokeDasharray={`${strokeCancelled} ${circumference - strokeCancelled}`} 
                  strokeDashoffset={offsetCancelled} 
                />
              </svg>

              <div className="status-legend">
                <div className="legend-item">
                  <span className="legend-dot pending"></span>
                  <span>Ped. ({data.reservations_by_status.pending})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot confirmed"></span>
                  <span>Conf. ({data.reservations_by_status.confirmed})</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot cancelled"></span>
                  <span>Canc. ({data.reservations_by_status.cancelled})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Reservations and Popular Activities */}
      <div className="dashboard-grid">
        <div className="widget-row-1">
          <div className="card-widget">
            <div className="widget-title">Últimas Reservas Agendadas</div>
            <div className="recent-list">
              {data.recent_reservations.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No hay reservas recientes registradas.</p>
              ) : (
                data.recent_reservations.map((res) => (
                  <div key={res.id} className="recent-item">
                    <div className="recent-client-info">
                      <span className="client-name-bold">{res.client.name}</span>
                      <span className="activity-name-sub">{res.activity.name} • {res.reservation_date}</span>
                    </div>
                    <div className="recent-meta">
                      <span className="price-tag">{formatCOP(res.total_price)}</span>
                      <span className={`badge ${res.status}`}>
                        {res.status === 'confirmed' ? 'Confirmado' : res.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="widget-row-2">
          <div className="card-widget">
            <div className="widget-title">Destinos Destacados</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.popular_activities.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No hay suficientes datos.</p>
              ) : (
                data.popular_activities.map((act, index) => (
                  <div key={act.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: index === 0 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : index === 1 ? 'linear-gradient(135deg, #C0C0C0, #808080)' : 'linear-gradient(135deg, #CD7F32, #8B4513)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontWeight: 'bold', fontFamily: 'var(--font-title)'
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{act.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{act.location}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-blue-light)', fontFamily: 'var(--font-title)' }}>
                        {act.reservations_count}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Viajes</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
