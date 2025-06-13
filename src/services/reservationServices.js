import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/reservations`;


// Crear una reserva
export const createReservation = (reservationData) => {
  return axios.post(API_URL, reservationData);
};

// Obtener todas las reservas
export const getAllReservations = () => {
  return axios.get(API_URL);
};

export const deleteReservation = (id) =>
    axios.delete(`${API_URL}/${id}`);
  
export const getAvailableTimes = (date) =>
    axios.get(`${API_URL}/available-times`, {
      params: { date }
    });