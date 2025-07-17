import axios from "axios"
const URL = import.meta.env.VITE_API_URL;

export const getLineChart = (date, token) => {
    return axios.post(`${URL}/linechart`, date, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}