import axios from "axios"
const URL = import.meta.env.VITE_API_URL;

export const createCategory = (form, token) => {
    return axios.post(`${URL}/createcategory`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const deleteCategory = (id, token) => {
    return axios.delete(`${URL}/deletecategory/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}