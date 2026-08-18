import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMGS = ['/moto_sport.png', '/moto_adventure.png', '/moto_naked.png', '/moto_cruiser.png'];
const FALLBACK_IMG = (id) => FALLBACK_IMGS[id % FALLBACK_IMGS.length] || FALLBACK_IMGS[0];

export default function MotorcycleCard({ moto }) {
  const { user } = useAuth();
  // Provide defaults in case FavoritesContext is still loading or undefined
  const favoritesCtx = useFavorites();
  const isFavorite = favoritesCtx?.isFavorite || (() => false);
  const toggleFavorite = favoritesCtx?.toggleFavorite || (async () => {});
  
  const isFav = isFavorite(moto.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert("Inicia sesión para agregar a favoritos");
      return;
    }
    await toggleFavorite(moto.id);
  };

  return (
    <div className="moto-card">
      <div className="moto-card__img-wrap">
        <img
          src={moto.imageUrl || FALLBACK_IMG(moto.id)}
          alt={`${moto.brand} ${moto.model}`}
          className="moto-card__img"
          onError={(e) => { e.target.src = FALLBACK_IMG(moto.id); }}
        />
        <span className={`moto-card__badge ${moto.available ? 'moto-card__badge--available' : 'moto-card__badge--unavailable'}`}>
          {moto.available ? 'Disponible' : 'No disponible'}
        </span>
        {moto.category && (
          <span className="moto-card__badge moto-card__badge--category" style={{ top: 'auto', bottom: '0.75rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
            {moto.category}
          </span>
        )}
        <button 
          className={`moto-card__favorite-btn ${isFav ? 'moto-card__favorite-btn--active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
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
