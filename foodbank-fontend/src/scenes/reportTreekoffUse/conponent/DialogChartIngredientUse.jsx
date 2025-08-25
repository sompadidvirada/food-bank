import React, { useEffect, useRef, useState } from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Typography,
  useTheme,
} from "@mui/material";
import { getCoffeeIngredientUseByMaterialId } from "../../../api/reportCoffeeSell";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { tokens } from "../../../theme";
import { ResponsiveBar } from "@nivo/bar";
import { format, parseISO } from "date-fns";
import { useReactToPrint } from "react-to-print";
import ComponentToPrintChild from "./ComponentToPrintChild";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomTooltip = ({ id, value, indexValue, data }) => {
  const colors = tokens("dark"); // or light, depending on your theme
  return (
    <Card
      sx={{
        backgroundColor: colors.grey[100],
        boxShadow: 3,
        borderRadius: 2,
        p: 1,
      }}
    >
      <CardContent
        sx={{ p: 1, color: colors.grey[900], fontFamily: "Noto Sans Lao" }}
      >
        {indexValue}
        <br />
        <strong>
          {id === "stockRequisition"
            ? "ຍອດເບີກຈາກສາງ"
            : "ຍອດນຳໃຊ້ວັດຖຸດິບຈາກຍອດຂາຍ"}
        </strong>
        <br />
        <Typography fontFamily={"Noto Sans Lao"}>
          ຈຳນວນ:{" "}
          {`${value ? value.toLocaleString("en-US") : 0} ${
            data?.materialVariantName || ""
          }`}
        </Typography>
      </CardContent>
    </Card>
  );
};

const DialogChartIngredientUse = ({
  setOpen,
  selectDataBar,
  open,
  queryForm,
  branchName
}) => {
  const user = useFoodBankStorage((state)=>state.user)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [ingredientUsePerBranch, setIngredientUsePerBrnach] = useState([]);
  const token = useFoodBankStorage((state) => state.token);
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ປີ່ນລາຍງານ`,
  });

  const handleClose = () => {
    setOpen(false);
  };

  console.log(selectDataBar)

  const fecthIngredientuse = async () => {
    try {
      const ress = await getCoffeeIngredientUseByMaterialId(
        {
          startDate: queryForm.startDate,
          endDate: queryForm.endDate,
          materialVariantId: selectDataBar.materialVariantId,
        },
        token
      );
      setIngredientUsePerBrnach(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (selectDataBar) {
      fecthIngredientuse();
    }
  }, [token, selectDataBar]);

  return (
    <Dialog
      open={open}
      slots={{ transition: Transition }}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle
        sx={{
          fontFamily: "Noto Sans Lao",
          display: "flex",
        }}
      >
        {queryForm?.startDate && queryForm?.endDate ? (
          <p>
            ການນຳໃຊ້ວັດຖຸດິບ: {selectDataBar?.rawMaterialName || ""} ຂອງວັນທີ{" "}
            {format(parseISO(queryForm?.startDate), "dd/MM/yyyy")} -{" "}
            {format(parseISO(queryForm?.endDate), "dd/MM/yyyy")}
          </p>
        ) : (
          "No data selected."
        )}
        <Box sx={{ alignContent: "center", ml: 2 }}>
          <Button
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
            color="info"
            onClick={()=>handlePrint()}
          >
            ປິ່ນລາຍງານໜ້ານີ້
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent>
        <div style={{ height: 500 }}>
          <ResponsiveBar
            data={ingredientUsePerBranch}
            keys={["stockRequisition", "ingredientUsage"]}
            indexBy="branchName"
            groupMode="grouped"
            padding={0.5}
            enableLabel={false}
            innerPadding={2}
            colors={(bar) => {
              if (bar.id === "stockRequisition") return colors.blueAccent[400];
              if (bar.id === "ingredientUsage") return colors.greenAccent[400];
              return "#ccc";
            }}
            tooltip={(props) => <CustomTooltip {...props} />}
            axisBottom={{
              tickSize: 12,
              tickPadding: 14,
              tickRotation: -38,
              legendOffset: -1,
              truncateTickAt: 52,
              color: colors[100],
            }}
            theme={{
              labels: {
                text: {
                  fontFamily: "Noto Sans Lao, sans-serif",
                  fontSize: 12,
                  fontWeight: "bold",
                },
              },
              axis: {
                ticks: {
                  text: {
                    fill: colors.grey[100],
                    fontSize: 12,
                    fontFamily: "Noto Sans Lao",
                  },
                },
              },
            }}
            motionConfig={{
              mass: 50,
              tension: 81,
              friction: 1,
              clamp: true,
              precision: 0.01,
              velocity: 0,
            }}
            margin={{ top: 50, right: 30, bottom: 140, left: 60 }}
          />
        </div>
      </DialogContent>
      <Box sx={{ display: "none" }}>
        <ComponentToPrintChild
          user={user}
          ref={componentRef}
          branchName={branchName}
          queryForm={queryForm}
          ingredientUsePerBranch={ingredientUsePerBranch}
          selectDataBar={selectDataBar}
        />
      </Box>
    </Dialog>
  );
};

export default DialogChartIngredientUse;
