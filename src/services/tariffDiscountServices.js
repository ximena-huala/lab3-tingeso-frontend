import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/tariff-discounts`;


export const getAllTariffDiscounts = () => axios.get(API_URL);
export const createTariffDiscount = (tariffDiscount) => axios.post(API_URL, tariffDiscount);
export const updateTariffDiscount = (id, tariffDiscount) => axios.put(`${API_URL}/${id}`, tariffDiscount);
export const deleteTariffDiscount = (id) => axios.delete(`${API_URL}/${id}`);

