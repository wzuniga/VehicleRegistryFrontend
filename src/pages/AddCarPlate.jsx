import { useState } from 'react';
import { Input, Button } from '../components/ui';
import carPlateService from '../services/carPlateService';
import './AddCarPlate.css';

const AddCarPlate = () => {
  const [plate, setPlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Validación de placa
  const validatePlate = (value) => {
    if (!value.trim()) {
      return 'La placa es requerida';
    }
    if (value.length < 3) {
      return 'La placa debe tener al menos 3 caracteres';
    }
    return '';
  };

  // Manejar cambio en el input
  const handlePlateChange = (e) => {
    const value = e.target.value.toUpperCase(); // Convertir a mayúsculas
    setPlate(value);
    setError('');
    setSuccessMessage('');
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar placa
    const validationError = validatePlate(plate);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const result = await carPlateService.addPendingCarPlate(plate);

      if (result.success) {
        setSuccessMessage(result.message);
        setPlate(''); // Limpiar el input después de agregar
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Error inesperado al agregar la placa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-car-plate-container">
      <div className="add-car-plate-card">
        <h1 className="add-car-plate-title">Agregar Placa</h1>
        <p className="add-car-plate-description">
          Ingrese el número de placa del vehículo
        </p>

        <form onSubmit={handleSubmit} className="add-car-plate-form">
          <Input
            label="Número de Placa"
            value={plate}
            onChange={handlePlateChange}
            placeholder="Ej: BNP276"
            error={error}
            disabled={loading}
            maxLength={10}
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
            className="submit-button"
          >
            Agregar
          </Button>

          {successMessage && (
            <div className="success-message">
              <svg
                className="success-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddCarPlate;
