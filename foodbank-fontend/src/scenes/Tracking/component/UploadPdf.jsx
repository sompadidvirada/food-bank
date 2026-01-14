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
    const extractedMap = new Map();

    const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 8) {
        const type = cells[7].textContent.trim();

        if (
          type === "BAKERY/CAKE" ||
          type === "BEVERAGES" ||
          type === "SET MENU"
        ) {
          let menu = normalize(cells[2].textContent);
          const sellCount = parseInt(cells[3].textContent.trim());

          if (isNaN(sellCount)) return;

          // Extract the part after "+"
          let lastPart = menu;
          if (menu.includes("+")) {
            const parts = menu.split("+").map((p) => normalize(p));
            lastPart = parts[parts.length - 1];
          }

          // Find product by exact match only
          const matchedProduct = products.find(
            (p) => normalize(p.name) === lastPart
          );

          if (matchedProduct) {
            const id = matchedProduct.id;

            if (!extractedMap.has(id)) {
              extractedMap.set(id, {
                productId: id,
                sellCount: sellCount,
                product: matchedProduct,
              });
            } else {
              extractedMap.get(id).sellCount += sellCount;
            }
          }
        }
      }
    });

    const extracted = Array.from(extractedMap.values());

    for (const entry of extracted) {
      await handleSetSellCount(entry.productId, entry.sellCount, entry.product);

      // small delay to avoid API flooding
      await new Promise((res) => setTimeout(res, 150));
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
