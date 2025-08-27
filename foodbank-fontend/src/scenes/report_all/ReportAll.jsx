import { useEffect, useMemo, useRef, useState } from "react";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import Calendar from "../../component/Calendar";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import Header from "../component/Header";
import ImageModal from "../../component/ImageModal";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const ReportAll = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const totalData = useFoodBankStorage((state) => state.totalData);
  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  useEffect(() => {
    if (!totalData || totalData.length === 0) return;

    const imageUrls = Array.isArray(totalData?.totalDetail)
      ? totalData.totalDetail
          .flatMap((item) => item.detail || [])
          .map((item) => (item.image ? `${URL}/${item.image}` : null))
          .filter(Boolean)
      : [];

    const uniqueUrls = [...new Set(imageUrls)];

    uniqueUrls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [totalData]);

  const rowsWithPercent = useMemo(() => {
    return (
      totalData?.map((item) => {
        const percent =
          item.totalSend > 0
            ? ((item.totalExp / item.totalSend) * 100).toFixed(1)
            : 0;
        return {
          ...item,
          percent: Number(percent),
        };
      }) || []
    );
  }, [totalData]);

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ໄອດີ", flex: 0.1 },
      {
        field: "image",
        headerName: "ຮູບພາບ",
        headerAlign: "center",
        flex: 0.3,
        renderCell: (params) => {
          const imageUrl = params.row.image
            ? `${URL}/${params.row.image}`
            : null;
          return imageUrl ? (
            <img
              src={imageUrl}
              alt="Product"
              loading="lazy"
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(imageUrl)}
            />
          ) : (
            <span>No Image</span>
          );
        },
      },
      {
        field: "name",
        headerName: "ຊື່ສິນຄ້າ",
        headerAlign: "center",
        flex: 0.5,
        renderCell: (params) => (
          <Typography
            variant="laoText"
            fontWeight="bold"
            color={colors.grey[100]}
          >
            {params?.value}
          </Typography>
        ),
      },
      {
        field: "totalSend",
        headerName: "ຈຳນວນຈັດສົ່ງ",
        headerAlign: "center",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.blueAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "totalSell",
        headerAlign: "center", // This centers the column title
        headerName: "ຈຳນວນຂາຍ",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.greenAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "totalExp",
        headerName: "ຈຳນວນໝົດອາຍຸ",
        headerAlign: "center",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.redAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "totalPriceSend",
        headerName: "ມູນຄ່າຈັດສົ່ງ",
        headerAlign: "center",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.blueAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "totalPriceSell",
        headerName: "ມູນຄ່າຍອດຂາຍ",
        headerAlign: "center",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.greenAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "totalPriceEXP",
        headerName: "ມູນຄ່າໝົດອາຍຸ",
        headerAlign: "center",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          let color = colors.redAccent[400];
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Typography color={color}>
                {params?.value.toLocaleString()}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "percent",
        headerName: "ເປີເຊັ່ນໝົດອາຍຸ",
        type: "number",
        flex: 0.5,
        renderCell: (params) => {
          const value = params.value;
          let color = colors.greenAccent[400];
          if (value > 30) color = "#f44336";
          else if (value > 15) color = "#ffeb3b";

          return (
            <Typography fontWeight="bold" color={color}>
              {value} %
            </Typography>
          );
        },
      },
    ],
    [colors]
  );

  const handlePrint = () => {
    const formatCell = (value) => {
      if (typeof value === "number") return value.toLocaleString();
      return value ?? "";
    };

    const printableColumns = columns.filter((col) => col.field !== "image");

    const printWindow = window.open("", "_blank");
    const tableHeaders = printableColumns
      .map((col) => `<th>${col.headerName}</th>`)
      .join("");

    const sortedRows = [...rowsWithPercent].sort(
      (a, b) => b.totalSend - a.totalSend
    );

    const tableRows = sortedRows
      .map((row) => {
        return `<tr>${printableColumns
          .map((col) => `<td>${formatCell(row[col.field])}</td>`)
          .join("")}</tr>`;
      })
      .join("");

    // Aggregate totals
    // Aggregate total prices
    const totalPriceSend = totalData.reduce(
      (sum, b) => sum + b.totalPriceSend,
      0
    );
    const totalPriceSell = totalData.reduce(
      (sum, b) => sum + b.totalPriceSell,
      0
    );
    const totalPriceEXP = totalData.reduce(
      (sum, b) => sum + b.totalPriceEXP,
      0
    );
    const branchPercent =
      totalPriceSend > 0
        ? ((totalPriceEXP / totalPriceSend) * 100).toFixed(1)
        : 0;

    const html = `
    <html>
      <head>
        <title>Branch Tracking Report</title>
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
        <h2>ລາຍງານສະຫຼຸບຂໍ້ມູນທັງໝົດ</h2>
        <p>ລາຄາສົ່ງລວມ: ${totalPriceSend.toLocaleString()} ກີບ</p>
<p>ລາຄາຂາຍລວມ: ${totalPriceSell.toLocaleString()} ກີບ</p>
<p>ລາຄາໝົດອາຍຸລວມ: ${totalPriceEXP.toLocaleString()} ກີບ</p>
<p>ເປີເຊັນໝົດອາຍຸ %: ${branchPercent}%</p>

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
    <Box m="20px" sx={{ paddingBottom: "60px" }}>
      <Header title="ຕິດຕາມຍອດຂາຍ ສົ່ງ ໝົດອາຍຸຂອງທຸກລາຍການ ທຸກສາຂາ." />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Calendar />
            <Button
              variant="contained"
              color="info"
              onClick={handlePrint}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              ປິ່ນລາຍງານ
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": { borderBottom: "none" },
            "& .name-column--cell": { color: colors.greenAccent[300] },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-virtualScrollerContent": {
              paddingBottom: "60px", // ✅ adds visible space AFTER the last row
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            autoHeight // ✅ let the grid expand to fit all rows
            rows={rowsWithPercent}
            columns={columns}
            disableRowSelectionOnClick
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
      </Box>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default ReportAll;
