import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getBookings } from '../api/bookings';
import { getMotorcycles } from '../api/motorcycles';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUS_LABELS = {
  pending: { label: 'Pendiente', cls: 'badge--pending' },
  approved: { label: 'Aprobada', cls: 'badge--approved' },
  cancelled: { label: 'Cancelada', cls: 'badge--cancelled' },
  completed: { label: 'Completada', cls: 'badge--completed' },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [totalMotos, setTotalMotos] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBookings(), getMotorcycles()])
      .then(([bRes, mRes]) => {
        setBookings(bRes.data);
        setTotalMotos(mRes.data.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    approved: bookings.filter((b) => b.status === 'approved').length,
    spent: bookings
      .filter((b) => b.status !== 'cancelled')
      .reduce((s, b) => s + (b.totalPrice || 0), 0),
  };

  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <main className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">¡Hola, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="dashboard-sub">Aquí está el resumen de tu actividad</p>
          </div>
          <Link to="/motorcycles" className="btn btn--primary">+ Nueva Reserva</Link>
        </div>

        {loading ? <LoadingSpinner /> : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card__icon">📋</div>
                <div className="stat-card__value">{stats.total}</div>
                <div className="stat-card__label">Total Reservas</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__icon">⏳</div>
                <div className="stat-card__value">{stats.pending}</div>
                <div className="stat-card__label">Pendientes</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__icon">✅</div>
                <div className="stat-card__value">{stats.approved}</div>
                <div className="stat-card__label">Aprobadas</div>
              </div>
              <div className="stat-card stat-card--accent">
                <div className="stat-card__icon">🏍️</div>
                <div className="stat-card__value">{totalMotos}</div>
                <div className="stat-card__label">Motos en catálogo</div>
              </div>
            </div>

            <div className="dashboard-section">
              <div className="section-header">
                <h2 className="dashboard-section-title">Reservas recientes</h2>
                <Link to="/bookings" className="btn btn--outline btn--sm">Ver todas →</Link>
              </div>
              {recent.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-state__icon">📭</span>
                  <p>No tienes reservas aún.</p>
                  <Link to="/motorcycles" className="btn btn--primary btn--sm">Explorar Motocicletas</Link>
                </div>
              ) : (
                <div className="bookings-table-wrap">
                  <table className="bookings-table">
                    <thead>
                      <tr>
                        <th>ID</th><th>Motocicleta</th><th>Inicio</th><th>Fin</th><th>Total</th><th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((b) => {
                        const s = STATUS_LABELS[b.status] || { label: b.status, cls: '' };
                        return (
                          <tr key={b.id}>
                            <td>#{b.id}</td>
                            <td>{b.motorcycle?.brand} {b.motorcycle?.model || '—'}</td>
                            <td>{b.startDate ? new Date(b.startDate).toLocaleDateString('es-MX') : '—'}</td>
                            <td>{b.endDate ? new Date(b.endDate).toLocaleDateString('es-MX') : '—'}</td>
                            <td>${b.totalPrice || '—'}</td>
                            <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
