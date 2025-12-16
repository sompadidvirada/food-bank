import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getStockRemain = (token) => {
  return axios.get(`${URL}/getstockremain`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStockRemain = (form, token) => {
  return axios.post(`${URL}/createstockremain`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteStockRemain = (token) => {
  return axios.post(`${URL}/deletestockremain`, {}, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}