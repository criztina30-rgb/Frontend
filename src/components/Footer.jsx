import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__content">
        <div className="footer__brand">
          <span className="footer__logo">🏍️</span>
          <span className="footer__name">ProyMotos</span>
          <p className="footer__tagline">La mejor experiencia en renta de motocicletas.</p>
        </div>
        <div className="footer__links">
          <div className="footer__col">
            <h4>Navegación</h4>
            <Link to="/">Inicio</Link>
            <Link to="/motorcycles">Catálogo</Link>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </div>
          <div className="footer__col">
            <h4>Mi Cuenta</h4>
            <Link to="/dashboard">Panel</Link>
            <Link to="/bookings">Mis Reservas</Link>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} ProyMotos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
