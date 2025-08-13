import React, { forwardRef, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Button } from "@mui/material";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import CompoPrint from "./CompoPrint";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { getAllOrderTrack } from "../../../api/preorder";
import { format, parseISO } from "date-fns";

const PrintCompo = () => {
  const componentRef = useRef();
  const [orders, setOrders] = useState([]);
  const products = useFoodBankStorage((state) => state.products);
  const token = useFoodBankStorage((state) => state.token);
  const dateConfirmOrder = useFoodBankStorage(
    (state) => state.dateConfirmOrder
  );
  const formattedDate = format(parseISO(dateConfirmOrder?.orderDate), "dd/MM/yyyy");

  const fetchDataAndPrint = async () => {
    try {
      // Fetch order data
      const ordersRes = await getAllOrderTrack(dateConfirmOrder, token);

      setOrders(ordersRes.data);

      // Wait a tick so state updates before printing
      setTimeout(() => {
        handlePrint();
      }, 100);
    } catch (error) {
      console.error("Failed to fetch and print:", error);
    }
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `ອໍເດີເບເກີລີ່ປະຈຳວັນທີ່ ${formattedDate}`,
  });

  return (
    <>
      <Button
        onClick={fetchDataAndPrint}
        variant="outlined"
        color="info"
        disabled={dateConfirmOrder.orderDate ? false : true}
        startIcon={<LocalPrintshopIcon />}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ປີ່ນບິນທັງໝົດ
      </Button>
      <Box display={"none"}>
        <CompoPrint
          componentRef={componentRef}
          orders={orders}
          products={products}
        />
      </Box>
    </>
  );
};

export default PrintCompo;
