import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextareaAutosize,
  Box,
  styled,
  Typography,
  IconButton,
  Backdrop,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import ImageModal from "../../../component/ImageModal";
import CloseIcon from "@mui/icons-material/Close";
import useFoodBankStorage from "../../../zustand/foodbank-storage";
import { sendReportBaristar } from "../../../api/baristar";

const URL =
  "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DialogSendComment = ({ setOpenDialog, openDialog }) => {
  const [description, setDescription] = useState("");
  const [choice1, setChoice1] = useState("");
  const [choice2, setChoice2] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const imageModalRef = useRef();
  const user = useFoodBankStorage((s) => s.user);
  const products = useFoodBankStorage((s) => s.products);
  const token = useFoodBankStorage((s) => s.token);

  const filteredProducts = products?.filter(
    (product) =>
      product.available.some(
        (a) => a.branchId === user.userBranch && a.aviableStatus === true
      ) && product.status !== false
  );

  const handleImageClick = (url) => {
    imageModalRef.current.openModal(url);
  };

  const randomImage = (length = 32) => {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array); // Secure random numbers
    return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    );
  };

  const typeToExtension = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = [];
    const newImages = [];

    files.forEach((file) => {
      const extension = typeToExtension[file.type];
      if (!extension) {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
      const imageName = `${randomImage()}.${extension}`;
      newImages.push({ file, name: imageName });

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        // Once all previews are read, update state
        if (newPreviews.length === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
          setSelectedImages((prev) => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSendReport = async () => {
    if (selectedImages.length === 0) return;

    setIsUploading(true);

    const formData = new FormData();
    // Rename before sending
    const renamedFiles = selectedImages.map((img) => {
      const file = img.file;
      const extension = file.name.split(".").pop();
      const randomName = `${randomImage()}.${extension}`;
      return new File([file], randomName, { type: file.type });
    });

    renamedFiles.forEach((file) => formData.append("images", file));

    try {
      formData.append("productsId", choice1);
      formData.append("title", choice2);
      formData.append("description", description);
      formData.append("branchId", user.userBranch);
      formData.append("staffId", user.id);

      const ress = await sendReportBaristar(formData, token);
      toast.success("success!");
    } catch (err) {
      console.error("failed", err);
      toast.error("ລອງໃຫ່ມອີກຄັ້ງ.", err);
    } finally {
      setIsUploading(false);
      setOpenDialog(false);
      setSelectedImages([]);
      setImagePreviews([]);
      setDescription("");
      setChoice1("");
      setChoice2("");
    }
  };

  return (
    <>
      {" "}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>
          ລາຍລະອຽດບັນຫາ
        </DialogTitle>

        <DialogContent sx={{ mt: 1 }}>
          {/* Text input */}

          {/* Select 1 */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel sx={{ fontFamily: "Noto Sans Lao" }} required>
              ຂະໝົມທີ່ຈະລາຍງານ
            </InputLabel>
            <Select
              value={choice1}
              onChange={(e) => setChoice1(e.target.value)}
              renderValue={(choice1) => {
                const product = filteredProducts.find((p) => p.id === choice1);
                if (!product) return null;

                return (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={`${URL}/${product.image}`}
                      alt={product.name}
                      sx={{ width: 50, height: 50 }}
                      variant="rounded"
                    />
                    {product.name}
                  </Box>
                );
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: 300,
                    width: 350,
                  },
                },
              }}
            >
              {filteredProducts?.map((product) => {
                return (
                  <MenuItem key={product.id} value={product.id}>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <Avatar
                        src={`${URL}/${product.image}`}
                        alt={product.name}
                        sx={{ width: 50, height: 50 }}
                        variant="rounded"
                      />
                      {product.name}
                    </Box>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          {/* Select 2 */}
          <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel sx={{ fontFamily: "Noto Sans Lao" }} required>
              ຫົວຂໍ້ການແຈ້ງ
            </InputLabel>
            <Select
              value={choice2}
              label="ຫົວຂໍ້ການແຈ້ງ"
              onChange={(e) => setChoice2(e.target.value)}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              <MenuItem
                value="ລົດຊາດເຂົ້າໝົມຜິດປົກກະຕິ"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ລົດຊາດເຂົ້າໝົມຜິດປົກກະຕິ
              </MenuItem>
              <MenuItem
                value="ຮູບຊົງຂະໝົມຜິດປົກກະຕິ"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ຮູບຊົງຂະໝົມຜິດປົກກະຕິ
              </MenuItem>
              <MenuItem
                value="ມີສິ່ງຂອງອື່ນປະປົນໃນຂະໜົມ"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ມີສິ່ງຂອງອື່ນປະປົນໃນຂະໜົມ
              </MenuItem>
              <MenuItem
                value="ຂະໝົມໝົດອາຍຸກ່ອນເວລາທີ່ກຳນົດ"
                sx={{ fontFamily: "Noto Sans Lao" }}
              >
                ຂະໝົມໝົດອາຍຸກ່ອນເວລາທີ່ກຳນົດ
              </MenuItem>
            </Select>
          </FormControl>

          <Box
            sx={{
              "& textarea::placeholder": {
                color: "#9e9e9e",
                fontFamily: "Noto Sans Lao",
                fontSize: 14,
              },
            }}
          >
            <TextareaAutosize
              minRows={4}
              value={description}
              placeholder="ລາຍລະອຽດ......"
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", marginTop: 16 }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 3 }}>
            <Button
              component="label"
              variant="contained"
              color="info"
              startIcon={<CloudUploadIcon />}
              sx={{ fontFamily: "Noto Sans Lao" }}
            >
              ເພີ່ມຮູບພາບ
              <VisuallyHiddenInput
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                capture="environment"
              />
            </Button>{" "}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              {imagePreviews.length > 0 ? (
                imagePreviews.map((preview, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 85,
                      height: 85,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => {
                        // remove only the clicked image
                        setImagePreviews((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                        setSelectedImages((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                      sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 1,
                        backgroundColor: "rgba(0,0,0,0.4)",
                        color: "#fff",
                        "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>

                    <img
                      src={preview}
                      alt={`Selected ${index}`}
                      onClick={() => handleImageClick(preview)}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>
                ))
              ) : (
                // Fallback layout
                <Box
                  sx={{
                    width: 85,
                    height: 85,
                    border: "2px dashed #aaa",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 30, mb: 1 }} />
                  <Typography variant="laoText">ບໍ່ມີຮູບພາບ</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isUploading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            color="error"
          >
            ກັບຄຶນ
          </Button>
          <Button
            variant="contained"
            onClick={handleSendReport}
            sx={{ fontFamily: "Noto Sans Lao" }}
            color="success"
          >
            ສົ່ງຟອມ
          </Button>
        </DialogActions>
      </Dialog>
      {/** image modal */}
      <ImageModal ref={imageModalRef} />
    </>
  );
};

export default DialogSendComment;
