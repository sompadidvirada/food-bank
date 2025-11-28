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

const UploadFile = ({ handleSetSell, selectDateBrachCheck, coffeeMenu,setLoading }) => {
  const handleFileUpload = async (event) => {
    setLoading(true)
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

    // 💡 Store grouped results: key = menuId-size
    const groupedMap = new Map();

    const normalize = (str) => str.replace(/\s+/g, " ").trim().toLowerCase();

    rows.forEach((row, index) => {
      if (index === 0) return; // skip header
      const cells = row.querySelectorAll("td");
      if (cells.length < 7) return;

      let menuName = cells[2]?.textContent.trim();
      const quantityText = cells[3]?.textContent.trim();
      const size = cells[6]?.textContent.trim();

      if (!menuName || !quantityText || !size) return;

      const quantity = parseInt(quantityText, 10);
      if (isNaN(quantity)) return;

      const lpbPrefix = "[ LPB ]";
      if (menuName.toUpperCase().startsWith(lpbPrefix)) {
        // Remove the prefix and re-trim
        menuName = menuName.substring(lpbPrefix.length).trim();
      }

      // 🟦 RULE: If it's a combo "A + B", use ONLY the FIRST part (A)
      if (menuName.includes("+")) {
        const parts = menuName.split("+").map((p) => p.trim());
        menuName = parts[0]; // FIRST part
      }

      const normalizedName = normalize(menuName);
      const normalizedSize = size.toUpperCase().trim();

      // 🔍 Try to find product in DB by name + size
      const matchedMenu = coffeeMenu.find(
        (menu) =>
          normalize(menu.name) === normalizedName &&
          menu.size.toUpperCase().trim() === normalizedSize
      );

      if (matchedMenu) {
        const key = `${matchedMenu.id}-${normalizedSize}`;

        if (!groupedMap.has(key)) {
          groupedMap.set(key, {
            product: matchedMenu,
            productId: matchedMenu.id,
            size: normalizedSize,
            totalSell: quantity,
          });
        } else {
          groupedMap.get(key).totalSell += quantity;
        }
      } else {
        console.warn(`⚠️ Menu not found: ${menuName} (${size})`);
      } 
    });

    // 📌 Send grouped results to your handler
    for (const entry of groupedMap.values()) {
      await new Promise((res) => setTimeout(res, 150));
      handleSetSell(entry.productId, entry.totalSell, entry.product);
    }

    event.target.value = "";
    toast.success("ອັບໂຫລດຍອດຂາຍສຳເລັດ.");
    setLoading(false)
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
        ອັປໂຫລດຟາຍ TREEKOFF
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
