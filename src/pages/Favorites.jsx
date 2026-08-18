import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Favorites() {
  const { favorites, loading } = useFavorites();

  return (
    <main className="favorites-page">
      <div className="container" style={{ paddingTop: '8rem', paddingBottom: '4rem', minHeight: 'calc(100vh - 200px)' }}>
        <h1 className="section-title">Mis Favoritos ❤️</h1>
        
        {loading ? (
          <LoadingSpinner />
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon">🤍</span>
            <p>Aún no tienes motocicletas guardadas en favoritos.</p>
            <Link to="/motorcycles" className="btn btn--primary">Explorar Catálogo</Link>
          </div>
        ) : (
          <div className="moto-grid">
            {favorites.map((m) => (
              <MotorcycleCard key={m.id} moto={m} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
