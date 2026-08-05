import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(form);
      const { token, user } = res.data;
      loginUser(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally { setLoading(false); }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <div className="auth-card__logo">🏍️</div>
          <h1 className="auth-card__title">Bienvenido de vuelta</h1>
          <p className="auth-card__sub">Inicia sesión en tu cuenta</p>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              className="form-input" type="email" name="email"
              placeholder="tu@email.com" required
              value={form.email} onChange={handle}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              className="form-input" type="password" name="password"
              placeholder="••••••••" required
              value={form.password} onChange={handle}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button id="login-submit" type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
            {loading ? 'Iniciando sesión…' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="auth-card__switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
}
