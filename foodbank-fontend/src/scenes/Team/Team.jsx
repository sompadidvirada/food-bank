import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Box,
  FormControl,
  IconButton,
  InputBase,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Formik } from "formik";
import * as yup from "yup";
import { clearPasswordStaff, createStaff, deleteStaff } from "../../api/authen";
import KeyOffIcon from "@mui/icons-material/KeyOff";
import axios from "axios";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ImageModal from "../../component/ImageModal";
const URL =
  "https://treekoff-store-staff-image.s3.ap-southeast-2.amazonaws.com";

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
  const [allStaffs, setAllStaffs] = useState([]);
  const [openCreateStaff, setOpenCreateStaff] = useState(false);
  const fileInputRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [openDeleteStaff, setOpenDeleteStaff] = useState(false);
  const [selectIdStaffToDelete, setSelectIdStaffToDelete] = useState("");
  const [openClearPassword, setOpenClearPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const typeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/jpg": "jpg",
    "image/webp": "webp",
  };

  const randomImage = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Secure random numbers
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const imageModalRef = useRef();

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const handleOpenClearPassword = (row) => {
    setOpenClearPassword(true);
    setSelectIdStaffToDelete(row);
  };

  const handleCloseClearPassword = () => {
    setOpenClearPassword(false);
    setSelectIdStaffToDelete("");
  };

  const handleClearPassword = async () => {
    try {
      const ress = await clearPasswordStaff(selectIdStaffToDelete.id, token);
      console.log(ress);
      toast.success(ress.data.message);
      handleCloseClearPassword();
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫຼັງ");
    }
  };

  const handleOpenDeleteStaff = (row) => {
    setOpenDeleteStaff(true);
    setSelectIdStaffToDelete(row);
  };

  const hadleCloseDeleteStaff = () => {
    setOpenDeleteStaff(false);
    setSelectIdStaffToDelete("");
  };

  const handleOpenCreateStaff = () => {
    setOpenCreateStaff(true);
  };
  const handleCloseCreateStaff = () => {
    setOpenCreateStaff(false);
  };

  const handleFormSubmit = async (values, { resetForm }) => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      handleCloseCreateStaff(); // Close the dialog just after backdrop shows
    }, 50); // 50ms is usually enough
    try {
      let imageStaff = null;
      let contentType = null;

      // If an image is selected
      if (values.profileImage) {
        const file = values.profileImage;
        const extension = typeToExtension[file.type];
        if (!extension) throw new Error("Unsupported file type");

        imageStaff = `${randomImage()}.${extension}`; // generate name
        contentType = file.type; // e.g., "image/png"
      }

      // Send as plain JSON object
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        phonenumber: values.phonenumber,
        birthDate: values.birthDate,
        imageStaff, // example: "abc123.jpg"
        contentType, // example: "image/png"
      };

      const res = await createStaff(payload, token);
      console.log(res);

      if (res.data.imageUploadUrl) {
        await axios.put(res.data.imageUploadUrl, values.profileImage, {
          headers: {
            "Content-Type": contentType,
          },
        });
      }

      resetForm();
      setPreviewImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.log("Error during submit:", err);
    } finally {
      setIsUploading(false); // Hide backdrop
    }
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

  const hadleDeleteStaff = async () => {
    setIsUploading(true); // Show backdrop first

    setTimeout(() => {
      hadleCloseDeleteStaff();
    }, 50); // 50ms is usually enough
    try {
      const res = await deleteStaff(
        {
          staffId: selectIdStaffToDelete.id,
          permisionId: user.id,
        },
        token
      );
      toast.success("ລົບຢູ່ເຊີສຳເລັດ");
      // Remove the deleted staff from the store
      setStaffsInfos((prev) =>
        prev.filter((staff) => staff.id !== selectIdStaffToDelete.id)
      );
    } catch (err) {
      console.log(err);
      hadleCloseDeleteStaff();
      toast.error(`ລອງໄໝ່ພາຍຫຼັງ`);
    } finally {
      setIsUploading(false); // Hide backdrop
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
    { field: "id", headerName: "ໄອດີ" },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URL}/${params.row.image}`
          : `${URL}/default-user.png`;
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
      headerName: "ຊື່ພະນັກງານ",
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
      headerName: "ເບີໂທລະສັບ",
      type: "number",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "birdDate",
      headerName: "ວັນທີ່ເກີດ",
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
      headerName: "ຕຳແໜ່ງ",
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
      headerName: "ສາຂາ",
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
      headerName: "ສະຖານະ ຢູເຊີ",
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
    {
      field: "manage",
      headerName: "ຈັດການ",
      headerAlign: "center",
      flex: 0.6,
      renderCell: (row) => {
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="100%"
          >
            <Tooltip
              title="ລົບຢູເຊີພະນັກງານ"
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Noto Sans Lao", // or any font you prefer
                    color: "#fff",
                    backgroundColor: "#333", // optional
                  },
                },
              }}
            >
              <IconButton onClick={() => handleOpenDeleteStaff(row.row)}>
                <PersonRemoveIcon sx={{ color: colors.redAccent[400] }} />
              </IconButton>
            </Tooltip>

            <Tooltip
              title="ລ້າງລະຫັດຜ່ານ"
              arrow
              placement="top"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: "14px",
                    fontFamily: "Noto Sans Lao", // or any font you prefer
                    color: "#fff",
                    backgroundColor: "#333", // optional
                  },
                },
              }}
            >
              <IconButton onClick={() => handleOpenClearPassword(row.row)}>
                <KeyOffIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

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
              onClick={handleOpenCreateStaff}
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

        <DataGrid
          rows={staffsInfo}
          columns={columns}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontFamily: "Noto Sans Lao",
              fontWeight: "bold", // optional
              fontSize: "16px", // optional
            },
          }}
        />
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
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 13 }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleCloseStatus}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 13 }}
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

      {/** DIALOG CREATE STAFF */}

      <Dialog
        fullWidth
        open={openCreateStaff}
        onClose={handleCloseStatus}
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
          {"ສ້າງຢູເຊີພະນັກງານ"}
        </DialogTitle>
        <DialogContent>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box
                  display="grid"
                  gap="30px"
                  gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                  sx={{
                    "& > div": {
                      gridColumn: "span 4",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={<Typography variant="laoText">ຊື່</Typography>}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.firstName}
                    name="firstName"
                    error={!!touched.firstName && !!errors.firstName}
                    helperText={touched.firstName && errors.firstName}
                    sx={{ gridColumn: "span 2", fontFamily: "Noto Sans Lao" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={<Typography variant="laoText">ນາມສະກຸນ</Typography>}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.lastName}
                    name="lastName"
                    error={!!touched.lastName && !!errors.lastName}
                    helperText={touched.lastName && errors.lastName}
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label={<Typography variant="laoText">ເບີໂທ</Typography>}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.phonenumber}
                    name="phonenumber"
                    error={!!touched.phonenumber && !!errors.phonenumber}
                    helperText={touched.phonenumber && errors.phonenumber}
                    sx={{ gridColumn: "span 4" }}
                  />

                  {/* Date Picker for Birth Date */}
                  <TextField
                    fullWidth
                    variant="filled"
                    type="date"
                    label={
                      <Typography variant="laoText">
                        ວັນ ເດືອນ ປິ ເກີດ
                      </Typography>
                    }
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.birthDate}
                    name="birthDate"
                    error={!!touched.birthDate && !!errors.birthDate}
                    helperText={touched.birthDate && errors.birthDate}
                    InputLabelProps={{ shrink: true }}
                    sx={{ gridColumn: "span 4" }}
                  />
                  {/* Image Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      setFieldValue("profileImage", file);

                      // Preview image
                      const reader = new FileReader();
                      reader.onloadend = () => setPreviewImage(reader.result);
                      if (file) reader.readAsDataURL(file);
                    }}
                    style={{ gridColumn: "span 4", marginBottom: "10px" }}
                  />

                  {/* Image Preview */}
                  {previewImage && (
                    <Box
                      display="flex"
                      position="relative"
                      sx={{ width: "100px", height: "100px" }}
                    >
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                      <CloseIcon
                        sx={{
                          position: "absolute",
                          right: "0",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setPreviewImage(null);
                          setFieldValue("profileImage", null); // Clear Formik's state
                          if (fileInputRef.current) {
                            fileInputRef.current.value = ""; // Reset file input
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <Box display="flex" justifyContent="end" mt="20px" gap={3}>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
                    ຢືນຢັນ
                  </Button>
                  <Button
                    onClick={handleCloseCreateStaff}
                    color="error"
                    variant="contained"
                    sx={{ fontFamily: "Noto Sans Lao" }}
                  >
                    ຍົກເລີກ
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/** DIALOG CONFIRM DELETE STAFF */}

      <Dialog
        open={openDeleteStaff}
        onClose={hadleCloseDeleteStaff}
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
          {`ຕ້ອງການລົບຢູເຊີ ${selectIdStaffToDelete?.firstname} ${selectIdStaffToDelete?.lastname}ແທ້ບໍ່`}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          <Button
            onClick={hadleDeleteStaff}
            autoFocus
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={hadleCloseDeleteStaff}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** DIALOG CONFRIM CLEAR PASSWORD */}

      <Dialog
        open={openClearPassword}
        onClose={handleCloseClearPassword}
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
          {`ຕ້ອງການລາ້ງລະຫັດ ${selectIdStaffToDelete?.firstname} ${selectIdStaffToDelete?.lastname}ແທ້ບໍ່`}
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions
          sx={{ display: "flex", gap: 2, justifyContent: "center" }}
        >
          <Button
            onClick={handleClearPassword}
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
          >
            ຢືນຢັນ
          </Button>
          <Button
            onClick={handleCloseClearPassword}
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao", fontSize: 12 }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>

      {/** image modal */}
      <ImageModal ref={imageModalRef} />

      {/**Toastify Part */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  phonenumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  birthDate: yup.date().required("Birth date is required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  phonenumber: "",
  birthDate: "",
  profileImage: null,
};

export default Team;
