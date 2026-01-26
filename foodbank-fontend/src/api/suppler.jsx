import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const createSupplyer = (form, token) => {
  return axios.post(`${URL}/createsuppler`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllSupplyer = (token) => {
  return axios.get(`${URL}/getallsupplyer`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}