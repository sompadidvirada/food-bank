import { Box, IconButton, useTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { tokens } from "../../../theme";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { deleteProduct } from "../../../api/product";

const DeleteProduct = ({ productRow }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token);
  const getProduct = useFoodBankStorage((state) => state.getProduct);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      const deletePro = await deleteProduct(productRow.id, token);
      getProduct();
      setOpenConfirm(false); // Close the dialog after deletion
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box>
      <IconButton onClick={() => setOpenConfirm(true)}>
        <DeleteIcon
          sx={{
            cursor: "pointer",
            color: colors.redAccent[500],
            "&:hover": {
              color: colors.redAccent[700],
            },
          }}
        />
      </IconButton>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{productRow.name}</strong>?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="success" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteProduct;
