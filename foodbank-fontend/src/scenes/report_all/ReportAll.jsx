import { useEffect, useMemo, useRef, useState } from "react";
import { tokens } from "../../theme";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
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

const allStatuses = ["A", "B", "F", "LPB A", "LPB B", "LPB F"];

const ReportAll = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const totalData = useFoodBankStorage((state) => state.totalData);
  const imageModalRef = useRef();
  const queryForm = useFoodBankStorage((s) => s.queryForm);

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  // ✅ Multiple select: statuses to exclude
  const [excludedStatuses, setExcludedStatuses] = useState([]);

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

  // ✅ Filter rows based on excluded statuses
  const filteredRows = useMemo(() => {
    if (!excludedStatuses.length) return rowsWithPercent;
    return rowsWithPercent.filter(
      (item) => !excludedStatuses.includes(item.status)
    );
  }, [rowsWithPercent, excludedStatuses]);

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
        field: "status",
        headerName: "ສະຖານະ",
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
              {row.status}
            </Typography>
          </Box>
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
        headerAlign: "center",
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

  // ✅ Updated print to reflect excluded statuses
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

            {/* ✅ Multi-select with chips for excluded statuses */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel sx={{ fontFamily: "Noto Sans Lao" }}>
                ບໍ່ລວມສະຖານະ
              </InputLabel>
              <Select
                multiple
                value={excludedStatuses}
                onChange={(e) => setExcludedStatuses(e.target.value)}
                input={<OutlinedInput label="ບໍ່ລວມສະຖານະ" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        sx={{ fontFamily: "Noto Sans Lao" }}
                      />
                    ))}
                  </Box>
                )}
              >
                {allStatuses.map((status) => (
                  <MenuItem
                    key={status}
                    value={status}
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
            autoHeight
            rows={filteredRows}
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
      </Box>

      {/* Image Modal */}
      <ImageModal ref={imageModalRef} />
    </Box>
  );
};

export default ReportAll;
