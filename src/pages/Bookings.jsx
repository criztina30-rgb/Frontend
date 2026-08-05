import { useEffect, useState } from 'react';
import { getBookings, deleteBooking, updateBookingStatus } from '../api/bookings';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContainer, useToast } from '../components/Toast';

const STATUS_LABELS = {
  pending: { label: 'Pendiente', cls: 'badge--pending' },
  approved: { label: 'Aprobada', cls: 'badge--approved' },
  cancelled: { label: 'Cancelada', cls: 'badge--cancelled' },
  completed: { label: 'Completada', cls: 'badge--completed' },
};

export default function Bookings() {
  const { isAdmin } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getBookings();
      setBookings(res.data);
    } catch { addToast('Error al cargar reservas', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta reserva?')) return;
    try {
      await deleteBooking(id);
      addToast('Reserva eliminada');
      fetch();
    } catch { addToast('Error al eliminar', 'error'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, { status });
      addToast(`Estado actualizado a: ${STATUS_LABELS[status]?.label || status}`);
      fetch();
    } catch { addToast('Error al actualizar estado', 'error'); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main className="bookings-page">
        <div className="container">
          <h1 className="page-title">{isAdmin ? 'Todas las Reservas' : 'Mis Reservas'}</h1>

          {/* Status filter tabs */}
          <div className="filter-tabs">
            {['all', 'pending', 'approved', 'cancelled', 'completed'].map((s) => (
              <button
                key={s}
                className={`filter-tab ${filter === s ? 'filter-tab--active' : ''}`}
                onClick={() => setFilter(s)}
              >
                {s === 'all' ? 'Todas' : STATUS_LABELS[s]?.label}
                <span className="filter-tab__count">
                  {s === 'all' ? bookings.length : bookings.filter((b) => b.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-state__icon">📭</span>
              <p>No hay reservas en esta categoría.</p>
            </div>
          ) : (
            <div className="bookings-list">
              {filtered.map((b) => {
                const s = STATUS_LABELS[b.status] || { label: b.status, cls: '' };
                const days = b.startDate && b.endDate
                  ? Math.max(1, Math.round((new Date(b.endDate) - new Date(b.startDate)) / 86400000))
                  : '—';
                return (
                  <div key={b.id} className="booking-card">
                    <div className="booking-card__header">
                      <div>
                        <span className="booking-card__id">Reserva #{b.id}</span>
                        <span className={`badge ${s.cls}`}>{s.label}</span>
                      </div>
                      <div className="booking-card__moto">
                        🏍️ {b.motorcycle?.brand} {b.motorcycle?.model || '—'}
                      </div>
                    </div>
                    <div className="booking-card__body">
                      <div className="booking-card__dates">
                        <div><span>📅 Inicio</span><strong>{b.startDate ? new Date(b.startDate).toLocaleDateString('es-MX') : '—'}</strong></div>
                        <div><span>📅 Fin</span><strong>{b.endDate ? new Date(b.endDate).toLocaleDateString('es-MX') : '—'}</strong></div>
                        <div><span>🗓️ Días</span><strong>{days}</strong></div>
                        <div><span>💰 Total</span><strong>${b.totalPrice || '—'}</strong></div>
                      </div>
                      {isAdmin && (
                        <div className="booking-card__user">
                          👤 {b.user?.name || 'Usuario desconocido'} ({b.user?.email || '—'})
                        </div>
                      )}
                    </div>
                    <div className="booking-card__footer">
                      {isAdmin && b.status === 'pending' && (
                        <>
                          <button className="btn btn--success btn--sm" onClick={() => handleStatus(b.id, 'approved')}>✓ Aprobar</button>
                          <button className="btn btn--danger btn--sm" onClick={() => handleStatus(b.id, 'cancelled')}>✕ Cancelar</button>
                        </>
                      )}
                      {(isAdmin || b.status === 'pending') && (
                        <button className="btn btn--outline btn--sm" onClick={() => handleDelete(b.id)}>🗑 Eliminar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
