import axios from "axios"
const URL = import.meta.env.VITE_API_URL;

export const fecthDataDashborad = (date, token) => {
  return axios.post(`${URL}/feashdashborad`, date, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};