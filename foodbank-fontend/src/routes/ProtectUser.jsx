import { useState } from "react";
import useFoodBankStorage from "../zustand/foodbank-storage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { currentUser } from "../api/authen";

const ProtectUser = ({ element }) => {
  const [ok, setOk] = useState(null);
  const user = useFoodBankStorage((state) => state.user);
  const token = useFoodBankStorage((state) => state.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      currentUser(token)
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
      navigate(-1);
    }
  }, [ok, navigate]);

  if (ok === null) return null;

  return element;
};

export default ProtectUser;
