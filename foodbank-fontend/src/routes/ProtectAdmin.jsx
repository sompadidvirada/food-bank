import React from "react";
import { useState } from "react";
import useFoodBankStorage from "../zustand/foodbank-storage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { currectAdmin } from "../api/authen";

const ProtectAdmin = ({ element }) => {
  const [ok, setOk] = useState(null);
  const user = useFoodBankStorage((state) => state.user);
  const token = useFoodBankStorage((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      currectAdmin(token)
        .then(() => setOk(true))
        .catch((err) => {
          console.log(err);
          setOk(false);
        });
    } else {
      setOk(false);
    }
  }, [user, token]);

  //Redirect if not Allow

  useEffect(() => {
    if (ok === false) {
      navigate("/");
    }
  }, [ok, navigate]);

  if (ok === null) return null;

  return element;
};

export default ProtectAdmin;
