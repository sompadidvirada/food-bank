import axios from "axios"
const URL = import.meta.env.VITE_API_URL;

export const getAllBranch = (token) => {
    return axios.get(`${URL}/getallbranch`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}