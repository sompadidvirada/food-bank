import React, { useRef } from "react";
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
import { useState } from "react";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Editprofile from "./component/Editprofile";
import MapIcon from "@mui/icons-material/Map";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import BarChartIcon from "@mui/icons-material/BarChart";
import ArticleIcon from "@mui/icons-material/Article";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CoffeeIcon from "@mui/icons-material/Coffee";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GradeIcon from "@mui/icons-material/Grade";
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

const SideBarAdmin = () => {
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
          color: "#34bd36ff !important",
        },
        "& .pro-menu-item.active": {
          color: "#34bd36ff !important",
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
                      `${URL}/${
                        user?.image || "public/staff_porfile/default-image.JPG"
                      }`
                    )
                  }
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`${URL}/${
                    user?.image || "public/staff_porfile/default-image.JPG"
                  }`}
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
            <Item
              title="ພາບລວມບໍລິສັດທັງຫມົດ"
              to="/admin"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຈັດການໃບສັ່ງຊຶ້"
              to="/admin/order"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຈັດການອໍເດີສາຂາ"
              to="/admin/allorder"
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
              ຈັດການວັດຖຸດິບ
            </Typography>
            <Item
              title="ຈັດການວັດຖຸດິບ"
              to="/admin/rawmaterial"
              icon={<ManageSearchIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດເບີກວັດຖຸດິບ"
              to="/admin/insertstockrequisition"
              icon={<CoffeeIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ລາຍງານຍອດເບີກວັດຖຸດິບ"
              to="/admin/stockrequisitionreport"
              icon={<ArticleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ຈັດການເມນູ TREEKOFF
            </Typography>
            <Item
              title="ຈັດການເມນູ"
              to="/admin/coffeemenu"
              icon={<ArticleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດຂາຍ TREEKOFF"
              to="/admin/insertcoffeesell"
              icon={<ArticleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title=" REPORT TREEKOFF"
              to="/admin/reporttreekoffuse"
              icon={<ArticleIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
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
              display={isCollapsed ? "none" : "block"}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px", fontFamily: "Noto Sans Lao" }}
            >
              ຈັດການພາຍໃນບໍລິສັດ
            </Typography>

            <Item
              title="ແຜນທີສາຂາ"
              to="/admin/map"
              icon={<MapIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຈັດການສິນຄ້າ"
              to="/admin/product"
              icon={<FastfoodIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ແຜນສັ່ງຊື້"
              to="/admin/calendaradmin"
              icon={<EditCalendarIcon />}
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
              to="/admin/tracksend"
              icon={<LocalShippingIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດຂາຍ"
              to="/admin/tracksell"
              icon={<AttachMoneyIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ຄີຍອດໝົດອາຍຸ"
              to="/admin/trackexp"
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
              to="/admin/reportperbranch"
              icon={<SpeakerNotesIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ລາຍງານຍອດຂາຍທັງໝົດ"
              to="/admin/reportall"
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
              ກາຟລາຍລະອຽດສິນຄ້າ
            </Typography>

            {/**BAR CHART MENU */}
            <SubMenu
              title="Bar Chart"
              icon={<BarChartIcon />}
              style={{ color: colors.grey[100] }}
            >
              <Item
                title="Sell Bar Chart"
                to="/admin/barsell"
                icon={<ChecklistIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Send Bar Chart"
                to="/admin/barsend"
                icon={<AnalyticsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="EXP Bar Chart"
                to="/admin/barexp"
                icon={<LeaderboardIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>

            {/**PIE CHART MENU */}
            <SubMenu
              title="PIE Chart"
              icon={<DonutLargeIcon />}
              style={{ color: colors.grey[100] }}
            >
              <Item
                title="Sell Pie Chart"
                to="/admin/piesell"
                icon={<ChecklistIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Send Pie Chart"
                to="/admin/piesend"
                icon={<AnalyticsIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="EXP Pie Chart"
                to="/admin/pieexp"
                icon={<LeaderboardIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
            <SubMenu
              title="Line Chart"
              icon={<ShowChartIcon />}
              style={{ color: colors.grey[100] }}
            >
              <Item
                title="Line Chart"
                to="/admin/line"
                icon={<ShowChartIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            </SubMenu>
          </Box>
        </Menu>
      </ProSidebar>

      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default SideBarAdmin;
