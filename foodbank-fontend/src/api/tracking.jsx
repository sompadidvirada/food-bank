import axios from "axios";
const URL = import.meta.env.VITE_API_URL;

{
  /** check tracking  */
}

export const checkTrackSell = (form, token) => {
  return axios.post(`${URL}/checktracksell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const checkTrackSend = (form, token) => {
  return axios.post(`${URL}/checktracksend`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const checkTrackExp = (form, token) => {
  return axios.post(`${URL}/checktrackexp`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

{
  /** insert tracking */
}

export const insertTracksell = (form, token) => {
  return axios.post(`${URL}/inserttracksell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const insertTracksend = (form, token) => {
  return axios.post(`${URL}/inserttracksend`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const insertTrackExp = (form, token) => {
  return axios.post(`${URL}/inserttrackexp`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

{
  /** delete tracking  */
}

export const deleteTrackSell = (form, token) => {
  return axios.post(`${URL}/deletealltracksell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTrackSend = (form, token) => {
  return axios.post(`${URL}/deletealltracksend`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const deleteTrackExp = (form, token) => {
  return axios.post(`${URL}/deletealltrackexp`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

{
  /** update tracking  */
}

export const updateTrackSell = (form, token) => {
  return axios.post(`${URL}/updatetracksell`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTrackSend = (form, token) => {
  return axios.post(`${URL}/updatetracksend`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTrackExp = (form, token) => {
  return axios.post(`${URL}/updatetrackexp`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// upload image tracking 

export const uploadImageTrack = (form, token) => {
  return axios.post(`${URL}/uploadimagetrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const checkImages = (form, token) => {
  return axios.post(`${URL}/getimagetrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const deleteImages = (form, token) => {
  return axios.post(`${URL}/deleteimagestrack`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const getImagesTrack = (form, token) => {
  return axios.post(`${URL}/getimagetracking`, form, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}
