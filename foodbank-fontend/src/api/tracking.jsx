import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const checkTrackSell = (form, token) => {
  return axios.post(`${URL}/checktracksell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
