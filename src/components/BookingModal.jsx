import { useState } from 'react';
import { createBooking } from '../api/bookings';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ moto, onClose, onSuccess }) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const diff = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);
    return diff > 0 ? diff : 0;
  };

  const days = calcDays();
  const total = days * moto.price;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (days <= 0) { setError('La fecha de fin debe ser posterior a la de inicio.'); return; }
    setLoading(true);
    try {
      await createBooking({ motorcycleId: moto.id, startDate, endDate });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Reservar {moto.brand} {moto.model}</h2>
          <button className="modal__close" onClick={onClose}>×</button>
        </div>

        <form className="modal__body" onSubmit={submit}>
          <div className="modal__moto-info">
            <span className="modal__price-tag">${moto.price}/día</span>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de inicio</label>
            <input
              id="booking-start"
              type="date" className="form-input" required
              min={today} value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de fin</label>
            <input
              id="booking-end"
              type="date" className="form-input" required
              min={startDate || today} value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {days > 0 && (
            <div className="modal__summary">
              <div className="modal__summary-row">
                <span>Días:</span><strong>{days}</strong>
              </div>
              <div className="modal__summary-row modal__summary-row--total">
                <span>Total estimado:</span><strong>${total}</strong>
              </div>
            </div>
          )}

          {error && <p className="form-error">{error}</p>}

          <div className="modal__footer">
            <button type="button" className="btn btn--outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Reservando…' : 'Confirmar Reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
