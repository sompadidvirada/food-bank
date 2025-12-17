import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

// CATEGORY RAW MATERIAL

export const createCategoryRawMaterial = (form, token) => {
  return axios.post(`${URL}/createcategorymaterial`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCategoryRawMaterial = (token) => {
    return axios.get(`${URL}/getcategorymaterial`, {
        headers:{
            Authorization: `Bearer ${token}`
        }
    })
}
export const deleteCategoryRawMetarial = (form,token) => {
    return axios.post(`${URL}/deletecategorymaterial`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

// RAWMATERIAL

export const addRawMaterial = (form, token) => {
    return axios.post(`${URL}/createrawmaterial`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getAllRawMaterial = (token) => {
    return axios.get(`${URL}/getallrawmaterial`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getUrlUpload = (form, token) => {
    return axios.post(`${URL}/uploadimagerawmaterial`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getMaterialVariantFromId = (id, token) => {
    return axios.get(`${URL}/getmetarialvariantfromid/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const updateRawMaterial = (id, form, token) => {
    return axios.put(`${URL}/updaterawmaterial/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeRawMaterial = (id, token) => {
    return axios.delete(`${URL}/deleterawmaterial/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const createMaterialVariant = (form, token) => {
    return axios.post(`${URL}/createRawmaterialVariant/`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteMaterialVariant = (id, token) => {
    return axios.delete(`${URL}/deletematerialvariant/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
export const updateMaterialVariant = (id, form, token) => {
    return axios.put(`${URL}/updatematerialvariant/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getRawMaterialVariantToInsert = (token) => {
    return axios.get(`${URL}/getRawMaterialVariant`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getStockRequisitionByDate = (form, token) => {
    return axios.post(`${URL}/getstockrequisitionbydate`, form , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const insertStockRequisition = (form, token) => {
    return axios.post(`${URL}/insertStockRequition`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateStockRequisition = (id, form, token) => {
    return axios.put(`${URL}/updatestockrequisition/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteAllStockrequisitionByDate = (form, token) => {
    return axios.post(`${URL}/deleteallstockrequisitionusedate`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const getAllStockrequisition = (form, token) => {
    return axios.post(`${URL}/getstockrequisitionall`, form , {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const exchangeRateCalcurate = (form, token) => {
    return axios.post(`${URL}/exchangeratecalcu`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteStockRequi = (id, token) => {
    return axios.delete(`${URL}/deletestockrequisition/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}