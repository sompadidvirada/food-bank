import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getAllProduct = (token) => {
  return axios.get(`${URL}/getallproduct`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStatusProduct = (id, form, token) => {
  return axios.put(`${URL}/updateaviable/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
