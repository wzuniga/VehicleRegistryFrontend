import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/login'); return; }
    handleGoogleCallback(token)
      .then(() => navigate('/new-search'))
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#f8fafc',
    }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="9" stroke="#e2e8f0" strokeWidth="2.5" />
          <path d="M12 3a9 9 0 0 1 9 9" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#94a3b8', marginTop: '1rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
          Autenticando con Google...
        </p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
