import {
  Box,
  ListItemButton,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import { getAllReports } from "../../api/baristar";
import CircularProgress from "@mui/material/CircularProgress";
import DialogDetailAdmin from "./component/DialogDetailAdmin";

const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const TrackReport = () => {
  const [reports, setReports] = useState([]);
  const token = useFoodBankStorage((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const fecthAllReports = async (pageNum) => {
    setLoading(true);
    try {
      const ress = await getAllReports(
        {
          page: pageNum,
          limit: 5,
        },
        token
      );
      setReports(ress.data.data);
      setTotalPages(ress.data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fecthAllReports(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box m="20px">
      <Header
        title="ຕິດຕາມການແຈ້ງຈາກສາຂາ"
        subtitle="ເປັນການຕິດຕາມລາຍລະອຽດການແຈ້ງຄວາມຜິດປົກກະຕິຂອງເບເກີລີ້ທີ່ຈັດສົ່ງໃຫ້ສາຂາ."
      />
      <Box m={2}>
        <Paper
          sx={{
            width: "100%",
            height: "auto", // allow full content height
            boxShadow: 2,
            p: 1,
          }}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
              }}
            >
              <CircularProgress
                size={60}
                thickness={5}
                sx={{
                  color: "#00b0ff", // bright cyan blue, visible in dark
                }}
              />
            </Box>
          ) : (
            <>
              {reports.map((item) => {
                const firstImage = item.imageReportBaristar?.[0]?.image || null;

                return (
                  <ListItemButton
                    key={item.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      border: "1px solid #dddddd2f",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                      p: 2,
                    }}
                   onClick={() => {
                        setSelectedReport(item);
                        setImageIndex(0); // reset to first image
                        setOpenDialog(true);
                      }}
                  >
                    {/* IMAGE */}
                    {firstImage && (
                      <img
                        src={`${URL}/${firstImage}`}
                        alt="report"
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 8,
                          objectFit: "cover",
                        }}
                      />
                    )}

                    {/* TEXT */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: "Noto Sans Lao",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "rgba(5, 151, 255, 0.67)",
                        }}
                      >
                        {item.branch?.branchname}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Noto Sans Lao",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {item.product?.name}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Noto Sans Lao",
                          fontSize: 13,
                          color: "#b1b1b1ff",
                        }}
                      >
                        {item.title}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Noto Sans Lao",
                          fontSize: 12,
                          color: "#777",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 240,
                        }}
                      >
                        {item.description}
                      </Typography>

                      <Typography
                        sx={{
                          fontFamily: "Noto Sans Lao",
                          fontSize: 11,
                          color: "#999",
                          mt: 0.5,
                        }}
                      >
                        {new Date(item.date).toLocaleString("en-GB")}
                      </Typography>
                    </Box>
                  </ListItemButton>
                );
              })}

              <DialogDetailAdmin
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                selectedReport={selectedReport}
                setImageIndex={setImageIndex}
                imageIndex={imageIndex}
              />
              {/* PAGINATION */}
              <Stack spacing={2} sx={{ mt: 2, alignItems: "center" }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                />
              </Stack>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TrackReport;
