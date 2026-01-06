import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

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
            <span className="logo-icon">🚗</span>
            <span className="logo-text">Auto Check</span>
          </div>
          <div className="navbar-menu">
            <a href="#features" className="nav-link">Características</a>
            <a href="#benefits" className="nav-link">Beneficios</a>
            <button className="nav-btn" onClick={handleGetReport}>Consultar ahora</button>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">🔒</span>
            <span>Informes verificados y confiables</span>
          </div>
          <h1 className="hero-title">
            Decisiones inteligentes basadas en <span className="gradient-text">datos reales</span>
          </h1>
          <p className="hero-subtitle">
            Tu seguridad financiera comienza con información verificada. No arriesgues tu inversión por falta de datos.
          </p>
          <p className="hero-description hide-mobile">
            Comprar un vehículo sin la información correcta es apostar tu dinero, tu tiempo y tu paz mental. 
            Con nuestro análisis profesional, obtienes claridad total sobre el historial del vehículo antes de decidir.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary" onClick={handleGetReport}>
              <span>🚀</span> Consulta ahora
            </button>
            <button className="btn btn-secondary" onClick={handleWhatsApp}>
              <span>💬</span> Contáctanos
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">✓</div>
            <div className="card-text">Sin multas pendientes</div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🛡️</div>
            <div className="card-text">SOAT vigente</div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">📊</div>
            <div className="card-text">Precio justo verificado</div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="quick-search-section">
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
      </section>

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
            <div className="feature-icon">📅</div>
            <h3>Línea de tiempo visual</h3>
            <p>Visualiza todos los eventos importantes en orden cronológico con alertas automáticas ante puntos sospechosos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Datos del propietario</h3>
            <p>Verifica la identidad y el historial del dueño actual</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Historial completo</h3>
            <p>Accede a todos los antecedentes y registros del vehículo</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Multas y obligaciones</h3>
            <p>Descubre papeletas, deudas y compromisos pendientes</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>SOAT vigente</h3>
            <p>Confirma que el seguro obligatorio está al día</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Revisión técnica</h3>
            <p>Estado actual de las inspecciones obligatorias</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚖️</div>
            <h3>Cargas y gravámenes</h3>
            <p>Detecta hipotecas, embargos y restricciones legales</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚨</div>
            <h3>Órdenes judiciales</h3>
            <p>Verifica si existe alguna orden de captura o denuncia</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚕</div>
            <h3>Uso comercial</h3>
            <p>Identifica si fue usado como taxi o servicio público</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💥</div>
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
            <div className="benefit-icon">🧠</div>
            <h3>Análisis interpretado</h3>
            <p>No solo datos crudos. Te explicamos qué significa cada hallazgo de forma clara y directa.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🛡️</div>
            <h3>Protección garantizada</h3>
            <p>Identifica estafas, deudas ocultas y problemas legales antes de que sea demasiado tarde.</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📊</div>
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
              <span>🚀</span> Obtener mi informe ahora
            </button>
            <button className="btn btn-secondary btn-large" onClick={handleWhatsApp}>
              <span>🔍</span> Consultar por WhatsApp
            </button>
          </div>
          <p className="cta-note">
            <span className="check-icon">✓</span> Resultados en minutos · <span className="check-icon">✓</span> Información verificada · <span className="check-icon">✓</span> Soporte personalizado
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
