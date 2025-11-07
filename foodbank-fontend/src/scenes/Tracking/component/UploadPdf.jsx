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

const UploadPdf = ({ handleSetSellCount, selectDateBrachCheck }) => {
  const products = useFoodBankStorage((state) => state.products);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("ຟາຍທີ່ອັປໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const rows = doc.querySelectorAll("table.list tr");
    const extracted = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 8) {
        const type = cells[7].textContent.trim();
        if (type === "BAKERY/CAKE" || type === "BEVERAGES") {
          const menu = cells[2].textContent.trim();
          const sellCount = parseInt(cells[3].textContent.trim());
          const product = products.find(
            (p) => p.name.trim().toLowerCase() === menu.toLowerCase()
          );
          if (product && menu && !isNaN(sellCount)) {
            extracted.push({ productId: product.id, sellCount, product });
          }
        }
      }
    });

    // 🔁 Process one by one to ensure reliability
    for (const entry of extracted) {
      handleSetSellCount(entry.productId, entry.sellCount, entry.product);
      await new Promise((r) => setTimeout(r, 100)); // slight delay for stability
    }

    event.target.value = "";
    toast.success("ອັປໂຫລດຟາຍຍອດຂາຍສຳເລັດ.");
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
          selectDateBrachCheck?.sellDate && selectDateBrachCheck?.brachId
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

export default UploadPdf;
