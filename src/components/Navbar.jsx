import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo">🏍️</span>
          <span className="navbar__name">ProyMotos</span>
        </Link>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'bar bar--open' : 'bar'}></span>
          <span className={menuOpen ? 'bar bar--open' : 'bar'}></span>
          <span className={menuOpen ? 'bar bar--open' : 'bar'}></span>
        </button>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/motorcycles" className="navbar__link">Catálogo</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar__link">Mi Panel</Link>
              <Link to="/bookings" className="navbar__link">Reservas</Link>
              {isAdmin && <Link to="/admin" className="navbar__link navbar__link--admin">Admin</Link>}
              <div className="navbar__user">
                <span className="navbar__avatar">{user.name?.charAt(0).toUpperCase()}</span>
                <span className="navbar__username">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn--outline btn--sm">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__link">Iniciar Sesión</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
