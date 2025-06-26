import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import Calendar from "./component/Calendar";
import SelectBranch from "./component/SelectBranch";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import { toast, ToastContainer } from "react-toastify";
import useFoodBankStorage from "../../zustand/foodbank-storage";

const Tracksend = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const user = useFoodBankStorage((state) => state.user);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectFormtracksell, setSelectFormtracksell] = useState({
    sendCount: "",
    sendAt: "",
    userId: user.id,
    productId: "",
    brachId: "",
  });
  const [selectDateBrachCheck, setSelectDateBrachCheck] = useState({
    sendDate: "",
    brachId: "",
  });

  const handeDeleteAll = async () => {
    try {
    } catch (err) {
      console.log(err);
      toast.error("error");
    }
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  return (
    <Box m="20px" textAlign="center">
      <Header title="ຄີຍອດສົ່ງແຕ່ລະສາຂາ" />
      <Box
        mt="30px"
        display="grid"
        gridTemplateColumns="repeat(1, 20fr)"
        gridAutoRows="60px"
        gap="20px"
      >
        {/** Section 1  select calendar and select branches. */}

        <Box gridColumn="span 1" backgroundColor={colors.primary[400]}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            <Box>
              <Calendar
                selectFormtracksell={selectFormtracksell}
                setSelectFormtracksell={setSelectFormtracksell}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>
            <Box>
              <SelectBranch
                selectFormtracksell={selectFormtracksell}
                setSelectFormtracksell={setSelectFormtracksell}
                setSelectDateBrachCheck={setSelectDateBrachCheck}
              />
            </Box>
            <Box>
              <Button variant="contained" onClick={handeDeleteAll}>
                <Typography variant="laoText"> ລ້າງຂໍມູນທີ່ຄີມື້ນິ້</Typography>
              </Button>
            </Box>
          </Box>
        </Box>

        {/**Section 2 insert data */}

        <Box
          sx={{
            height: "100vh",
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
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
          {selectFormtracksell.sellAt && selectFormtracksell.brachId ? (
            <DataGrid
              rows={products.filter((product) =>
                product.avilableproduct?.some(
                  (item) =>
                    item.aviableStatus === true &&
                    item.brachId === selectFormtracksell.brachId
                )
              )}
              columns={columns}
              autoHeight
              sx={{ width: "100%" }}
            />
          ) : (
            <Typography
              variant="laoText"
              fontWeight="bold"
              color={colors.grey[100]}
            >
              "ເລືອກວັນທີ່ ແລະ ສາຂາທີ່ຕ້ອງການເພີ່ມຂໍ້ມູນ"
            </Typography>
          )}
        </Box>
      </Box>
      {/** image modal */}
      <Dialog
        open={openImageModal}
        onClose={handleCloseImageModal}
        maxWidth="md"
      >
        <DialogContent sx={{ position: "relative", padding: "0" }}>
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "white",
              "&:hover": { backgroundColor: "gray" },
            }}
          >
            <CloseIcon sx={{ color: "black" }} />
          </IconButton>
          {selectedImageUrl && (
            <img
              src={selectedImageUrl}
              alt="Large Preview"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* Snackbar for success message */}

      <ToastContainer position="top-center" />
    </Box>
  );
};

export default Tracksend;
