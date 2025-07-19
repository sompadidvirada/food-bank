import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../component/Header";

const DataGrind = ({ branch, columns }) => {
  console.log(branch);

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
            <Button variant="contained" color="success" onClick={handlePrint}>
              Print
            </Button>
          </Box>
        }
      />
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
    </Box>
  );
};

export default DataGrind;
