import React, { useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { Box, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import DialogSendComment from "./component/DialogSendComment";
import { useNavigate } from "react-router-dom";


const URLSTAFF =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

const BaristarComment = () => {
  const user = useFoodBankStorage((s) => s.user);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

    const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          zIndex: 1000,
        }}
      >
        <Box
          sx={{
            top: 20,
            left: 20,
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 1000,
          }}
        >
          <img
            src={`${URLSTAFF}/${user?.image}`}
            alt="User Avatar"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography
              sx={{
                fontFamily: "Noto Sans Lao",
                fontSize: 18,
                color: "#ffffffaf",
                fontWeight: 500,
              }}
            >
              {user?.branchName}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Noto Sans Lao",
                fontSize: 12,
                color: "#f7f7f7a1",
              }}
            >
              {user?.firstname} {user?.lastname}
            </Typography>
          </Box>
        </Box>{" "}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <CircularProgress
              size={60}
              thickness={5}
              sx={{
                color: "#00b0ff", // bright cyan blue, visible in dark
              }}
            />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mt: 4,
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 25 }}>
                ແຈ້ງເບເກີລີ້ຜິດປົກກະຕິ
              </Typography>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                  mt: 2,
                  height:"100%",
                  minHeight: 300
                }}
                component="nav"
                aria-labelledby="nested-list-subheader"
              >
                <ListItemButton  onClick={() => setOpenDialog(true)}>
                  <ListItemIcon>
                    <SendIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="ແຈ້ງລາຍລະອຽດເບເກີລີ້ຜິດປົກກະຕິ"
                    primaryTypographyProps={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
                <ListItemButton onClick={() => navigate("/baristar/hisoryreport")}>
                  <ListItemIcon>
                    <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="ເບີ່ງປະຫວັດການແຈ້ງທີ່ຜ່ານມາຂອງສາຂາ"
                    primaryTypographyProps={{
                      fontFamily: "Noto Sans Lao",
                      fontSize: 16,
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </List>
            </Box>
          </>
        )}
      </Box>
      <DialogSendComment
        setOpenDialog={setOpenDialog}
        openDialog={openDialog}
      />
    </>
  );
};

export default BaristarComment;
