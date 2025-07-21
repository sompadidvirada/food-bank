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
  return axios.put(
    `${URL}/updatestatusstaff/${id}`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
export const updateRoleStaff = (id, role, token) => {
  return axios.put(
    `${URL}/updaterolestaff/${id}`,
    {
      role: role,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateMainSt = (id, form, token) => {
  return axios.put(`${URL}/updateuser/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
}

export const uploadImageS3 = (imageName, contentType, token) => {
  return axios.post(
    `${URL}/upload-s3`, // ← use POST and a generic endpoint
    {
      imageName,
      contentType,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

