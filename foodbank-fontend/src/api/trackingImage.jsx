import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getImageAllBranch = (form, token) => {
  return axios.post(`${URL}/getimageallbranch`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
