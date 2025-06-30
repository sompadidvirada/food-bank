import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getPieChartSell = (form, token) => {
    return axios.post(`${URL}/getpiechartsell`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const getPieChartSend = (form, token) => {
    return axios.post(`${URL}/getpiechartsend`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getPieChartExp = (form, token) => {
    return axios.post(`${URL}/getpiechartexp`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}