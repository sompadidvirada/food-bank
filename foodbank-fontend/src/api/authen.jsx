import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const Login = (form) => {
  return axios.post(`${URL}/login`, form);
};

export const currectAdmin = (token) => {
  return axios.post(
    `${URL}/current-admin`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const currentUser = (token) => {
  return axios.post(
    `${URL}/current-user`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const createStaff = (form, token) => {
  return axios.post(`${URL}/createstaff`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteStaff = (form, token) => {
  return axios.post(`${URL}/deletestaff`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const clearPasswordStaff = (id, token) => {
  return axios.put(
    `${URL}/clearpassword/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const createNewpassword = (form) => {
  return axios.put(`${URL}/ceatenewpassword`, form);
};
