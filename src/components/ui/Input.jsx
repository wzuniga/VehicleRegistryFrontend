import './Input.css';

/**
 * Input component reutilizable
 * @param {string} label - Etiqueta del input
 * @param {string} value - Valor del input
 * @param {function} onChange - Función para manejar cambios
 * @param {string} placeholder - Placeholder del input
 * @param {string} type - Tipo de input
 * @param {string} error - Mensaje de error
 * @param {object} rest - Otros props del input
 */
const Input = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  error = '',
  className = '',
  ...rest
}) => {
  return (
    <div className={`input-container ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...rest}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};

export default Input;
