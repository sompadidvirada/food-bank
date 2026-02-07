import React from "react";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";
import { SocketProvider } from "../socket-io-provider/SocketProvider";
import { ToastContainer } from "react-toastify";

const App = () => {
  const [theme, colorMode] = useMode();

  return (
    // <SocketProvider>
    //   <ColorModeContext.Provider value={colorMode}>
    //     <ThemeProvider theme={theme}>
    //       <CssBaseline />
    //       <div className="app">
    //         <AppRoutes />
    //         <ToastContainer position="top-center" />
    //       </div>
    //     </ThemeProvider>
    //   </ColorModeContext.Provider>
    // </SocketProvider>
    <>ປິດລະບົບອັປເດດຊົ່ວຄາວ ຈະເປີດກັບມານຳໃຊ້ໄວ້ໆນີ້</>
  );
};

export default App;
