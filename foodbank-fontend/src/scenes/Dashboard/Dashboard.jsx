import { Backdrop, Box, Chip, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import StatusBox from "../component/StatusBox";
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
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import DepartureBoardIcon from "@mui/icons-material/DepartureBoard";
import AutoDeleteIcon from "@mui/icons-material/AutoDelete";
import EmojiSymbolsIcon from "@mui/icons-material/EmojiSymbols";
import LineCharts from "../../component/LineChart";
import PieSellCompo from "../../component/PieSell";
import PieSendCompo from "../../component/PieSend";
import PieExpCompo from "../../component/PieExp";
import BarChart from "../../component/BarChartSell";
import BarChartSend from "../../component/BarChartSend";
import BarChartExp from "../../component/BarChartExp";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import VerifiedIcon from "@mui/icons-material/Verified";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import CountUp from "../../component/CountUp";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [selectBranchs, setSelectBranchs] = useState([]);
  const [selectBranchName, setSelectBranchName] = useState([]);
  const [totalSell, setTotalSell] = useState(null);
  const {
    getProduct,
    getBrnachs,
    getCategory,
    token,
    queryForm,
    branchs,
    pieSell,
    pieSend,
    pieExp,
  } = useFoodBankStorage();
  const data = useFoodBankStorage((state) => state.barSell);
  const data2 = useFoodBankStorage((state) => state.barSend);
  const data3 = useFoodBankStorage((state) => state.barExp);

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
    getProduct(true);
    getBrnachs(true);
    getCategory(true);
  }, []);

  useEffect(() => {
    if (queryForm.startDate && queryForm.endDate) {
      fecthTotalSell();
    }
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
          <Header title="ພາບລວມທັງໝົດ" />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
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
              <Calendar selectBranchs={selectBranchs} />
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
                    <CountUp
                      from={0}
                      to={totalSell?.current?.totalSellPrice || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
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
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.current?.totalSendPrice || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
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
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.current?.totalExpPrice || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
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
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.current?.percentageOfPricetotalExp || 0}
                      duration={0.3}
                    />{" "}
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
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.lastMonth?.totalSellPriceLast || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
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
                  <CurrencyExchangeIcon
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.lastMonth?.totalSendPriceLast || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
                    ກີບ
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ຍອດຈັດສົ່ງທັງຫມົດທຸກສາຂາ ເດືອນກ່ອນ
                  </Typography>
                }
                progress="none"
                icon={
                  <DepartureBoardIcon
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={totalSell?.lastMonth?.totalExpPriceLast || 0}
                      duration={0.1}
                      separator=","
                    />{" "}
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
                  <AutoDeleteIcon
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
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
                    <CountUp
                      from={0}
                      to={
                        totalSell?.lastMonth?.percentageOfPricetotalExpLast || 0
                      }
                      duration={0.3}
                    />{" "}
                    %
                  </Typography>
                }
                subtitle={
                  <Typography variant="laoText">
                    ເປີເຊັນຍອດໝົດອາຍຸ ທຽບຍອດຈັດສົ່ງ ເດືອນກ່ອນ
                  </Typography>
                }
                icon={
                  <EmojiSymbolsIcon
                    sx={{ color: colors.grey[100], fontSize: "26px" }}
                  />
                }
              />
            </Box>

            {/** ROW 3 */}

            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              textAlign={"center"}
            >
              <Typography
                variant="laoText"
                fontWeight="600"
                fontSize={25}
                sx={{ p: 2 }}
              >
                ຍອດຂາຍແຕ່ລະສາຂາ ແຍກເປັນວັນ ຈັນ - ອາທິດ
              </Typography>
              <Box height="90%">
                <LineCharts isDashboard={true} />
              </Box>
            </Box>

            {/** ROW 4 */}

            <Box
              gridColumn="span 4"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="laoText"
                sx={{ m: "5px 5px 0 0", fontSize: 18, p: 2 }}
              >
                ລາຍການທີ່ຂາຍຂອງແຕ່ລະສາຂາ
              </Typography>
              <Box height="80%">
                <PieSellCompo isDashboard={true} dataPie={pieSell} />
              </Box>
            </Box>

            <Box
              gridColumn="span 4"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="laoText"
                sx={{ m: "5px 5px 0 0", fontSize: 18, p: 2 }}
              >
                ລາຍການທີ່ຈັດສົ່ງຂອງແຕ່ລະສາຂາ
              </Typography>
              <Box height="80%">
                <PieSendCompo isDashboard={true} dataPie={pieSend} />
              </Box>
            </Box>
            <Box
              gridColumn="span 4"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"space-between"}
            >
              <Typography
                variant="laoText"
                sx={{ m: "5px 5px 0 0", fontSize: 18, p: 2 }}
              >
                ລາຍການທີ່ໝົດອາຍຸຂອງແຕ່ລະສາຂາ
              </Typography>
              <Box height="80%">
                <PieExpCompo isDashboard={true} dataPie={pieExp} />
              </Box>
            </Box>
            {/** ROW 5 */}
            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              textAlign={"center"}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="laoText"
                  fontSize={20}
                  color={colors.greenAccent[400]}
                >
                  ຍອດຂາຍແຕ່ລະສາຂາ
                </Typography>
                <VerifiedIcon
                  sx={{ color: colors.greenAccent[400], fontSize: 30 }}
                />
              </Box>
              <Box sx={{ width: "100%", height: "85%" }}>
                <BarChart data={data} isDashboard={true} />
              </Box>
            </Box>
            {/** ROW 6 */}
            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              textAlign={"center"}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="laoText"
                  fontSize={20}
                  color={colors.blueAccent[400]}
                >
                  ຍອດຈັດສົ່ງແຕ່ລະສາຂາ
                </Typography>
                <AddBusinessIcon
                  sx={{ color: colors.blueAccent[400], fontSize: 30 }}
                />
              </Box>
              <Box sx={{ width: "100%", height: "85%" }}>
                <BarChartSend data={data2} isDashboard={true} />
              </Box>
            </Box>
            {/** ROW 7 */}
            <Box
              gridColumn="span 12"
              gridRow="span 3"
              backgroundColor={colors.primary[400]}
              textAlign={"center"}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "10%",
                  display: "flex",
                  gap: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="laoText"
                  fontSize={20}
                  color={colors.redAccent[400]}
                >
                  ຍອດໝົດອາຍຸແຕ່ລະສາຂາ
                </Typography>
                <RestoreFromTrashIcon
                  sx={{ color: colors.redAccent[400], fontSize: 30 }}
                />
              </Box>
              <Box sx={{ width: "100%", height: "85%" }}>
                <BarChartExp data={data3} isDashboard={true} />
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
