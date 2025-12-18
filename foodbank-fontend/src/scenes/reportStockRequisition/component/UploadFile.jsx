import { styled } from "@mui/material/styles";
import { Button, LinearProgress, Box, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { createStockRemain } from "../../../api/stockRemain";
import { useState } from "react";

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

const UploadFile = ({ queryForm, rawMaterial, fecthStockRemain }) => {
  const token = useFoodBankStorage((s) => s.token);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleCreateStock = async (id, count) => {
    if (!id || !count) return;

    return createStockRemain({ materialVariantId: id, count }, token);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("ຟາຍທີ່ອັບໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const htmlText = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, "text/html");

      const rows = doc.querySelectorAll("table.list tr");
      const extracted = [];

      rows.forEach((row, index) => {
        if (index === 0) return;

        const cells = row.querySelectorAll("td");
        if (cells.length < 9) return;

        const barcode = cells[2]?.textContent.trim();
        const quantityText = cells[8]?.textContent.trim();
        const quantity = parseInt(quantityText, 10);

        if (!barcode || isNaN(quantity)) return;

        rawMaterial.forEach((rm) => {
          rm.materialVariant.forEach((variant) => {
            if (variant.barcode === barcode) {
              extracted.push({
                materialVariantId: variant.id,
                quantityRequisition: quantity,
              });
            }
          });
        });
      });

      const total = extracted.length;
      let completed = 0;

      // 🔥 upload with progress
      for (const item of extracted) {
        await handleCreateStock(
          item.materialVariantId,
          item.quantityRequisition
        );

        completed += 1;
        setProgress(Math.round((completed / total) * 100));
      }

      // 🔄 refresh stock remain
      await fecthStockRemain();

      toast.success("ອັປໂຫລດສຳເລັດ.");
    } catch (err) {
      console.error(err);
      toast.error("ອັປໂຫລດລົ້ມເຫຼວ");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <Box
      sx={{
        height: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <Button
        component="label"
        variant="contained"
        color="info"
        disabled={
          loading ||
          !(queryForm?.startDate && queryForm?.endDate && queryForm?.branchId)
        }
        startIcon={
          loading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <AttachFileIcon />
          )
        }
        sx={{ fontFamily: "Noto Sans Lao", width: "100%" }}
      >
        {loading ? "ກຳລັງອັປໂຫລດ..." : "ອັປໂຫລດຟາຍຍອດຂາຍ"}
        <VisuallyHiddenInput
          type="file"
          accept=".html"
          onChange={handleFileUpload}
        />
      </Button>

      {/* 📊 Progress Bar */}
      {loading && (
        <Box mt={1} sx={{ position: "absolute", top: 66, width: "100%" }}>
          <LinearProgress variant="determinate" value={progress} color="info" />
          <Box textAlign="right" fontSize={12} mt={0.5}>
            {progress}%
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default UploadFile;
