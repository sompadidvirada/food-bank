import { Backdrop, Box, Chip, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import StatusBox from "../component/StatusBox";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import ProgressCircle from "../component/ProgressCircle";
import BarChart from "../../component/BarChartSell";
import SsidChartIcon from "@mui/icons-material/SsidChart";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PieChart from "../../component/PieChart";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { useEffect } from "react";
import { fecthDataDashborad } from "../../api/dashborad";
import Calendar from "../../component/Calendar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CircularProgress from "@mui/material/CircularProgress";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Checkboxs from "./checkbox/Checkbox";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [selectBranchs, setSelectBranchs] = useState([]);
  const [selectBranchName, setSelectBranchName] = useState([]);
  const [totalSell, setTotalSell] = useState(null);
  const { getProduct, getBrnachs, getCategory, token, queryForm, branchs } =
    useFoodBankStorage();

  const getPercentFromPreviose = (current, last) => {
    const diffPercent = Math.abs((current - last) / last) * 100;

    const increase =
      current > last
        ? {
            text: `▲ ${diffPercent.toFixed(2)}% ເພີ່ມຂີ້ນ`,
            color: "green",
          }
        : current < last
        ? {
            text: `▼ ${diffPercent.toFixed(2)}% ຫລຸດລົງ`,
            color: "red",
          }
        : {
            text: `0%`,
            color: "grey",
          };

    return increase;
  };

  const incress1 = getPercentFromPreviose(
    totalSell?.current?.totalSellPrice || 0,
    totalSell?.lastMonth?.totalSellPriceLast || 1
  );
  const incress2 = getPercentFromPreviose(
    totalSell?.current?.totalSendPrice || 0,
    totalSell?.lastMonth?.totalSendPriceLast || 1
  );
  const incress3 = getPercentFromPreviose(
    totalSell?.current?.totalExpPrice || 0,
    totalSell?.lastMonth?.totalExpPriceLast || 1
  );

  useEffect(() => {
    getProduct();
    getBrnachs();
    getCategory();
  }, []);

  useEffect(() => {
    fecthTotalSell();
  }, [token, queryForm, selectBranchs]);

  const fecthTotalSell = async () => {
    try {
      if (queryForm) {
        setOpenBackdrop(true);
        // Create a new object merging queryForm and branchs if selectBranchs exists
        const updatedQueryForm =
          selectBranchs && selectBranchs.length > 0
            ? { ...queryForm, branchs: selectBranchs }
            : { ...queryForm }; // keep queryForm as is if selectBranchs empty

        const res = await fecthDataDashborad(updatedQueryForm, token);
        setTotalSell(res.data);
        setOpenBackdrop(false);
      }
    } catch (err) {
      console.log(err);
    }
    setOpenBackdrop(false);
  };

  console.log(totalSell);

  return (
    <Box>
      {openBackdrop ? (
        <Backdrop
          sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
          open={openBackdrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box m="20px">
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mb: 2,
              }}
            >
              <Checkboxs
                branch={branchs}
                setSelectBranchs={setSelectBranchs}
                selectedBranchIds={selectBranchs}
                selectBranchName={selectBranchName}
                setSelectBranchName={setSelectBranchName}
              />
              <Box
                sx={{ display: "flex", gap: 1, flexWrap: "wrap", width: 500 }}
              >
                {selectBranchName &&
                  selectBranchName.map((b) => (
                    <Chip
                      sx={{ fontFamily: "Noto Sans Lao" }}
                      key={b.id}
                      label={b.branchname}
                    />
                  ))}
              </Box>
            </Box>
            <Box>
              <Calendar />
            </Box>
          </Box>

          {/* GRID & CHARTS */}
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, 1fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            {/* ROW 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.current?.totalSellPrice.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດຂາຍທັງຫມົດທຸກສາຂາ
                  </Typography>
                }
                progress={"none"}
                increase={incress1}
                icon={
                  <LocalAtmIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.current?.totalSendPrice.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດຈັດສົ່ງທັງຫມົດທຸກສາຂາ
                  </Typography>
                }
                increase={incress2}
                progress={"none"}
                icon={
                  <LocalShippingIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.current?.totalExpPrice.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດໝົດອາຍຸທັງຫມົດທຸກສາຂາ
                  </Typography>
                }
                increase={incress3}
                progress={"none"}
                icon={
                  <DeleteForeverIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {!totalSell ||
                    totalSell?.current?.percentageOfPricetotalExp === null
                      ? "0"
                      : totalSell?.current?.percentageOfPricetotalExp}{" "}
                    %
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ເປີເຊັນຍອດໝົດອາຍຸ ທຽບຍອດຈັດສົ່ງ
                  </Typography>
                }
                icon={
                  <SsidChartIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            {/** ROW 2 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.lastMonth?.totalSellPriceLast.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດຂາຍທັງຫມົດທຸກສາຂາ ເດືອນກ່ອນ
                  </Typography>
                }
                progress="none"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.lastMonth?.totalSendPriceLast.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດຂາຍທັງຫມົດທຸກສາຂາ ເດືອນກ່ອນ
                  </Typography>
                }
                progress="none"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {totalSell
                      ? totalSell?.lastMonth?.totalExpPriceLast.toLocaleString()
                      : 0}{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດໝົດອາຍຸທັງຫມົດທຸກສາຂາ ເດືອນກ່ອນ
                  </Typography>
                }
                progress="none"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatusBox
                title={
                  <Typography variant="laoText">
                    {!totalSell ||
                    totalSell?.lastMonth?.percentageOfPricetotalExpLast === null
                      ? "0"
                      : totalSell?.lastMonth?.percentageOfPricetotalExpLast}{" "}
                    %
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ເປີເຊັນຍອດໝົດອາຍຸ ທຽບຍອດຈັດສົ່ງ ເດືອນກ່ອນ
                  </Typography>
                }
                icon={
                  <SsidChartIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            {/** ROW 3 */}

            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{ padding: "30px 30px 0 30px" }}
              >
                Sales Quantity
              </Typography>
              <Box height="90%">
                <BarChart isDashboard={true} />
              </Box>
            </Box>

            {/** ROW 4 */}

            <Box
              gridColumn="span 6"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box height="90%">
                <PieChart />
              </Box>
            </Box>

            <Box
              gridColumn="span 6"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
            >
              <Box height="90%">
                <PieChart />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
