import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const createCoffeeMenu = (form, token) => {
  return axios.post(`${URL}/createcoffeemenu`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCoffeeMenu = (token) => {
  return axios.get(`${URL}/createcoffeemenu`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUrlUploadCoffeeMenu = (form, token) => {
  return axios.post(`${URL}/uploadimagecoffeemenu`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCoffeeMenu = (id, token) => {
  return axios.delete(`${URL}/deletecoffeemenu/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCoffeeMenu = (id, form, token) => {
  return axios.put(`${URL}/updatecoffeemenu/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCoffeeMenuIngredientByMenuId = (id, token) => {
  return axios.get(`${URL}/getcoffeemenuingredient/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateIngredientCoffeeMenu = (id, form, token) =>{
  return axios.put(`${URL}/updatecoffeemenuingredient/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
} 

export const deleteMenuIngredient = (id, token) => {
  return axios.delete(`${URL}/deletecoffeemenuingredient/${id}`, {
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}

export const getMateriantVariantChildOnly = (token) => {
  return axios.get(`${URL}/getmarialvarinatchildonly`, {
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}

export const addIngredientCoffeeMenu = (form, token) =>{
return axios.post(`${URL}/createcoffeemenuingredient`, form, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
}

export const getIngredientUseAll = (token) =>{
  return axios.get(`${URL}/getallingredientuse`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
