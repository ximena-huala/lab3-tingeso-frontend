import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/karts`;


export const getAllKarts = () => axios.get(API_URL);
export const createKart = (kart) => axios.post(API_URL, kart);
export const updateKart = (id, kart) => axios.put(`${API_URL}/${id}`, kart);
export const deleteKart = (id) => axios.delete(`${API_URL}/${id}`);
