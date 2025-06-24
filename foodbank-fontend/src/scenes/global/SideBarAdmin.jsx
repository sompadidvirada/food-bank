import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Dialog, DialogContent, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Editprofile from "./component/Editprofile";
const URL = import.meta.env.VITE_API_URL;

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography fontFamily={"Noto Sans Lao"}>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const SideBarAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const user = useFoodBankStorage((state)=>state.user)
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);


  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };
  // Function to close the image modal
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };
  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                 FOODBANK
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                onClick={()=>handleImageClick(`${URL}/staffimage/${user?.image || "public/staff_porfile/default-image.JPG"}`)}
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`${URL}/staffimage/${user?.image || "public/staff_porfile/default-image.JPG"}`}
                  style={{ cursor: "pointer", borderRadius: "50%", objectFit: "cover" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user?.firstname} {user?.lastname}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {user?.role} <Editprofile />
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              
              title="ພາບລວມບໍລິສັດທັງຫມົດ"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily:"Noto Sans Lao" }}
            >
              ບຸກຂະລາກອນ
            </Typography>
            <Item
              title="ຈັດການພະນັກງານ"
              to="/admin/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily:"Noto Sans Lao" }}
            >
              ຈັດການພາຍໃນບໍລິສັດ
            </Typography>

            <Item
              title="ແຜນທີ"
              to="/admin/map"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>

            {/** image modal */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", padding: "0" }}>
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
          {selectedImageUrl && (
            <img
              src={selectedImageUrl || "nigler.png"}
              alt="Large Preview"
              style={{
                width: "100%",
                height: "800px",
                maxHeight: "90vh",
                overflow: "hidden",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SideBarAdmin;
