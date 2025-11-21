import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getBaristarProfile = (form, token) => {
  return axios.post(`${URL}/profliebaristar`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderBaristar = (form, token) => {
  return axios.post(`${URL}/getorderbaristar`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const sendReportBaristar = (form, token) => {
  return axios.post(`${URL}/reportbaristar`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReportBaristar = (form, token) => {
  return axios.post(`${URL}/getreportbaristar`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllReports = (form, token) => {
  return axios.post(`${URL}/getallreport`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getReportById = (id, token) => {
    return axios.get(`${URL}/getreportbyid/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateReadReport = (form, token) => {
  return axios.post(`${URL}/updatereportreadbystaff`, form, {
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteReport = (id, token) =>{
  return axios.delete(`${URL}/deletereport/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}