import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getBarChartSell = (form, token) => {
  return axios.post(`${URL}/barsell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getBarChartSend = (form, token) => {
  return axios.post(`${URL}/barsend`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getBarChartExp = (form, token) => {
  return axios.post(`${URL}/barexp`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
