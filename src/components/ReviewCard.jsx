const STARS = [1, 2, 3, 4, 5];

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-card__header">
        <div className="review-card__avatar">{review.user?.name?.charAt(0).toUpperCase() || '?'}</div>
        <div>
          <div className="review-card__author">{review.user?.name || 'Usuario'}</div>
          <div className="review-card__stars">
            {STARS.map((s) => (
              <span key={s} className={s <= review.rating ? 'star star--filled' : 'star'}>★</span>
            ))}
          </div>
        </div>
        <span className="review-card__date">{new Date(review.createdAt).toLocaleDateString('es-MX')}</span>
      </div>
      {review.comment && <p className="review-card__comment">{review.comment}</p>}
    </div>
  );
}
