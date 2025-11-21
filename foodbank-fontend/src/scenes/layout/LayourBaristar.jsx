import { AppBar, Toolbar, Container, IconButton, Box } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import BakeryDiningSharpIcon from '@mui/icons-material/BakeryDiningSharp';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';

const LayourBaristar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  return (
    <>
      <Container sx={{ mt: 4, mb: 10 }}>
        <Outlet />
      </Container>
      <AppBar
        position="fixed"
        sx={{
          top: "auto",
          bottom: 0,
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 1)",
        }}
      >
        <Toolbar sx={{ display: "flex", p: 0, height: "64px" }}>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid #ddd", // border between buttons
            }}
            onClick={() => navigate("/baristar/order")}
          >
            <IconButton color="inherit">
              <BakeryDiningSharpIcon
                sx={{
                  fontSize: 30,
                  color: isActive("/baristar/order")
                    ? "rgba(0, 0, 0, 1)"
                    : "rgba(0, 0, 0,  0.44)",
                }}
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid #ddd", // border between buttons
            }}
            onClick={() => navigate("/baristar/comment")}
          >
            <IconButton color="inherit">
              <MarkUnreadChatAltIcon
                sx={{
                  fontSize: 30,
                  color: isActive("/baristar/comment")
                    ? "rgba(0, 0, 0, 1)"
                    : "rgba(0, 0, 0,  0.44)",
                }}
              />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRight: "1px solid #ddd",
            }}
            onClick={() => navigate("/baristar/image")}
          >
            <IconButton color="inherit">
              <CameraAltIcon
                sx={{
                  fontSize: 30,
                  color: isActive("/baristar/image")
                    ? "rgba(0, 0, 0, 1)"
                    : "rgba(0, 0, 0,  0.44)",
                }}
              />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => navigate("/baristar")}
          >
            <IconButton color="inherit">
              <PersonIcon
                sx={{
                  fontSize: 30,
                  color: isActive("/baristar")
                    ? "rgba(0, 0, 0, 1)"
                    : "rgba(0, 0, 0, 0.44)",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default LayourBaristar;
