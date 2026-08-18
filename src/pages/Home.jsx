import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMotorcycles } from '../api/motorcycles';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMotorcycles({ available: 'true' })
      .then((res) => setFeatured(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true"
          style={{ backgroundImage: 'url(/hero_background.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <img
          src="/hero_motorcycle.png"
          alt="Motocicleta en carretera de montaña"
          className="hero__moto-img"
          aria-hidden="true"
        />
        <div className="hero__content">
          <div className="hero__badge">🏍️ Renta de Motocicletas</div>
          <h1 className="hero__title" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>
            Encuentra la motocicleta<br />
            <span className="hero__title--accent">perfecta para ti</span>
          </h1>
          <p className="hero__subtitle">
            Descubre motocicletas, compara características y encuentra el modelo ideal para tu próxima aventura.
          </p>
          
          <div style={{ width: '100%', maxWidth: '500px', margin: '1rem 0' }}>
            <SearchBar />
          </div>

          <div className="hero__actions">
            <Link to="/motorcycles" className="btn btn--primary btn--lg">Ver motocicletas</Link>
            <Link to="/motorcycles?available=true" className="btn btn--glass btn--lg">Explorar modelos</Link>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">↓</div>
      </section>

      {/* Categories */}
      <section className="categories-section" style={{ padding: '5rem 0', background: 'var(--bg-base)' }}>
        <div className="container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Categorías Populares</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
            {[
              { name: 'Urbana', icon: '🏙️', desc: 'Ideales para la ciudad y el tráfico diario.', link: '/motorcycles?category=Urbana' },
              { name: 'Sport', icon: '🏎️', desc: 'Velocidad y aerodinámica en su máxima expresión.', link: '/motorcycles?category=Sport' },
              { name: 'Adventure', icon: '🏔️', desc: 'Diseñadas para explorar sin límites.', link: '/motorcycles?category=Adventure' },
              { name: 'Cruiser', icon: '🛣️', desc: 'Comodidad y estilo clásico para viajes largos.', link: '/motorcycles?category=Cruiser' },
            ].map(cat => (
              <Link to={cat.link} key={cat.name} className="feature-card" style={{ textAlign: 'center', textDecoration: 'none' }}>
                <div className="feature-card__icon" style={{ fontSize: '3rem' }}>{cat.icon}</div>
                <h3 className="feature-card__title" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p className="feature-card__desc">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="features__grid">
            {[
              { icon: '⚡', title: 'Reserva Instantánea', desc: 'Confirma tu reserva en segundos sin papeleo innecesario.' },
              { icon: '🛡️', title: 'Seguro Incluido', desc: 'Todas nuestras motos incluyen cobertura básica sin costo adicional.' },
              { icon: '📍', title: 'Múltiples Ubicaciones', desc: 'Recoge y entrega en el punto que más te convenga.' },
              { icon: '💳', title: 'Precio Justo', desc: 'Tarifas transparentes sin cargos ocultos ni sorpresas.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon">{f.icon}</div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Motorcycles */}
      <section className="featured">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Motos Destacadas</h2>
            <Link to="/motorcycles" className="btn btn--outline btn--sm">Ver todas →</Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="moto-grid">
              {featured.map((m) => <MotorcycleCard key={m.id} moto={m} />)}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <div className="cta__box">
            <h2 className="cta__title">¿Listo para arrancar?</h2>
            <p className="cta__subtitle">Regístrate gratis y haz tu primera reserva hoy.</p>
            <Link to="/register" className="btn btn--primary btn--lg">Comenzar Ahora</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
