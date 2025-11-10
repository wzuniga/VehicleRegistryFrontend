import api from './api';

/**
 * Servicio para manejar operaciones relacionadas con placas de vehículos
 */
const carPlateService = {
  /**
   * Agregar una nueva placa pendiente
   * @param {string} plate - Número de placa a agregar
   * @returns {Promise} - Promesa con la respuesta del servidor
   */
  addPendingCarPlate: async (plate) => {
    try {
      const response = await api.post('/pending-car-plates', { plate });
      return {
        success: true,
        data: response.data,
        message: 'Placa agregada exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al agregar la placa',
        statusCode: error.response?.status
      };
    }
  },

  /**
   * Obtener todas las placas pendientes
   * @returns {Promise} - Promesa con la lista de placas
   */
  getPendingCarPlates: async () => {
    try {
      const response = await api.get('/pending-car-plates');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener las placas'
      };
    }
  }
};

export default carPlateService;
