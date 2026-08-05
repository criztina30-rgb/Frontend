import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await register({ name: form.name, email: form.email, password: form.password });
      const { token, user } = res.data;
      loginUser(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    } finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">🏍️</div>
          <h1 className="auth-card__title">Crear cuenta</h1>
          <p className="auth-card__sub">Únete a nuestra comunidad de riders</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Nombre completo</label>
            <input
              id="reg-name"
              className="form-input" type="text" name="name"
              placeholder="Tu nombre" required
              value={form.name} onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Correo electrónico</label>
            <input
              id="reg-email"
              className="form-input" type="email" name="email"
              placeholder="tu@email.com" required
              value={form.email} onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Contraseña</label>
            <input
              id="reg-password"
              className="form-input" type="password" name="password"
              placeholder="Mínimo 6 caracteres" required minLength={6}
              value={form.password} onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirmar contraseña</label>
            <input
              id="reg-confirm"
              className="form-input" type="password" name="confirmPassword"
              placeholder="Repite tu contraseña" required
              value={form.confirmPassword} onChange={handle}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button id="register-submit" type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Creando cuenta…' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </main>
  );
}
