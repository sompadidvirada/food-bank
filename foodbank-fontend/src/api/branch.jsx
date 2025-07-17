import axios from "axios"
const URL = import.meta.env.VITE_API_URL;

export const getAllBranch = (token) => {
    return axios.get(`${URL}/getallbranch`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const updateBranchLocation = (id, form, token) => {
    return axios.put(`${URL}/updatebranchlocation/${id}`,
        form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const CreateBranch = (form, token) => {
    return axios.post(`${URL}/createbranch`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const updateProvince = (form, token) => {
    return axios.put(`${URL}/updateprovince`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}