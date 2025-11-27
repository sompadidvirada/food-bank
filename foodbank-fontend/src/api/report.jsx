import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const fecthReportPerBranch = (form, token) => {
  return axios.post(`${URL}/reportperbranch`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fecthReportAll = (form, token) => {
  return axios.post(`${URL}/reportall`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fecthReportTreekoff = (form, token) => {
  return axios.post(`${URL}/reporttreekoffdashborad`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getReportTreekoff = (form, token) => {
  return axios.post(`${URL}/reporttotaltreekoff`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getMenuSellByName = (form, token) => {
  return axios.post(`${URL}/getcoffeesellbyname`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}