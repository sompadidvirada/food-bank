import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ImageModal from "../../../component/ImageModal";
import Header from "../../component/Header";
import { tokens } from "../../../theme";
import CalendarReportTreekoff from "./CalendarReportTreekoff";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { getReportTreekoff } from "../../../api/report";

const URL =
  "https://treekoff-storage-coffee-menu.s3.ap-southeast-2.amazonaws.com";

const DataGridReportTreekoff = () => {
  const imageModalRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const queryForm = useFoodBankStorage((s) => s.queryForm);
  const token = useFoodBankStorage((s) => s.token);
  const [excludedStatuses, setExcludedStatuses] = useState([]);
  const [reportTreekoff, setReportTreekoff] = useState([]);

  const fecthReportTreekoff = async () => {
    try {
      const ress = await getReportTreekoff(queryForm, token);
      setReportTreekoff(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (queryForm?.startDate && queryForm?.endDate) {
      fecthReportTreekoff();
    }
  }, [queryForm]);

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  console.log(reportTreekoff);

  const totalAllRevenue = useMemo(() => {
    return reportTreekoff.reduce(
      (sum, row) => sum + (row.totalRevenue || 0),
      0
    );
  }, [reportTreekoff]);

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
        renderCell: ({ row }) => (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            sx={{
              whiteSpace: "normal",
              wordWrap: "break-word",
              overflowWrap: "break-word",
            }}
          >
            <Typography
              fontSize={12}
              fontFamily="Noto Sans Lao"
              color={colors.grey[100]}
              sx={{
                whiteSpace: "normal",
                wordBreak: "break-word", // breaks long words too
              }}
            >
              {row.name}
            </Typography>
          </Box>
        ),
      },
      {
        field: "sellPrice",
        headerName: "ລາຄາຂາຍ",
        headerAlign: "center",
        flex: 0.5,
        renderCell: ({ row }) => (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            <Typography
              fontSize={12}
              fontFamily="Noto Sans Lao"
              color={colors.grey[100]}
            >
              {row.sellPrice.toLocaleString()} ກີບ
            </Typography>
          </Box>
        ),
      },
      {
        field: "size",
        headerName: "ຂະໜາດຈອກ",
        headerAlign: "center",
        flex: 0.5,
        renderCell: ({ row }) => (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            <Typography
              fontSize={12}
              fontFamily="Noto Sans Lao"
              color={colors.grey[100]}
            >
              {row.size}
            </Typography>
          </Box>
        ),
      },
      {
        field: "totalSellCount",
        headerName: "ຍອດຂາຍ",
        headerAlign: "center",
        flex: 0.5,
        renderCell: ({ row }) => (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            <Typography
              fontSize={12}
              fontFamily="Noto Sans Lao"
              color={colors.grey[100]}
            >
              {row.totalSellCount.toLocaleString()} ຈອກ
            </Typography>
          </Box>
        ),
      },
      {
        field: "totalRevenue",
        headerName: "ລວມເປັນຍອດຂາຍ",
        headerAlign: "center",
        flex: 0.5,
        renderCell: ({ row }) => (
          <Box
            display="flex"
            alignItems="center"
            width="100%"
            height="100%"
            justifyContent="center"
          >
            <Typography
              fontSize={12}
              fontFamily="Noto Sans Lao"
              color={colors.grey[100]}
            >
              {row.totalRevenue.toLocaleString()} ກີບ
            </Typography>
          </Box>
        ),
      },
      {
        field: "revenuePercent",
        headerName: "ເປີເຊັນ % ຂອງຍອດຂາຍ",
        headerAlign: "center",
        flex: 0.5,
        sortable: false,
        renderCell: ({ row }) => {
          const percent =
            totalAllRevenue > 0
              ? (row.totalRevenue / totalAllRevenue) * 100
              : 0;

          return (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="100%"
              height="100%"
            >
              <Typography
                fontSize={12}
                fontFamily="Noto Sans Lao"
                color={colors.grey[100]}
              >
                {percent.toFixed(2)} %
              </Typography>
            </Box>
          );
        },
      },
    ],
    [colors, totalAllRevenue]
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

    const sortedRows = [...filteredRows].sort(
      (a, b) => b.totalSend - a.totalSend
    );

    const tableRows = sortedRows
      .map((row, index) => {
        return `<tr>${printableColumns
          .map((col, i) => {
            // ✅ Replace 'id' column with row number
            if (col.field === "id") {
              return `<td>${index + 1}</td>`;
            }
            return `<td>${formatCell(row[col.field])}</td>`;
          })
          .join("")}</tr>`;
      })
      .join("");

    // ✅ Aggregate total from filtered data only

    const rowsForTotal = filteredRows.filter(
      (row) => !excludedStatuses.includes(row.status)
    );

    const totalPriceSend = rowsForTotal.reduce(
      (sum, b) => sum + b.totalPriceSend,
      0
    );
    const totalPriceSell = rowsForTotal.reduce(
      (sum, b) => sum + b.totalPriceSell,
      0
    );
    const totalPriceEXP = rowsForTotal.reduce(
      (sum, b) => sum + b.totalPriceEXP,
      0
    );
    const branchPercent =
      totalPriceSend > 0
        ? ((totalPriceEXP / totalPriceSend) * 100).toFixed(1)
        : 0;
    // ✅ Format date range (based on queryform)
    const start = new Date(queryForm.startDate).toLocaleDateString("lo-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const end = new Date(queryForm.endDate).toLocaleDateString("lo-LA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const excludedText =
      excludedStatuses.length > 0
        ? `ບໍ່ລວມສະຖານະ: ${excludedStatuses.join(", ")}`
        : "ທັງໝົດ";

    console.log(excludedStatuses);
    console.log(totalData);

    const html = `
      <html>
        <head>
          <title>Branch Tracking Report</title>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Lao&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Noto Sans Lao', Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            h2 { text-align: center; }
            h3 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>ລາຍງານສະຫຼຸບຂໍ້ມູນທັງໝົດ (${excludedText})</h2>
           <h3>ວັນທີ: ${start} ຫາ ${end}</h3>
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
    <>
      <Box display="flex" alignItems="center" gap="20px">
        {/* ✅ Multi-select with chips for excluded statuses */}
        ຍອດຂາຍລວມທັງຫມົດທຸກເມນູ{" "}
        <span
          style={{
            fontFamily: "Noto Sans Lao",
            fontSize: 20,
            color: "rgba(0, 240, 24, 1)",
          }}
        >
          {(totalAllRevenue || 0).toLocaleString()} ກີບ
        </span>
        
        <Button
          variant="contained"
          color="info"
          sx={{ fontFamily: "Noto Sans Lao" }}
          disabled={true}
        >
          ປິ່ນລາຍງານ
        </Button>
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-virtualScrollerContent": {
            paddingBottom: "60px",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        <DataGrid
          rows={reportTreekoff || []}
          columns={columns}
          disableRowSelectionOnClick
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontFamily: "Noto Sans Lao",
              fontWeight: "bold",
              fontSize: "15px",
            },
          }}
        />
      </Box>

      {/* Image Modal */}
      <ImageModal ref={imageModalRef} />
    </>
  );
};

export default DataGridReportTreekoff;
