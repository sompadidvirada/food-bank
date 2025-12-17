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

        if (!barcode || !quantityText) return;

        const quantity = parseInt(quantityText, 10);
        if (isNaN(quantity)) return;

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

      // 🔥 upload all stocks and wait
      await Promise.all(
        extracted.map((entry) =>
          handleCreateStock(entry.materialVariantId, entry.quantityRequisition)
        )
      );

      // ✅ refresh stock remain AFTER success
      await fecthStockRemain();

      toast.success("ອັປໂຫລດສຳເລັດ.");
    } catch (err) {
      console.error(err);
      toast.error("ອັປໂຫລດລົ້ມເຫຼວ");
    } finally {
      event.target.value = "";
    }
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
