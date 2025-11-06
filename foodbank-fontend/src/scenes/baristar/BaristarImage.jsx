import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CalendarBaristar from "./component/CalendarBaristar";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import UploadImageBaristar from "./component/UploadImageBaristar";
import { toast } from "react-toastify";
import { checkImages } from "../../api/tracking";
import dayjs from "dayjs";

const BaristarImage = () => {
  const user = useFoodBankStorage((s) => s.user);
  const token = useFoodBankStorage((s) => s.token);
  const [checkImage, setCheckImage] = useState([]);
  const [selectFormtracksell, setSelectFormtracksell] = useState({
    sellAt: "",
    userId: user.id,
    brachId: user?.userBranch,
  });

  useEffect(() => {
    const handleTouchMove = (event) => {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    };

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const fecthImage = async () => {
    try {
      const imageTrackCheck = await checkImages(
        {
          sellDate: selectFormtracksell.sellAt,
          brachId: selectFormtracksell.brachId,
        },
        token
      );
      setCheckImage(imageTrackCheck.data);
    } catch (err) {
      console.log(err);
      toast.error("something went wrong.");
    }
  };

  useEffect(() => {
    if (selectFormtracksell?.sellAt) {
      fecthImage();
    }
  }, [token, selectFormtracksell]);

  return (
    <>
      {user?.userBranch === null ? (
        <Typography sx={{ fontFamily: "Noto Sans Lao" }}>
          ຢູ່ເຊີນີ້ຍັງບໍ່ມີສາຂາ ກະລຸນາຕິດຕໍ່ພະແນກຈັດຊຶ້ TREEKOFF
          ເພື່ອເພີ່ມສາຂາໃຫ້ຢູ່ເຊີ
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <img
              src="/TK.png"
              alt="Logo"
              style={{
                height: 120,
                display: "block",
                margin: "2px auto",
              }}
            />
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{ fontFamily: "Noto Sans Lao", py: 2, fontSize: 20 }}
            >
              ຮູບເບເກີລີ້ສາຂາ {user.branchName} ຂອງວັນທີ{" "}
              {selectFormtracksell?.sellAt
                ? dayjs(selectFormtracksell.sellAt).format("DD/MM/YYYY")
                : ""}
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <CalendarBaristar setSelectFormtracksell={setSelectFormtracksell} />
          </Box>
          <Box sx={{ my: 2, width: "100%", height: "100%" }}>
            <Paper sx={{ color: "white" }}>
              <UploadImageBaristar
                selectFormtracksell={selectFormtracksell}
                checkImage={checkImage}
                setCheckImage={setCheckImage}
              />
            </Paper>
          </Box>
        </Box>
      )}
    </>
  );
};

export default BaristarImage;
