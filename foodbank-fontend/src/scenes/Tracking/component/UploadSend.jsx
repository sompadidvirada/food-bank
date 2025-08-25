import React from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import AttachFileIcon from "@mui/icons-material/AttachFile";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const UploadSend = ({
  setSellCounts,
  handleSetSendCount,
  selectDateBrachCheck,
}) => {
  const products = useFoodBankStorage((state) => state.products);

  const handleSendUpload = async (event) => {
    const file = event.target.files[0];

    if (!file || (file.type !== "text/html" && !file.name.endsWith(".html"))) {
      toast.error("ຟາຍທີ່ອັບໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const rows = doc.querySelectorAll("table.list tr");
    const sendData = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");

      if (cells.length >= 7 && cells[2].querySelector("img")) {
        const item = parseInt(cells[0].textContent.trim());
        const name = cells[3].textContent.trim();
        const rawCount = cells[4].textContent.trim();

        const countMatch = rawCount.match(/\d+/);
        const sendCount = countMatch ? parseInt(countMatch[0]) : null;

        const product = products.find(
          (p) => p.name.trim().toLowerCase() === name.toLowerCase()
        );

        if (!product) {
          toast.error(`❌ "${name}" ບໍ່ພົບໃນສິນຄ້າ`);
          return;
        }

        if (!isNaN(item) && name && !isNaN(sendCount) && product) {
          sendData.push({
            product,
            sendCount,
            productId: product.id,
          });
        }
      }
    });

    // Now use the data to update state and call backend
    sendData.forEach((entry) => {
      setSellCounts((prev) => ({
        ...prev,
        [entry.productId]: entry.sendCount,
      }));

      setTimeout(() => {
        handleSetSendCount(entry.productId, entry.sendCount, entry.product); // ✅ pass the value directly
      }, 150);
    });

    
    event.target.value = "";
    toast.success('ອັປໂຫລດຟາຍຍອດຈັດສົ່ງສຳເລັດ.')
  };

  return (
    <div className="p-4">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        color="info"
        tabIndex={-1}
        disabled={selectDateBrachCheck?.sendDate && selectDateBrachCheck?.brachId ? false : true}
        startIcon={<AttachFileIcon />}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ອັປໂຫລດຟາຍຍອດຈັດສົ່ງ
        <VisuallyHiddenInput
          type="file"
          accept=".html"
          onChange={handleSendUpload}
        />
      </Button>
    </div>
  );
};

export default UploadSend;
