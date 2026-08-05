import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getMotorcycles } from '../api/motorcycles';
import MotorcycleCard from '../components/MotorcycleCard';
import LoadingSpinner from '../components/LoadingSpinner';

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
        <div className="hero__bg" aria-hidden="true" />
        <div className="hero__content">
          <div className="hero__badge">🏍️ Renta de Motocicletas</div>
          <h1 className="hero__title">
            Vive la libertad<br />
            <span className="hero__title--accent">sobre dos ruedas</span>
          </h1>
          <p className="hero__subtitle">
            Elige entre nuestra amplia flota de motocicletas premium. Proceso simple, precios justos y experiencias únicas.
          </p>
          <div className="hero__actions">
            <Link to="/motorcycles" className="btn btn--primary btn--lg">Ver Catálogo</Link>
            <Link to="/register" className="btn btn--glass btn--lg">Crear Cuenta</Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat"><strong>+50</strong><span>Motocicletas</span></div>
            <div className="hero__stat-div" />
            <div className="hero__stat"><strong>24/7</strong><span>Disponibilidad</span></div>
            <div className="hero__stat-div" />
            <div className="hero__stat"><strong>100%</strong><span>Satisfacción</span></div>
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">↓</div>
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
