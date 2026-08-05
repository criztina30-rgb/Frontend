import { Link } from 'react-router-dom';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';

export default function MotorcycleCard({ moto }) {
  return (
    <div className="moto-card">
      <div className="moto-card__img-wrap">
        <img
          src={moto.imageUrl || FALLBACK_IMG}
          alt={`${moto.brand} ${moto.model}`}
          className="moto-card__img"
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
        />
        <span className={`moto-card__badge ${moto.available ? 'moto-card__badge--available' : 'moto-card__badge--unavailable'}`}>
          {moto.available ? 'Disponible' : 'No disponible'}
        </span>
      </div>
      <div className="moto-card__body">
        <div className="moto-card__brand">{moto.brand}</div>
        <h3 className="moto-card__model">{moto.model}</h3>
        <div className="moto-card__meta">
          <span className="moto-card__year">📅 {moto.year}</span>
          <span className="moto-card__engine">⚙️ {moto.engineCapacity}cc</span>
        </div>
        <p className="moto-card__desc">{moto.description?.slice(0, 80)}{moto.description?.length > 80 ? '…' : ''}</p>
        <div className="moto-card__footer">
          <div className="moto-card__price">
            <span className="moto-card__price-amount">${moto.price}</span>
            <span className="moto-card__price-unit">/día</span>
          </div>
          <Link to={`/motorcycles/${moto.id}`} className="btn btn--primary btn--sm">Ver Detalles</Link>
        </div>
      </div>
    </div>
  );
}
