import axios from "axios";
const URL = import.meta.env.VITE_API_URL;


export const getBaristarProfile = (form, token)=> {
    return axios.post(`${URL}/profliebaristar`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getOrderBaristar = (form, token) => {
    return axios.post(`${URL}/getorderbaristar`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    } )
}