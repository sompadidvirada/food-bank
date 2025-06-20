import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

export const getAllStaffInfo = (token) => {
  return axios.get(`${URL}/getstaffsinfo`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateBranchStaffInfo = (token, branchId, id) => {
  return axios.put(
    `${URL}/updatestaff/${id}`,
    {
      branchId: branchId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateStatusStaff = (id, status, token) => {
  return axios.put(`${URL}/updatestatusstaff/${id}`, {
    status: status
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}