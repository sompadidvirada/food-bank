import axios from "axios"
const URL = import.meta.env.VITE_API_URL;


export const createCalendar = (form) => {
  return axios.post(`${URL}/createcalendar`, form);
};
export const getCalendar = (id) => {
  return axios.get(`${URL}/getcalendar/${id}`);
};

export const updateCalendar = (id, form) => {
  return axios.put(
    `${URL}/updatecalendar/${id}`,
    form
  );
};

export const deleteCalendar = (id) => {
  return axios.delete(`${URL}/deletecalendar/${id}`);
};

export const getCalendarAdmin = () => {
  return axios.get(`${URL}/getcalendaradmin`);
};

export const updateSuccessPo = (id, status) => {
  return axios.put(`${URL}/updatesuccesspo/${id}`, {
    status: status,
  });
};

export const detailUpdate = (id, form) => {
  return axios.put(`${URL}/detailupdate/${id}`, form);
};
