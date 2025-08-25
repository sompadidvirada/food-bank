import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const checkCoffeeSell = (form, token) => {
    return axios.post(`${URL}/checkcoffeesell`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const updateCoffeeSell = (id, form, token) => {
    return axios.put(`${URL}/updatecoffeesell/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const insertCoffeeSell = (form, token) => {
    return axios.post(`${URL}/insertcoffeesell`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteAllCoffeeSell = (form, token) => {
    return axios.post(`${URL}/deletecoffeesellbydate`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

