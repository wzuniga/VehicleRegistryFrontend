import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import rav4Image from '../assets/rav4.png';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetReport = () => {
    navigate('/search');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hola, quiero solicitar un informe vehicular completo');
    window.open(`https://wa.me/51959314336?text=${message}`, '_blank');
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            {/* <span className="logo-icon">🚗</span> */}
            <span className="logo-text">Auto Check</span>
          </div>
          <div className="navbar-menu">
            <a href="#features" className="nav-link">Características</a>
            <a href="#benefits" className="nav-link">Beneficios</a>
            <button className="nav-btn" onClick={handleGetReport}>Consultar ahora</button>
          </div>
        </div>
      </nav>

      {/* Main Search Section */}
      <section className="main-search-section">
        <div className="main-search-container">
          <h1 className="main-search-title">
            Consulta un auto antes de comprarlo
          </h1>
          <p className="main-search-subtitle">
            Ingresa la placa y conoce si tiene SOAT, accidentes, papeletas y más.
          </p>
          <form className="main-search-form" onSubmit={(e) => {
            e.preventDefault();
            const plate = e.target.plate.value.trim().toUpperCase();
            if (plate) {
              navigate(`/search?plate=${encodeURIComponent(plate)}`);
            }
          }}>
            <div className="main-search-input-group">
              <input 
                type="text" 
                name="plate"
                placeholder="Ej: ABC123" 
                className="main-search-input"
                maxLength="8"
                required
              />
              <button type="submit" className="main-search-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
            </div>
          </form>
          <div className="car-image-container">
            <img src={rav4Image} alt="RAV4" className="car-image" />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <span>Informes verificados y confiables</span>
          </div>
          <h1 className="hero-title">
            Decisiones inteligentes basadas en <span className="gradient-text">datos reales</span>
          </h1>
          <p className="hero-subtitle">
            Tu seguridad financiera comienza con información verificada. No arriesgues tu inversión por falta de datos.
          </p>
          {/* <p className="hero-description hide-mobile">
            Comprar un vehículo sin la información correcta es apostar tu dinero, tu tiempo y tu paz mental. 
            Con nuestro análisis profesional, obtienes claridad total sobre el historial del vehículo antes de decidir.
          </p> */}
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={handleGetReport}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.625-.625 1-1.375 1-2.125 0-.875-.625-1.5-1.5-1.5-.75 0-1.5.375-2.125 1z"></path>
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </span> Consulta ahora
            </button>
            <button className="btn btn-secondary" onClick={handleWhatsApp}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </span> Contáctanos
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div className="card-text">Sin multas pendientes</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <div className="card-text">SOAT vigente</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <div className="card-text">Precio justo verificado</div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      {/* <section className="quick-search-section">
        <div className="quick-search-content">
          <h2 className="quick-search-title">Prueba ahora con tu placa</h2>
          <p className="quick-search-subtitle">Ingresa la placa del vehículo y obtén tu informe al instante</p>
          <form className="search-form" onSubmit={(e) => {
            e.preventDefault();
            const plate = e.target.plate.value.trim().toUpperCase();
            if (plate) {
              navigate(`/search?plate=${encodeURIComponent(plate)}`);
            }
          }}>
            <div className="search-input-group">
              <input 
                type="text" 
                name="plate"
                placeholder="Ej: ABC123" 
                className="search-input"
                maxLength="8"
                required
              />
              <button type="submit" className="search-btn">
                <span>🔍</span> Buscar ahora
              </button>
            </div>
            <p className="search-note">✓ Resultados instantáneos · ✓ Datos verificados · ✓ 100% confiable</p>
          </form>
        </div>
      </section> */}

      {/* Features Grid */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">¿Qué incluye tu informe?</h2>
          <p className="section-subtitle">
            Toda la información crítica que necesitas en un solo lugar
          </p>
        </div>
        <div className="features-grid">
          <div className="feature-card highlight feature-card-wide">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3>Línea de tiempo visual</h3>
            <p>Visualiza todos los eventos importantes en orden cronológico con alertas automáticas ante puntos sospechosos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Datos del propietario</h3>
            <p>Verifica la identidad y el historial del dueño actual</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
            </div>
            <h3>Historial completo</h3>
            <p>Accede a todos los antecedentes y registros del vehículo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <h3>Multas y obligaciones</h3>
            <p>Descubre papeletas, deudas y compromisos pendientes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>SOAT vigente</h3>
            <p>Confirma que el seguro obligatorio está al día</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3>Revisión técnica</h3>
            <p>Estado actual de las inspecciones obligatorias</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="3" x2="12" y2="18"></line>
                <path d="M8 18h8"></path>
                <path d="M5 21h14"></path>
                <path d="M19 6h-2.5a2 2 0 0 1-2-2V2"></path>
                <path d="M5 6h2.5a2 2 0 0 0 2-2V2"></path>
              </svg>
            </div>
            <h3>Cargas y gravámenes</h3>
            <p>Detecta hipotecas, embargos y restricciones legales</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h3>Órdenes judiciales</h3>
            <p>Verifica si existe alguna orden de captura o denuncia</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 17h14v5H5z"></path>
                <path d="M5 17l-2-4.5V8h2.5"></path>
                <path d="M19 17l2-4.5V8h-2.5"></path>
                <path d="M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path>
                <circle cx="7" cy="17" r="1"></circle>
                <circle cx="17" cy="17" r="1"></circle>
              </svg>
            </div>
            <h3>Uso comercial</h3>
            <p>Identifica si fue usado como taxi o servicio público</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h3>Accidentes reportados</h3>
            <p>Conoce el historial de choques y siniestros graves</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-header">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <p className="section-subtitle">
            Más que datos, te damos tranquilidad y control
          </p>
        </div>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
              </svg>
            </div>
            <h3>Análisis interpretado</h3>
            <p>No solo datos crudos. Te explicamos qué significa cada hallazgo de forma clara y directa.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Protección garantizada</h3>
            <p>Identifica estafas, deudas ocultas y problemas legales antes de que sea demasiado tarde.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>Veredicto definitivo</h3>
            <p>Recibe una evaluación final: compra segura, revisar con cuidado o alto riesgo evidente.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">No arriesgues tu dinero por falta de información</h2>
          <p className="cta-subtitle">
            Cada día, personas pierden miles por no verificar. Invierte en certeza, no en dudas.
          </p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large" onClick={handleGetReport}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.25-2 5-2 5s3.75-.5 5-2c.625-.625 1-1.375 1-2.125 0-.875-.625-1.5-1.5-1.5-.75 0-1.5.375-2.125 1z"></path>
                  <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </span> Obtener mi informe ahora
            </button>
            <button className="btn btn-secondary btn-large" onClick={handleWhatsApp}>
              <span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </span> Consultar por WhatsApp
            </button>
          </div>
          <p className="cta-note">
            <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span> Resultados en minutos · <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span> Información verificada · <span className="check-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#213547" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span> Soporte personalizado
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 Vehicle Registry. Informes vehiculares profesionales.</p>
        <p className="footer-tagline">Analiza. Verifica. Decide con evidencia.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
