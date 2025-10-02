import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Editprofile from "./component/Editprofile";
import MapIcon from "@mui/icons-material/Map";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ImageModal from "../../component/ImageModal";

const URL =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

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

const SideBarUser = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const user = useFoodBankStorage((state) => state.user);

  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
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
              margin: "10px 0 0 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box display="flex" alignItems="center" ml="15px">
                <img
                  src="/TK.png"
                  alt="Logo"
                  style={{
                    height: 100,
                    display: "block",
                    margin: "5px auto",
                  }}
                />
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  onClick={() =>
                    handleImageClick(
                      `${URL}/${user?.image || "default-user.png"}`
                    )
                  }
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`${URL}/${user?.image || `default-user.png`}`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
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
                <Typography
                  variant="h5"
                  color={colors.greenAccent[500]}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {user?.role} <Editprofile />
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ຈັດການພາຍໃນບໍລິສັດ
            </Typography>

            <Item
              title="ແຜນທີສາຂາ"
              to="/user"
              icon={<MapIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຈັດການສິນຄ້າ"
              to="/user/product"
              icon={<FastfoodIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ແຜນສັ່ງຊື້"
              to="/user/calendar"
              icon={<EditCalendarIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຈັດການອໍເດີສາຂາ"
              to="/user/allorder"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ຈັດການຕິດຕາມສິນຄ້າ
            </Typography>

            <Item
              title="ຄີຍອດຈັດສົ່ງ"
              to="/user/tracksend"
              icon={<LocalShippingIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດຂາຍ"
              to="/user/tracksell"
              icon={<AttachMoneyIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດໝົດອາຍຸ"
              to="/user/trackexp"
              icon={<DeleteForeverIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ລາຍລະອຽດການຕິດຕາມ
            </Typography>
            <Item
              title="ລາຍງານຍອດຂາຍລາຍສາຂາ"
              to="/user/reportperbranch"
              icon={<SpeakerNotesIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ລາຍງານຍອດຂາຍທັງໝົດ"
              to="/user/reportall"
              icon={<ChecklistIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ຈັດການເບີກວັດຖຸດິບ
            </Typography>
            <Item
              title="ຈັດການວັດຖຸດິບ"
              to="/user/rawmaterial"
              icon={<ChecklistIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດເບີກວັດຖຸດິບ"
              to="/user/insertstockrequisition"
              icon={<ChecklistIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ລາຍງານຍອດເບີກວັດຖຸດິບ"
              to="/user/stockrequisitionreport"
              icon={<ChecklistIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>

      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default SideBarUser;
