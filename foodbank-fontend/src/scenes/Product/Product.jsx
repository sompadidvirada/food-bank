import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import { DataGrid } from "@mui/x-data-grid";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import CloseIcon from "@mui/icons-material/Close";
import { NumericFormat } from "react-number-format";
import ProductDetail from "./component/ProductDetail";
import EditProduct from "./component/EditProduct";
import DeleteProduct from "./component/DeleteProduct";
import AddProduct from "./component/AddProduct";
import AddCategory from "./component/AddCategory";
import DeleteCategory from "./component/DeleteCategory";
const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const Product = () => {
  {
    /**import theme setting */
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  {
    /** create normal state */
  }

  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  {
    /** import function or varible from zustand */
  }

  const token = useFoodBankStorage((state) => state.token);
  const products = useFoodBankStorage((state) => state.products);
  const getProduct = useFoodBankStorage((state) => state.getProduct);
  const branch = useFoodBankStorage((state) => state.branchs);
  const user = useFoodBankStorage((state) => state.user);

  {
    /** column for DataGrid */
  }
  const columns = [
    { field: "id", headerName: "ໄອດີ", flex: 0.1 },
    {
      field: "image",
      headerName: "ຮູບພາບ",
      flex: 0.3,
      renderCell: (params) => {
        const imageUrl = params.row.image
          ? `${URL}/${params.row?.image}`
          : null;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
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
      type: "text",
      headerAlign: "left",
      flex: 0.5,
      align: "left",
      renderCell: (params) => (
        <Typography
          variant="laoText"
          fontWeight="bold"
          color={colors.grey[100]}
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
            "&:hover": { color: colors.greenAccent[400] },
          }}
          onClick={() => handleOpenDetailDialog(params.row)}
        >
          {params?.value}
        </Typography>
      ),
    },
    {
      field: "category",
      headerName: "ໝວດໝູ່ສິນຄ້າ",
      type: "text",
      headerAlign: "left",
      flex: 0.3,
      align: "left",
      renderCell: (params) => {
        return params.row.category ? (
          <Typography
            variant="laoText"
            fontWeight="bold"
            color={colors.grey[100]}
          >
            {params.row.category.name}
          </Typography>
        ) : (
          "No Category"
        );
      },
    },
    {
      field: "price",
      headerName: "ລາຄາຕົ້ນທຶນ",
      flex: 0.3,
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType="text"
          thousandSeparator={true}
          prefix="₭  " // or any currency symbol you'd like
          decimalScale={0} //
          fixedDecimalScale={true}
        />
      ),
    },
    {
      field: "sellprice",
      headerName: "ລາຄາຂາຍ",
      flex: 0.3,
      renderCell: (params) => (
        <NumericFormat
          value={params.value}
          displayType="text"
          thousandSeparator={true}
          prefix="₭  "
          decimalScale={0}
          fixedDecimalScale={true}
        />
      ),
    },
    {
      field: "lifetime",
      headerName: "ອາຍຸສິນຄ້າ",
      flex: 0.2,
    },
    {
      field: "status",
      headerName: "ສະຖານະ",
      flex: 0.2,
    },
    {
      field: "manage",
      headerName: "ຈັດການ",
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around" width="100%">
          {/* Show EditIcon to everyone */}
            <EditProduct productRow={params.row} />
          {user?.role === "admin" && <DeleteProduct productRow={params.row} />}
        </Box>
      ),
    },
  ];

  {
    /** create other variable or filter function for varialbe */
  }

  const productWBracnh = products?.map((product) => ({
    ...product,
    available: product.available.map((item) => {
      const branchs = branch?.find((b) => b.id === item.branchId);
      return {
        ...item,
        branchName: branchs ? branchs.branchname : null,
      };
    }),
  }));

  {
    /** useEffect zone */
  }

  useEffect(() => {
    getProduct();
  }, []);

  {
    /* image modal function*/
  }

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl(null);
  };

  {
    /** open dialog detail product available status function */
  }

  const handleOpenDetailDialog = (product) => {
    setSelectedProduct(product);
    setOpenDetailDialog(true);
  };

  return (
    <Box ml="20px">
      <Header title="ລາຍການສິນຄ້າ" subtitle="ຈັດການລາຍການສິນຄ້າ" />
      <Box display={"flex"} gap={5} justifyContent={"center"}>
        <AddProduct />
        <AddCategory />
        <DeleteCategory />
      </Box>
      <Box
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
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={productWBracnh}
          columns={columns}
          hideFooter
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              fontFamily: "Noto Sans Lao",
              fontWeight: "bold", // optional
              fontSize: "16px", // optional
            },
          }}
        />
      </Box>

      {/** image modal dialog */}

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
                height: "800px",
                maxHeight: "90vh",
                overflow: "hidden",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/**Product detail dialog */}

      <ProductDetail
        openDetailDialog={openDetailDialog}
        setOpenDetailDialog={setOpenDetailDialog}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />
    </Box>
  );
};

export default Product;
