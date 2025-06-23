import { Box, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import L from "leaflet";

const OpenStreetMap = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const mapRef = useRef(null); // ✅ Use one ref

  useEffect(() => {
    mapRef.current = L.map("map").setView([51.505, -0.09], 13);
    L
      .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })
      .addTo(mapRef.current);
  }, []);
  return (
    <Box m="20px">
      <Header title="ແຜນທີ" subtitle="ລາຍລະອຽດແຜນທີ" />
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
        <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      </Box>
    </Box>
  );
};

export default OpenStreetMap;
