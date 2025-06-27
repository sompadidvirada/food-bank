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
