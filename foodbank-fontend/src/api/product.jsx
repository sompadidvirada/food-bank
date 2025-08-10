import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getAllProduct = () => {
  return axios.get(`${URL}/getallproduct`);
};

export const updateStatusProduct = (id, form, token) => {
  return axios.put(`${URL}/updateaviable/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCategorys = (token) => {
  return axios.get(`${URL}/getcategory`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProduct = (id, form, token) => {
  return axios.put(`${URL}/updateproduct/` + id, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProduct = (id, token) => {
  return axios.delete(`${URL}/deleteproduct/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createProduct = (form, token) => {
  return axios.post(`${URL}/createproduct`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
