import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMotorcycle } from '../api/motorcycles';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { ToastContainer, useToast } from '../components/Toast';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80';

export default function MotorcycleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, addToast, removeToast } = useToast();

  const [moto, setMoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBooking, setShowBooking] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await getMotorcycle(id);
      setMoto(res.data);
    } catch {
      setError('No se pudo cargar la motocicleta.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div className="container error-state" style={{ paddingTop: '5rem' }}>
      <span className="error-state__icon">⚠️</span>
      <p>{error}</p>
      <button className="btn btn--outline" onClick={() => navigate(-1)}>Volver</button>
    </div>
  );
  if (!moto) return null;

  const reviews = moto.reviews || [];
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <main className="detail-page">
        <div className="container">
          <button className="btn btn--ghost btn--sm detail-back" onClick={() => navigate(-1)}>← Volver</button>

          <div className="detail-grid">
            {/* Left: Image */}
            <div className="detail-img-col">
              <div className="detail-img-wrap">
                <img
                  src={moto.imageUrl || FALLBACK_IMG}
                  alt={`${moto.brand} ${moto.model}`}
                  className="detail-img"
                  onError={(e) => { e.target.src = FALLBACK_IMG; }}
                />
                <span className={`moto-card__badge ${moto.available ? 'moto-card__badge--available' : 'moto-card__badge--unavailable'} detail-badge`}>
                  {moto.available ? '✓ Disponible' : '✗ No disponible'}
                </span>
              </div>
            </div>

            {/* Right: Info */}
            <div className="detail-info-col">
              <div className="detail-brand">{moto.brand}</div>
              <h1 className="detail-model">{moto.model}</h1>

              <div className="detail-meta">
                <div className="detail-meta-item"><span>📅</span><strong>{moto.year}</strong></div>
                <div className="detail-meta-item"><span>⚙️</span><strong>{moto.engineCapacity}cc</strong></div>
                {avgRating && (
                  <div className="detail-meta-item">
                    <span>⭐</span>
                    <strong>{avgRating} ({reviews.length} opinión{reviews.length !== 1 ? 'es' : ''})</strong>
                  </div>
                )}
              </div>

              <p className="detail-description">{moto.description}</p>

              <div className="detail-price-box">
                <div className="detail-price">
                  <span className="detail-price-amount">${moto.price}</span>
                  <span className="detail-price-unit">/día</span>
                </div>
                {moto.available ? (
                  user ? (
                    <button className="btn btn--primary btn--lg" onClick={() => setShowBooking(true)}>
                      Reservar Ahora
                    </button>
                  ) : (
                    <button className="btn btn--primary btn--lg" onClick={() => navigate('/login')}>
                      Iniciar sesión para reservar
                    </button>
                  )
                ) : (
                  <button className="btn btn--disabled btn--lg" disabled>No disponible</button>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <section className="detail-reviews">
            <h2 className="detail-reviews__title">Opiniones ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="detail-reviews__empty">Aún no hay opiniones. ¡Sé el primero!</p>
            ) : (
              <div className="reviews-list">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}

            {user && (
              <ReviewForm
                motorcycleId={moto.id}
                onSuccess={() => { addToast('¡Opinión publicada exitosamente!'); fetch(); }}
              />
            )}
            {!user && (
              <p className="detail-reviews__login-hint">
                <a href="/login">Inicia sesión</a> para dejar tu opinión.
              </p>
            )}
          </section>
        </div>
      </main>

      {showBooking && (
        <BookingModal
          moto={moto}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            addToast('¡Reserva creada exitosamente! Revisa tu panel.');
          }}
        />
      )}
    </>
  );
}
