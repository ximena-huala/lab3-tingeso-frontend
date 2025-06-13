import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/reports`;


export const fetchTrackTimeReport = (year, startMonth, endMonth) => {
  return axios.get(`${API_URL}/by-track-time`, {
    params: { year, startMonth, endMonth }
  });
};

export const fetchGroupSizeReport = (year, startMonth, endMonth) => {
  return axios.get(`${API_URL}/by-group-size`, {
    params: { year, startMonth, endMonth }
  });
};
