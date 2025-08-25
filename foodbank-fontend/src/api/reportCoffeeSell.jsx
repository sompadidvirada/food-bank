import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getReportCoffeeSell = async (form, token) => {
  return axios.post(`${URL}/coffeeingredientusereport`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCoffeeIngredientUseByMaterialId = (form, token) => {
  return axios.post(`${URL}/getingredientusecompare`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}