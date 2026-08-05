import { useState } from 'react';
import { createReview } from '../api/reviews';

const STARS = [1, 2, 3, 4, 5];

export default function ReviewForm({ motorcycleId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) { setError('Por favor selecciona una calificación.'); return; }
    setLoading(true); setError('');
    try {
      await createReview({ motorcycleId, rating, comment });
      setRating(0); setComment('');
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar opinión');
    } finally { setLoading(false); }
  };

  return (
    <form className="review-form" onSubmit={submit}>
      <h4 className="review-form__title">Deja tu opinión</h4>
      <div className="review-form__stars">
        {STARS.map((s) => (
          <span
            key={s}
            className={`star star--lg ${s <= (hovered || rating) ? 'star--filled' : ''}`}
            onClick={() => setRating(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            style={{ cursor: 'pointer' }}
          >★</span>
        ))}
      </div>
      <textarea
        className="form-input review-form__textarea"
        placeholder="Escribe un comentario... (opcional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
      />
      {error && <p className="form-error">{error}</p>}
      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? 'Publicando…' : 'Publicar Opinión'}
      </button>
    </form>
  );
}
