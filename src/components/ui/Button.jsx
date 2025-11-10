import './Button.css';

/**
 * Button component reutilizable
 * @param {string} children - Contenido del botón
 * @param {function} onClick - Función para manejar el click
 * @param {string} variant - Variante del botón (primary, secondary, danger)
 * @param {boolean} disabled - Estado deshabilitado
 * @param {boolean} loading - Estado de carga
 * @param {string} type - Tipo de botón
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`button button-${variant} ${loading ? 'button-loading' : ''} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="button-spinner"></span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
