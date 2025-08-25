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

const UploadFile = ({handleSetSell, selectDateBrachCheck, coffeeMenu}) => {
    console.log(coffeeMenu)
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
  
  rows.forEach((row, index) => {
    if (index === 0) return; // skip header row
    const cells = row.querySelectorAll("td");
    if (cells.length < 7) return;

    const menuName = cells[2]?.textContent.trim();
    const quantityText = cells[3]?.textContent.trim();
    const size = cells[6]?.textContent.trim();

    if (!menuName || !quantityText || !size) return;

    const quantity = parseInt(quantityText, 10);
    if (isNaN(quantity)) return;

    // find match in coffeeMenu
    const matchedMenu = coffeeMenu.find(
      (menu) =>
        menu.name.toLowerCase().trim() === menuName.toLowerCase().trim() &&
        menu.size.toUpperCase().trim() === size.toUpperCase().trim()
    );

    if (matchedMenu) {
      setTimeout(() => {
        handleSetSell(matchedMenu.id, quantity, matchedMenu);
      }, 150);
    } else {
      console.warn(`⚠️ Menu not found: ${menuName} (${size})`);
    }
  });

  event.target.value = ""; // clear after successful upload
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
          selectDateBrachCheck?.sellDate &&
          selectDateBrachCheck?.brachId
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
