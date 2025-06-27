import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import Header from "../component/Header";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import {
  getAllStaffInfo,
  updateBranchStaffInfo,
  updateRoleStaff,
  updateStatusStaff,
} from "../../api/ManageTeam";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
const URL = import.meta.env.VITE_API_URL;

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const branchs = useFoodBankStorage((state) => state.branchs);
  const getBranch = useFoodBankStorage((state) => state.getBrnachs);
  const [staffsInfo, setStaffsInfos] = useState();
  const user = useFoodBankStorage((state) => state.user);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [openRole, setOpenRole] = useState(false);
  const [selectStaff, setSelectStaff] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [status, setStatus] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [allStaffs, setAllStaffs] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  const handleClickOpenEditBranch = (row) => {
    setOpen(true);
    setSelectStaff(row);
  };

  const handleClickOpenEditStatus = (id, currentStatus) => {
    if (user?.id === id) {
      toast.error("ບໍ່ສາມາດແກ້ໄຂສະຖານະຕົນເອງໄດ້");
      return;
    }
    console.log(currentStatus);
    setStatus(!currentStatus);
    setOpenStatus(true);
    setSelectStaff(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseStatus = () => {
    setOpenStatus(false);
  };

  const getStaff = async () => {
    try {
      const getAllStaffs = await getAllStaffInfo(token);
      if (getAllStaffs?.data?.length > 0) {
        setAllStaffs(getAllStaffs.data); // full copy
        setStaffsInfos(getAllStaffs.data); // current display
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeBranch = async () => {
    try {
      const res = await updateBranchStaffInfo(
        token,
        selectedBranch,
        selectStaff?.id
      );
      setStaffsInfos((prev) =>
        prev.map((staff) =>
          staff.id === selectStaff.id
            ? { ...staff, branch: res?.data?.staff?.branch }
            : staff
        )
      );
      toast.success("ອັປເດດສາຂາສຳເລັດ.");
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມອີກຄັ້ງ");
    }
    handleClose();
  };

  const handleChangeStatus = async () => {
    try {
      const res = await updateStatusStaff(selectStaff, status, token);
      setStaffsInfos((prev) =>
        prev.map((staff) =>
          staff.id === selectStaff
            ? { ...staff, aviable: res?.data?.aviable }
            : staff
        )
      );
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມອີກຄັ້ງ.");
    }
    handleCloseStatus();
  };

  const handleOpenEditRole = (row) => {
    setSelectStaff(row.id);
    setOpenRole(true);
  };

  const handleCloseEditRole = () => {
    setOpenRole(false);
  };

  const handleChangeRoleStaff = async () => {
    try {
      const updateRole = await updateRoleStaff(
        selectStaff,
        selectedRole,
        token
      );
      setStaffsInfos((prev) =>
        prev.map((staff) =>
          staff.id === selectStaff
            ? { ...staff, role: updateRole?.data?.role }
            : staff
        )
      );
      toast.success("ແກ້ໄຂຕຳແໜ່ງສຳເລັດ.");
      handleCloseEditRole();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStaff();
    getBranch();
  }, [token]);

  useEffect(() => {
    if (searchText.trim() === "") {
      setStaffsInfos(allStaffs);
    } else {
      const filtered = allStaffs.filter((staff) => {
        const fullName = `${staff.firstname} ${staff.lastname}`.toLowerCase();
        return (
          staff.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
          staff.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
          fullName.includes(searchText.toLowerCase())
        );
      });
      setStaffsInfos(filtered);
    }
  }, [searchText, allStaffs]);

  const columns = [
    { field: "id", headerName: "ID STAFF" },
    {
      field: "image",
      headerName: "IMAGE",
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URL}/staffimage/${params.row.image}`
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
      field: "fullName",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: ({ row }) => (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="100%"
          height="100%"
        >
          <Typography className="name-column--cell">
            {row.firstname} {row.lastname}
          </Typography>
        </Box>
      ),
    },
    {
      field: "phonenumber",
      headerName: "PHONENUMBER",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "birdDate",
      headerName: "BIRD DATE",
      type: "number",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => {
        const date = new Date(row.birdDate);
        const formattedDate = date.toLocaleDateString("lo-LA"); // or "lo-LA" for Lao format
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Typography fontFamily="Noto Sans Lao">{formattedDate}</Typography>
          </Box>
        );
      },
    },
    {
      field: "role",
      headerName: "ROLE",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (row) => {
        const role = row?.row?.role;
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            gap={1}
          >
            <Typography
              fontFamily="Noto Sans Lao"
              sx={{
                color:
                  role === "admin"
                    ? colors.greenAccent[500]
                    : role === "staff"
                    ? colors.blueAccent[300]
                    : colors.redAccent[500],
              }}
            >
              {role}
            </Typography>
            <AddCircleIcon
              onClick={() => handleOpenEditRole(row?.row)}
              sx={{
                cursor: "pointer",
                borderRadius: "50%", // optional: make it a circle
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e0e0e0", // or any color you like
                  color: colors.grey[800],
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "branch",
      headerName: "BRANCH",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (row) => {
        const Branch = row?.row?.branch;
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            gap={1}
          >
            <Typography fontFamily="Noto Sans Lao">
              {Branch ? Branch.branchname : "ຍັງບໍ່ມີສາຂາ"}
            </Typography>
            <AddCircleIcon
              onClick={() => handleClickOpenEditBranch(row.row)}
              sx={{
                cursor: "pointer",
                borderRadius: "50%", // optional: make it a circle
                transition: "background-color 0.3s ease",
                "&:hover": {
                  backgroundColor: "#e0e0e0", // or any color you like
                  color: colors.grey[800],
                },
              }}
            />
          </Box>
        );
      },
    },
    {
      field: "aviable",
      headerName: "STATUS ACCOUNT",
      headerAlign: "center",
      flex: 0.6,
      renderCell: (row) => {
        const aviable = row?.row?.aviable;
        const staffId = row?.row?.id;
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Button
              variant="contained"
              color={aviable ? "success" : "error"}
              onClick={() => handleClickOpenEditStatus(staffId, aviable)}
            >
              {aviable ? (
                <CheckIcon sx={{ color: "black" }} />
              ) : (
                <ClearIcon sx={{ color: "black" }} />
              )}
            </Button>
          </Box>
        );
      },
    },
  ];

  console.log(staffsInfo);
  return (
    <Box m="20px">
      <Header title="ຈັດການພະນັກງານ" subtitle="ແກ້ໄຂລາຍລະອຽດພະນັກງານ" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
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
        }}
      >
        {/* SEARCH BAR */}
        <Box display="flex" justifyContent={"space-between"}>
          <Box sx={{ alignSelf: "center" }}>
            <Button
              variant="contained"
              sx={{
                bgcolor: colors.blueAccent[300],
                gap: 1,
                color: colors.grey[900],
              }}
            >
              <Typography fontFamily={"Noto Sans Lao"}>
                ເພີ່ມພະນັກງານ
              </Typography>
              <GroupAddIcon />
            </Button>
          </Box>
          <Box
            display="flex"
            backgroundColor={colors.primary[400]}
            borderRadius="3px"
            sx={{ width: "20%", justifySelf: "flex-end" }}
          >
            <InputBase
              sx={{ ml: 2, flex: 1, fontFamily: "Noto Sans Lao" }}
              placeholder="ຄົ້ນຫາພະນັກງານ.."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // ✅ This updates the text state
            />
            <Box sx={{ p: 1 }}>
              <SearchIcon />
            </Box>
          </Box>
        </Box>

        <DataGrid rows={staffsInfo} columns={columns} />
      </Box>

      {/** DIALOG EDIT BRANCH PART */}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: "500px", // set your desired width
            height: "250px", // set your desired height
            maxWidth: "none", // disable default maxWidth limit
            fontFamily: "Noto Sans Lao",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontFamily: "Noto Sans Lao",
            textAlign: "center",
            fontSize: 25,
          }}
        >
          {"ເລືອກສາຂາ"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, color: colors.grey[100] }}>
            <InputLabel
              id="branch-select-label"
              sx={{ fontFamily: "Noto Sans Lao", color: colors.grey[100] }}
            >
              ເລືອກສາຂາ
            </InputLabel>

            <Select
              labelId="branch-select-label"
              value={selectedBranch}
              label="ເລືອກສາຂາ"
              onChange={(e) => setSelectedBranch(e.target.value)}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              {branchs?.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item?.id}
                  sx={{ fontFamily: "Noto Sans Lao" }}
                >
                  {item?.branchname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          <Button
            onClick={handleChangeBranch}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
          >
            ສົ່ງຟອມ
          </Button>
          <Button
            onClick={handleClose}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** DIALOG EDIT STATUS PART */}

      <Dialog
        open={openStatus}
        onClose={handleCloseStatus}
        PaperProps={{
          sx: {
            width: "400px", // set your desired width
            height: "160px", // set your desired height
            maxWidth: "none", // disable default maxWidth limit
            fontFamily: "Noto Sans Lao",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontFamily: "Noto Sans Lao",
            textAlign: "center",
            fontSize: 25,
          }}
        >
          {"ແກ້ໄຂສິດ ພະນັກງານ"}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          <Button
            onClick={handleChangeStatus}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleCloseStatus}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 20 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** DIALOG EDIT ROLE STAFF PART */}

      <Dialog
        open={openRole}
        onClose={handleCloseEditRole}
        PaperProps={{
          sx: {
            width: "400px", // set your desired width
            height: "220px", // set your desired height
            maxWidth: "none", // disable default maxWidth limit
            fontFamily: "Noto Sans Lao",
          },
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontFamily: "Noto Sans Lao",
            textAlign: "center",
            fontSize: 25,
          }}
        >
          {"ແກ້ໄຂຕຳແໜ່ງພະນັກງານ"}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, color: colors.grey[100] }}>
            <InputLabel
              id="branch-select-label"
              sx={{ fontFamily: "Noto Sans Lao", color: colors.grey[100] }}
            >
              ເລືອກຕຳແໜ່ງ
            </InputLabel>

            <Select
              labelId="role-select-label"
              value={selectedRole}
              label="ເລືອກຕຳແໜ່ງ"
              onChange={(e) => setSelectedRole(e.target.value)}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              <MenuItem value={"staff"} sx={{ fontFamily: "Noto Sans Lao" }}>
                staff
              </MenuItem>
              <MenuItem value={"admin"} sx={{ fontFamily: "Noto Sans Lao" }}>
                admin
              </MenuItem>

              <MenuItem
                value={"supervisor"}
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                supervisor
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          <Button
            onClick={handleChangeRoleStaff}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleCloseEditRole}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 15 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

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
                height: "800px",
                maxHeight: "90vh",
                overflow: "hidden",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/**Toastify Part */}
      <ToastContainer position="top-center" />
    </Box>
  );
};

export default Team;
