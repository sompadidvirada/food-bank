import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { createStockRemain } from "../../../api/stockRemain";

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

  const handleCreateStock = async (id, count) => {
    if (!id && !count) return;

    try {
      const ress = await createStockRemain(
        { materialVariantId: id, count: count },
        token
      );
      console.log(ress);
    } catch (err) {
      console.log(err);
    }
  };
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("ຟາຍທີ່ອັບໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const rows = doc.querySelectorAll("table.list tr");
    const extracted = [];

    rows.forEach((row, index) => {
      if (index === 0) return; // skip header row
      const cells = row.querySelectorAll("td");
      if (cells.length < 3) return;

      const barcode = cells[2]?.textContent.trim();
      const quantityText = cells[8]?.textContent.trim(); // e.g. "2 ແກັດ"

      if (!barcode || !quantityText) return;

      const quantity = parseInt(quantityText, 10);
      if (isNaN(quantity)) return;

      let matchedVariant = null;
      let matchedRaw = null;

      rawMaterial.forEach((rm) => {
        rm.materialVariant.forEach((variant) => {
          if (variant.barcode === barcode) {
            matchedVariant = variant;
            matchedRaw = rm; // ✅ capture parent raw material
          }
        });
      });

      if (matchedVariant && matchedRaw) {
        extracted.push({
          quantityRequisition: quantity,
          materialVariantId: matchedVariant.id,
        });
      } else {
        console.warn(`⚠️ Barcode ${barcode} not found in materialVariant`);
      }
    });
    extracted.map((entry) => {
      setTimeout(() => {
        handleCreateStock(entry.materialVariantId, entry.quantityRequisition);
      }, 150);
    });

    event.target.value = ""; // ✅ clear after successful upload
    await fecthStockRemain();
  };
  return (
    <div className="p-4">
      <Button
        component="label"
        role={undefined}
        variant="contained"
        color="info"
        tabIndex={-1}
        disabled={
          queryForm?.startDate && queryForm?.endDate && queryForm?.branchId
            ? false
            : true
        }
        startIcon={<AttachFileIcon />}
        sx={{ fontFamily: "Noto Sans Lao" }}
      >
        ອັປໂຫລດຟາຍຍອດຂາຍ
        <VisuallyHiddenInput
          type="file"
          accept=".html"
          onChange={handleFileUpload}
        />
      </Button>
    </div>
  );
};

export default UploadFile;
