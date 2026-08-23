import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './ManualFilter.css';
import sunarpImg from '../assets/manualFilter/sunarp-removebg-preview.png';
import sprlSunarpImg from '../assets/manualFilter/sprl-sunarp-removebg-preview.png';
import satLogo from '../assets/manualFilter/SAT_LOGO.webp';
import conoceAquiIcon from '../assets/manualFilter/conoce-aqui-icon.svg';
import sutranLogo from '../assets/manualFilter/logo-sutran.png';
import sbsLogo from '../assets/manualFilter/SBS_logotipo.svg.png';
import callaoLogo from '../assets/manualFilter/logo_export.png';
import apesegLogo from '../assets/manualFilter/logo-apeseg.png';
import atuLogo from '../assets/manualFilter/Logotipo_ATU.png';
import infogasLogo from '../assets/manualFilter/Infogas-Logo.webp';
import appCambioPlacaLogo from '../assets/manualFilter/logo_app_export.png';
import sigueloPlusLogo from '../assets/manualFilter/siguelo_plus.png';

function ManualFilter() {
  const { user } = useAuth();

  // Servicios principales de consulta
  const mainServices = [
    {
      title: '🔍 Consulta de Placa al Instante',
      subtitle: 'Datos del vehículo',
      image: sunarpImg,
      link: 'https://consultavehicular.sunarp.gob.pe/',
      whiteFilter: true,
      description: 'Descubre rápidamente en qué ciudad fue registrada la placa del vehículo.'
    },
    {
      title: '📜 Historial Completo de Propietarios',
      subtitle: 'Dueños anteriores',
      image: sprlSunarpImg,
      link: 'https://sprl.sunarp.gob.pe/sprl/ingreso',
      whiteFilter: true,
      description: 'Consulta todo el historial del vehículo. Conoce cuántos dueños ha tenido.'
    },
    {
      title: '🚀 Conoce Aquí',
      subtitle: 'Historial del vehículo GRATIS',
      image: conoceAquiIcon,
      link: 'https://conoce-aqui.sunarp.gob.pe/conoce-aqui/inicio',
      whiteFilter: true,
      description: 'Visualiza al instante el contenido de las partidas registrales gratis.'
    },
    {
      title: '🎯 Síguelo Plus',
      subtitle: 'Seguimiento de títulos',
      image: sigueloPlusLogo,
      link: 'https://sigueloplus.sunarp.gob.pe/siguelo/',
      whiteFilter: true,
      description: 'Realiza seguimiento de tu trámite y conoce el precio de la última compra.'
    }
  ];

  // Multas y papeletas
  const finesServices = [
    {
      title: '⚠️ SAT Multas Lima',
      subtitle: 'Papeletas en Lima',
      image: satLogo,
      link: 'https://www.sat.gob.pe/pagosenlinea/',
      whiteFilter: true,
      description: 'Consulta si el auto tiene multas en Lima.'
    },
    {
      title: '🚦 ATU Multas',
      subtitle: 'Infracciones de transporte',
      image: atuLogo,
      link: 'https://pasarela.atu.gob.pe/',
      whiteFilter: true,
      description: 'Verifica multas en ATU para transporte público y privado.'
    },
    {
      title: '🚨 SUTRAN Multas',
      subtitle: 'Record de infracciones',
      image: sutranLogo,
      link: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/record-de-infracciones/',
      whiteFilter: true,
      description: 'Consulta el récord de infracciones de transporte.'
    },
    {
      title: '🔍 Verifica Multa SUTRAN',
      subtitle: 'Detalle de infracciones',
      image: sutranLogo,
      link: 'https://www.sutran.gob.pe/consultas/record-de-infracciones/verifica-tu-infraccion/',
      description: 'Verifica el detalle específico de una infracción.'
    },
    {
      title: '🚨 SAT Orden de Captura',
      subtitle: 'Alertas legales',
      image: satLogo,
      link: 'https://www.sat.gob.pe/VirtualSAT/modulos/Capturas.aspx?mysession=',
      whiteFilter: true,
      description: 'Consulta si hay órdenes de captura por deudas o papeletas.'
    }
  ];

  // Seguros y seguridad
  const insuranceServices = [
    {
      title: '🛡️ Vigencia del SOAT',
      subtitle: 'Seguro obligatorio activo',
      image: apesegLogo,
      link: 'https://www.apeseg.org.pe/consultas-soat/',
      whiteFilter: true,
      description: 'El SOAT debe estar activo para circular legalmente.'
    },
    {
      title: '🚗 SBS Choques y Siniestros',
      subtitle: 'Historial de accidentes',
      image: sbsLogo,
      link: 'https://servicios.sbs.gob.pe/reportesoat/BusquedaPlaca',
      whiteFilter: true,
      description: 'Consulta si el auto estuvo en accidentes cubiertos por SOAT.'
    }
  ];

  // Revisiones técnicas y cambios
  const technicalServices = [
    {
      title: '🔧 Revisión Técnica',
      subtitle: 'Certificado vigente',
      textOnly: true,
      displayText: 'MTC',
      link: 'https://rec.mtc.gob.pe/Citv/ArConsultaCitv',
      description: 'Verifica si la revisión técnica está vigente.'
    },
    {
      title: '📱 APP Cambio de Placa',
      subtitle: 'Estado de trámite',
      image: appCambioPlacaLogo,
      link: 'https://www.placas.pe/Public/CheckPlateStatus.aspx',
      description: 'Verifica el estado de tu trámite de cambio de placa.'
    }
  ];

  // GNV y combustibles
  const fuelServices = [
    {
      title: '⛽ Info Gas - Deuda por Placa',
      subtitle: 'Verificación GNV',
      image: infogasLogo,
      link: 'https://infogas.com.pe/',
      whiteFilter: true,
      description: 'Consulta deudas relacionadas con sistema GNV.'
    },
    {
      title: '⛽ Verificación FISE',
      subtitle: 'Créditos pendientes GNV',
      image: infogasLogo,
      link: 'https://fise.minem.gob.pe:23308/consulta-taller/pages/consultaTaller/inicio',
      whiteFilter: true,
      description: 'Revisa si hay créditos GNV pendientes.'
    }
  ];

  // Otros servicios municipales
  const municipalServices = [
    {
      title: '🏛️ Municipalidad Callao',
      subtitle: 'Papeletas Callao y provincias',
      image: callaoLogo,
      link: 'https://pagopapeletascallao.pe/',
      description: 'Consulta papeletas en Callao y provincias.'
    }
  ];

  // Combinar todos los servicios
  const services = [
    ...mainServices,
    ...finesServices,
    ...insuranceServices,
    ...technicalServices,
    ...fuelServices,
    ...municipalServices
  ];

  const paidServices = [
    {
      title: 'FILTRAMOS TU PLACA POR TI',
      image: 'https://lh3.googleusercontent.com/sitesv/AAzXCkemsJUbX0a9JXKBRZGtlw7yzfUK5XT-pAqJELbYfP08sJZVblCpRuNSp8WGZOHaZSPnoiuvCVJmvS6URR5wYkuFFc2sBJKIjako5hfwopIcQS55LRbi6Kv-Ac6aPifVHmgZUnKV8S7wPh7p9aoYeH5RP5D5V2Yq-NIGGAY6uyrK3U23-UqwZ6yEQCWeRwcw0CMFl1SKFfL5lF3ZurtS_uYwfIy6jUzAKuYGa9Q=w1280',
      link: 'https://wa.link/31pp6y'
    },
    {
      title: 'REPORTE INFOCORP EQUIFAX',
      image: 'https://lh3.googleusercontent.com/sitesv/AAzXCkev5v-uUAgt_016_eObsjZmJaStJUhahGwS_rfWl6yeGJmWRUKqZJlcpQ6maHAB86OD6AaxxkZFrUVFH9WnquUGyS_s1--t71qucbJDEwYZfHafMOtQl_lcjt0x4N8t4IUIzDvg5njBEQcPkRl45vI3YBVjM0U2Gdlu3Y17_Eg9tJJHURm37cetZeoY5tja5eHOx5Q_IwBIEa60Y_Klj3exw_XJe73v5mjqEu4=w1280',
      link: 'https://wa.link/inmk5j'
    },
    {
      title: 'OBTEN TU TARJETA DE PROPIEDAD',
      image: 'https://lh3.googleusercontent.com/sitesv/AAzXCkfnSHaTCOoyHPOA8LGmKXOZBM5p1tPjAVsQVNpCWeR07d1uTldWaTiUok5jDvMQ6Xt5PE02dcjqGg6dr-HirTrjuNdTXqN_SXmRbBKX5A1BMo0IyYAtozFQSs2Ka1KAVGbHLjpRopzeIkHQwLd0hcmGNOKYsTSbaKJVqTgi3iFXSswKBbLKcL54BnuAR4eF-sEomKGWYBdI5MrF7fly6WAe2ZJf9yGuPq8J1jQ=w1280',
      link: 'https://wa.link/t7scr9'
    }
  ];

  const provinceServices = [
    { title: 'SAT PIURA', link: 'https://satp.gob.pe/sistema-pagos/pasarela' },
    { title: 'SAT CHICLAYO', link: 'https://virtualsatch.satch.gob.pe/virtualsatch/record_infracciones/buscar_placa_' },
    { title: 'SAT TACNA MULTAS', link: 'https://www.munitacna.gob.pe/pagina/sf/servicios/papeletas' },
    { title: 'SAT CHACHAPOYAS MULTAS', link: 'https://app.munichachapoyas.gob.pe/servicios/consulta_papeletas/app/papeletas.php' },
    { title: 'SAT ICA MULTAS', link: 'https://m.satica.gob.pe/index.html' },
    { title: 'SAT ANDAHUAYLAS MULTAS', link: 'https://muniandahuaylas.gob.pe/consultar-papeleta/' },
    { title: 'SAT HUANCAYO', link: 'http://sathuancayo.fortiddns.com:888/VentanillaVirtual/ConsultaPIT.aspx' },
    { title: 'SAT AREQUIPA', link: 'https://www.muniarequipa.gob.pe/muni-virtual-4/' },
    { title: 'SAT CAJAMARCA', link: 'https://www.satcajamarca.gob.pe/#/consultas' },
    { title: 'SAT TRUJILLO', link: 'https://digital.satt.gob.pe/pagos/account/login' },
    { title: 'SAT TARAPOTO', link: 'https://www.sat-t.gob.pe/#consulta-papeletas' },
    { title: 'SAT HUANUCO', link: 'https://www.munihuanuco.gob.pe/wp-content/servicios/transportes/gt_papeletas.php' },
    { title: 'SAT PUCALLPA', link: 'http://servicios.municportillo.gob.pe:85/consultaVehiculo/consulta/' },
    { title: 'SAT CUSCO', link: 'https://cusco.gob.pe/informatica/infracciones' }
  ];

  return (
    <div className="manual-filter">
      <Navbar titleTo="/new-search" user={user} />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <h1 className="hero-title">PLATAFORMA</h1>
          <h1 className="hero-title">PARA FILTRAR PLACAS</h1>
        </div>
      </section>

      {/* Free Access Section */}
      <section className="access-section">
        <div className="access-container">
          <h2 className="section-title">ACCESOS GRATUITOS</h2>
          
          <div className="services-grid">
            {services.map((service, index) => (
              <a 
                key={index} 
                href={service.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="service-card"
              >
                <div className="service-image">
                  {service.textOnly ? (
                    <div className="service-text-only">{service.displayText}</div>
                  ) : (
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className={service.whiteFilter ? 'white-filter' : ''}
                    />
                  )}
                </div>
                <h3 className="service-title">{service.title}</h3>
                {service.subtitle && (
                  <p className="service-subtitle">{service.subtitle}</p>
                )}
                {service.description && (
                  <p className="service-description">{service.description}</p>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      {/* <section className="notice-section">
        <div className="notice-container">
          <p className="notice-text">
            MUY IMPORTANTE: EN CASO DE ALGUNA DUDA, VER LOS TUTORIALES EN LA PARTE DE ABAJO POR FAVOR
          </p>
        </div>
      </section> */}

      {/* Plate Origin Verification */}
      <section className="verification-section">
        <div className="verification-container">
          <h2 className="section-title">VERIFICA DE QUE CIUDAD ES TU PLACA</h2>
          <a 
            href="https://aap.org.pe/placas/tipos/ordinarias/oficinas-registrales/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="verification-link"
          >
            <div className="verification-image">
              <img src="https://lh3.googleusercontent.com/sitesv/AAzXCkfP_Pu2wOrsjL7v2Uo1kz2Ayf_MK_TOaDB0RCUEQcqLw0aOf7SMWF4qQCHrZffx2dIeAd8F7QV4fI866KeK6EoK9k1ow9kqeZ78TAsb-fc-oqFM_JrTfBh5zHVoVGJojCqSPsMqrGnVWUa0tBm3_7PR3FdiCjpI8YQQvTjZq2ijBl5bFPp-F_hYdViB0TkhXic0Fvlm-Ori93ewQvXgSvQ-QpMK9-oo3VeK=w1280" alt="Verificación de placas" />
            </div>
          </a>
          <p className="verification-description">INGRESA A LA IMAGEN</p>
        </div>
      </section>

      {/* Paid Services Section */}
      {/* <section className="paid-services-section">
        <div className="paid-services-container">
          <h2 className="section-title">SERVICIOS Y TRÁMITES PAGADOS</h2>
          
          <div className="services-grid">
            {paidServices.map((service, index) => (
              <a 
                key={index} 
                href={service.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="service-card"
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <h3 className="service-title">{service.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section> */}

      {/* Province Fines Section */}
      <section className="province-section">
        <div className="province-container">
          <h2 className="section-title">CONSULTA MULTAS DE PROVINCIAS GRATIS</h2>
          
          <div className="province-grid">
            {provinceServices.map((service, index) => (
              <a 
                key={index} 
                href={service.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="province-card"
              >
                <h3 className="province-title">{service.title}</h3>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      {/* <section className="tutorials-section">
        <div className="tutorials-container">
          <h2 className="section-title">TUTORIALES</h2>
          
          <div className="tutorials-grid">
            <a 
              href="https://www.youtube.com/watch?v=8l_LO1hxUa8" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tutorial-card"
            >
              <div className="tutorial-image">
                <img src="https://lh3.googleusercontent.com/sitesv/AAzXCkfN6batgCXEzVFJ1WEYK-P0tZpsw6pWJgbqahwqoPe3a11p9CeC52tO1zP5ZXzsB9eUrq_juteCHS0lpXyQl6o2O2rIZ0Xs-aR7FX_lLltCHOaTV6CF-BQn__6NKYK0-3tfb11Z-HbSstL3nfiVgmSERKVUCTCEveoLaWQN1luMsWIlmmSn5lqkHoWG6BmlbTckPXSIdsnzR3EUQ3KaTOBbdBrvzX5Vim66Vu4=w1280" alt="Tutorial SUNARP" />
              </div>
              <h3 className="tutorial-title">COMO CREAR TU CUENTA EXTRANET SUNARP</h3>
            </a>
            
            <a 
              href="https://www.youtube.com/watch?v=MX2ykZbwsJ0&t=63s" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="tutorial-card"
            >
              <div className="tutorial-image">
                <img src="https://lh3.googleusercontent.com/sitesv/AAzXCkeNaHHOH5gVAq7jl0h__wTQC9yCd56opc71SeqsxRxVTYP71jDw9eHGyVseIm0y-mCZsKV5cVEM1S_7FzIUJaf-CASpNOfkNWePLbXm9kbDmv2eruia4hmSrR9cs8jlQwesLT5GgvN2eN9P8ZJ0UTWCpxt72JM0xuxfRrMcW8XzrmXEkSjYHI_d8RjDmcxk3c7eOrjjgfrWzOT_vcEvJUSoAZBos_YCQuks=w1280" alt="Tutorial historial" />
              </div>
              <h3 className="tutorial-title">COMO VER HISTORIAL DE DUEÑOS</h3>
            </a>
          </div>
        </div>
        
      </section> */}

      {/* Footer */}
      {/* <footer className="manual-footer">
        <div className="footer-container">
          <p className="footer-text">
            SOMOS ESPECIALISTAS EN EL RUBRO CON MAS DE 10 AÑOS DE EXPERIENCIA
          </p>
          <p className="footer-copyright">
            COPYRIGHT © 2025 SUBASTAS VEHICULARES PERU - ESTUDIO SALINAS ALVAREZ - TODOS LOS DERECHOS RESERVADOS.
          </p>
        </div>
      </footer> */}
    </div>
  );
}

export default ManualFilter;
