import React, { useState } from "react";
import { Box, Typography, Button, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../component/Header";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { format } from "date-fns";
import FilterIcon from "@mui/icons-material/Filter";
import ImagePreviewModal from "./ImagePreviewModal";
const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const DataGrind = ({ branch, columns }) => {
  const queryForm = useFoodBankStorage((state) => state.queryForm);
  const imageTrack = useFoodBankStorage((state) => state.imageTrack);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);

  const handleImageClick = () => {
    const filtered = imageTrack.filter((img) => img.branchId === branch?.id);
    if (filtered.length > 0) {
      setPreviewIndex(0); // or some logic to find a specific image index
      setIsModalOpen(true);
    }
  };

  // ✅ Put this just before return
  const filteredImages = imageTrack
    .filter((img) => img.branchId === branch?.id)
    .map((img) => ({
      imageName: img.imageName,
      date: img.date,
    }));

  const handlePrint = () => {
    const formatCell = (value) => {
      if (typeof value === "number") return value.toLocaleString();
      return value ?? "";
    };

    // Exclude the 'image' column from print
    const printableColumns = columns.filter((col) => col.field !== "image");

    const printWindow = window.open("", "_blank");
    const tableHeaders = printableColumns
      .map((col) => `<th>${col.headerName}</th>`)
      .join("");
    const sortedRows = [...branch.rowsWithPercent].sort(
      (a, b) => b.totalSend - a.totalSend
    );

    const tableRows = sortedRows
      .map((row) => {
        return `<tr>${printableColumns
          .map((col) => `<td>${formatCell(row[col.field])}</td>`)
          .join("")}</tr>`;
      })
      .join("");

    const html = `
      <html>
        <head>
          <title>${branch.name}</title>
           <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap" rel="stylesheet">
            <style>
               body {
             font-family: 'Noto Sans Lao', Arial, sans-serif;
                   }
                            table {
                width: 100%;
                border-collapse: collapse;
              }
              th, td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
              }
              h2 {
                text-align: center;
              }
            </style>
        </head>

        <body>
          <h2>${branch.name}</h2>
          <p>ສົ່ງ: ${branch.totalSend.toLocaleString()} ກີບ</p>
          <p>ຂາຍ: ${branch.totalSell.toLocaleString()} ກີບ</p>
          <p>ໝົດອາຍຸ: ${branch.totalExp.toLocaleString()} ກີບ</p>
          <p>ເປີເຊັນໝົດອາຍຸ %: ${branch.branchPercent}%</p>
          <table>
            <thead><tr>${tableHeaders}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>window.onload = () => { window.print(); }</script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <Box sx={{ mb: "30px" }}>
      <Header
        title={
          <Box display={"flex"} gap={3} justifySelf={"center"}>
            <Typography variant="laoText" sx={{ fontSize: 25 }}>
              {`${branch?.name} (Expired %: ${branch?.branchPercent || ""})`}
            </Typography>
            <Typography
              variant="laoText"
              sx={{ fontSize: 25, color: "rgb(83, 129, 255)" }}
            >
              SEND {branch?.totalSend.toLocaleString() || ""} ກີບ
            </Typography>
            <Typography
              variant="laoText"
              sx={{ fontSize: 25, color: "rgb(0, 255, 136)" }}
            >
              SELL {branch?.totalSell.toLocaleString() || ""} ກີບ
            </Typography>
            <Typography
              variant="laoText"
              sx={{ fontSize: 25, color: "rgb(255, 40, 33)" }}
            >
              EXP {branch?.totalExp?.toLocaleString() || ""} ກີບ
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="info"
                sx={{ fontFamily: "Noto Sans Lao" }}
                onClick={handlePrint}
              >
                ປິ່ນສະຫລຸບ
              </Button>
            </Box>
          </Box>
        }
      />

      <Box
        display={"flex"}
        gap={2}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="laoText" sx={{ fontSize: 20 }}>
          ເບີ່ງຮູບພາບຂອງສາຂາ {branch?.name} ວັນທີ່:{" "}
          {format(new Date(queryForm?.startDate), "dd/MM/yyyy")} -{" "}
          {format(new Date(queryForm?.endDate), "dd/MM/yyyy")}
        </Typography>
        <IconButton
          sx={{ color: "rgba(113, 157, 252, 1)" }}
          onClick={handleImageClick}
          disabled={filteredImages.length > 0 ? false : true}
        >
          <FilterIcon />
        </IconButton>
        {filteredImages.length === 0 && (
          <Typography variant="laoText" color="red">
            ບໍ່ມີຮູບພາບ.
          </Typography>
        )}
      </Box>
      <DataGrid
        rows={branch.rowsWithPercent}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        disableSelectionOnClick
        pagination
        pageSize={10}
        hideFooter
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            fontFamily: "Noto Sans Lao",
            fontWeight: "bold", // optional
            fontSize: "15px", // optional
          },
        }}
      />

      {/* ✅ Add the modal here */}
      <ImagePreviewModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={filteredImages}
        startIndex={previewIndex}
        baseUrl={URL}
        branch={branch}
      />
    </Box>
  );
};

export default DataGrind;
