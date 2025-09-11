import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const checkTrackOrder = (form, token) => {
  return axios.post(`${URL}/getpreviosorder`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const insertOrder = (form, token) => {
  return axios.post(`${URL}/orderinsert`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOrderTrack = (form) => {
  return axios.post(`${URL}/checkorder`, form);
};

export const deleteOrderTrack = (form, token) => {
  return axios.post(`${URL}/deleteordertrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderTrack = (id, form, token) => {
  return axios.put(`${URL}/updateorder/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateOrderNeed = (id, form) => {
  return axios.put(`${URL}/updateorderwant/${id}`, form);
};

export const checkConfirmOrderBranch = (form) => {
  return axios.post(`${URL}/checkconfirmperbranch`, form);
};

export const confirmOrderBranch = (form) => {
  return axios.post(`${URL}/confirmorder`, form);
};
export const checkConfirmOrderAll = (form, token) => {
  return axios.post(`${URL}/checkconfirmall`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const chanheStatusOrder = (id, form, token) => {
  return axios.put(`${URL}/changestatusconfirm/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllOrderTrack = (form, token) => {
  return axios.post(`${URL}/getallordertrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const confirmOrderChange = (id,form, token) => {
  return axios.put(`${URL}/confirmorderchange/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
} 

export const getPreviousOrderTrack = (form, token) => {
  return axios.post(`${URL}/getpevoiusordertrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
