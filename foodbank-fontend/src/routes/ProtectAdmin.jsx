import { useState } from "react";
import useFoodBankStorage from "../zustand/foodbank-storage";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { currectAdmin } from "../api/authen";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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
      
      useFoodBankStorage.persist.clearStorage();
      navigate("/");
    }
  }, [ok, navigate]);

  return ok === null ? (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  ) : ok === true ? (
    element
  ) : null; // don't render anything for false
};

export default ProtectAdmin;
