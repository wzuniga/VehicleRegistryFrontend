import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Las contraseñas no coinciden.'); return; }
    if (form.password.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/new-search');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <nav className="auth-navbar">
        <Link to="/" className="auth-navbar__logo">Auto Check</Link>
        <Link to="/login" className="auth-navbar__link">¿Ya tienes cuenta? Inicia sesión</Link>
      </nav>

      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-card__title">Crear cuenta</h1>
          <p className="auth-card__subtitle">Únete a Auto Check y consulta cualquier vehículo</p>

          <div className="auth-card__bonus">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
            Al registrarte recibirás <strong>5 créditos de bienvenida</strong>
          </div>

          {error && <div className="auth-alert auth-alert--error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="name">Nombre completo</label>
              <input id="name" type="text" className="auth-form__input" required
                placeholder="Juan Pérez" value={form.name} onChange={set('name')} autoComplete="name" />
            </div>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="email">Correo electrónico</label>
              <input id="email" type="email" className="auth-form__input" required
                placeholder="tu@correo.com" value={form.email} onChange={set('email')} autoComplete="email" />
            </div>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="password">Contraseña</label>
              <input id="password" type="password" className="auth-form__input" required
                placeholder="Mínimo 8 caracteres" value={form.password} onChange={set('password')} autoComplete="new-password" />
            </div>
            <div className="auth-form__group">
              <label className="auth-form__label" htmlFor="confirm">Confirmar contraseña</label>
              <input id="confirm" type="password" className={`auth-form__input${form.confirm && form.confirm !== form.password ? ' error' : ''}`}
                required placeholder="Repite tu contraseña" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
              {form.confirm && form.confirm !== form.password &&
                <span className="auth-form__error">Las contraseñas no coinciden</span>}
            </div>

            <button type="submit" className="auth-btn auth-btn--primary" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="auth-divider" style={{ marginTop: '1.25rem' }}>o</div>

          <button className="auth-btn auth-btn--google" style={{ marginTop: '0.5rem' }} onClick={loginWithGoogle} type="button">
            <GoogleIcon />
            Registrarse con Google
          </button>

          <div className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
