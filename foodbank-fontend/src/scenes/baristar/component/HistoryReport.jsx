import { Box, Pagination, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SendIcon from "@mui/icons-material/Send";
import HistoryIcon from "@mui/icons-material/History";
import axios from "axios";
import { getReportBaristar } from "../../../api/baristar";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import DialogDetailReport from "./DialogDetailReport";

const URLSTAFF =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

const URL =
  "https://treekoff-storage-track-image.s3.ap-southeast-2.amazonaws.com";

const HistoryReport = () => {
  const user = useFoodBankStorage((s) => s.user);
  const token = useFoodBankStorage((s) => s.token);
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  const fetchReports = async (pageNum) => {
    try {
      setLoading(true);
      const res = await getReportBaristar(
        {
          branchId: user.userBranch,
          page: pageNum,
          limit: 3,
        },
        token
      );

      setReports(res.data.data);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };


  return (
    <>
      <Box
        sx={{
          top: 20,
          left: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          zIndex: 1000,
        }}
      >
        {" "}
        <Box
          sx={{
            top: 20,
            left: 20,
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: 1000,
          }}
        >
          <img
            src={`${URLSTAFF}/${user?.image}`}
            alt="User Avatar"
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", ml: 1 }}>
            <Typography
              sx={{
                fontFamily: "Noto Sans Lao",
                fontSize: 18,
                color: "#ffffffaf",
                fontWeight: 500,
              }}
            >
              {user?.branchName}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Noto Sans Lao",
                fontSize: 12,
                color: "#f7f7f7a1",
              }}
            >
              {user?.firstname} {user?.lastname}
            </Typography>
          </Box>
        </Box>{" "}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            mt: 4,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 25 }}>
            ແຈ້ງເບເກີລີ້ຜິດປົກກະຕິ
          </Typography>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
              mt: 2,
              height: "100%",
              minHeight: 300,
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {/* Back Button */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
                cursor: "pointer",
                width: "fit-content",
              }}
              onClick={() => navigate("/baristar/comment")}
            >
              <ArrowBackIosNewIcon sx={{ fontSize: 20, ml: 2 }} />
              <Typography sx={{ fontFamily: "Noto Sans Lao", fontSize: 16 }}>
                ຍ້ອນກັບ
              </Typography>
            </Box>
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
                  const firstImage =
                    item.imageReportBaristar?.[0]?.image || null;

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
                          }}
                        >
                          {item.product?.name}
                        </Typography>

                        <Typography
                          sx={{
                            fontFamily: "Noto Sans Lao",
                            fontSize: 13,
                            color: "#555",
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
                <DialogDetailReport
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
          </List>
        </Box>
      </Box>
    </>
  );
};

export default HistoryReport;
