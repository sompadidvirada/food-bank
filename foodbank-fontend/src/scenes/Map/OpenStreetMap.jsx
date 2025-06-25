import { Box, Button, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Select, Tab, Tabs, TextField, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Header from "../component/Header";
import { tokens } from "../../theme";
import L from "leaflet";
import useGeolocation from "../../zustand/useGeoLocation";
import useLocalStorage from "../../zustand/useLocalStorage";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useFoodBankStorage from "../../zustand/foodbank-storage";
import NearMeIcon from '@mui/icons-material/NearMe';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { updateBranchLocation } from "../../api/branch";
import { toast, ToastContainer } from "react-toastify";
import MinorCrashIcon from '@mui/icons-material/MinorCrash';
import "leaflet-routing-machine";

const OpenStreetMap = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = useFoodBankStorage((state) => state.token)
  const mapContainerRef = useRef(null); // For the div
  const mapRef = useRef(null);          // For the Leaflet map instance
  const { position: location, fetchLocation } = useGeolocation();
  const userMarkerRef = useRef();
  const branch = useFoodBankStorage((state) => state.branchs)
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [branchName, setBranchName] = useState("");
  const [province, setProvince] = useState('Vientiane Prefecture');
  const [userFocus, setUserFocus] = useState(true);
  const filteredBranches = branch?.filter((item) => item.province === province);
  const [showUserMarker, setShowUserMarker] = useState(false);
  const [enableClick, setEnableClick] = useState(false)
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const branchMarkersRef = useRef({});
  const [distancePoints, setDistancePoints] = useState([]);
  const [routingControl, setRoutingControl] = useState(null);
  const [customRouteInfo, setCustomRouteInfo] = useState(null);
  const [isDistanceMode, setIsDistanceMode] = useState(false);
  const [selectedBranches, setSelectedBranches] = useState([]);
  




  {/** CREATE MARKER ICON */ }


  const customIconBranchs = L.icon({
    iconUrl: '/public/online-store.PNG',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
  const customIconUser = L.icon({
    iconUrl: '/public/teenager.PNG',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // When location is ready, update userPosition
  {/** FUNCTION MAP BRANCHS */ }

  useEffect(() => {
    if (!location.latitude || !location.longitude) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([location.latitude, location.longitude], 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(mapRef.current);
    }

    // Clear existing markers
    Object.values(branchMarkersRef.current).forEach(marker => mapRef.current.removeLayer(marker));
    branchMarkersRef.current = {}; // Reset markers

    branch.forEach(({ id, branchname, latitude, longitude }) => {
      const marker = L.marker([latitude, longitude], { icon: customIconBranchs })
        .addTo(mapRef.current)
        .bindPopup(`<div style="font-family: 'Noto Sans Lao'; font-size: 14px; color: green;">
        <strong>${branchname}</strong><br/>
        <span style="color: gray;">lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}</span>
      </div>`);

      branchMarkersRef.current[id] = marker; // Save the marker
    });

  }, [location, branch]);


  // 📍 Separate click event listener for selecting new branch location
  useEffect(() => {
    if (!mapRef.current) return;

    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;

      if (selectedBranchId !== null) {
        // 👉 Update the branch location in your state (in-place update)
        const updatedBranches = branch.map((item) => {
          if (item.id === selectedBranchId) {
            return { ...item, latitude: lat, longitude: lng };
          }
          return item;
        });

        // 👉 Assuming you have a Zustand action to update branches
        useFoodBankStorage.getState().setBranchs(updatedBranches);

        // 👉 Prepare form data
        const updatedBranch = updatedBranches.find(item => item.id === selectedBranchId);

        try {
          await updateBranchLocation(updatedBranch.id, { latitude: lat, longitude: lng }, token);
          toast.success("ອັປເດດສຳເລັດ.")
        } catch (err) {
          console.log(err)
          return
        }

        setSelectedBranchId(null); // Reset
        setEnableClick(false); // Disable map click mode
      }
    };

    if (enableClick) {
      mapRef.current.on('click', handleMapClick);
    } else {
      mapRef.current.off('click', handleMapClick);
    }

    return () => {
      mapRef.current?.off('click', handleMapClick);
    };
  }, [enableClick, selectedBranchId, branch]);




  {/** FUCNTION MAP USER */ }

  useEffect(() => {
    if (!mapRef.current || !location.latitude || !location.longitude || !showUserMarker) return;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }

    userMarkerRef.current = L.marker([location.latitude, location.longitude], { icon: customIconUser })
      .addTo(mapRef.current)
      .bindPopup(`<div style="font-family: 'Noto Sans Lao'; font-size: 14px; color: black;">
              <strong>ທີ່ຢູ່ປະຈຸບັນ</strong><br/>
            </div>`);
  }, [location]);



  const handleChange = (event) => {
    setProvince(event.target.value);
  };


  const handleBranchClick = (latitude, longitude, branchId) => {
    if (!isDistanceMode) {
      if (mapRef.current) {
        mapRef.current.flyTo([latitude, longitude], 17);
        setUserFocus(false);
      }
      return;
    }

    if (selectedBranches.length < 2 && !selectedBranches.some(b => b.id === branchId)) {
      const newSelection = [...selectedBranches, { id: branchId, lat: latitude, lng: longitude }];
      setSelectedBranches(newSelection);

      if (newSelection.length === 2) {
        const start = L.latLng(newSelection[0].lat, newSelection[0].lng);
        const end = L.latLng(newSelection[1].lat, newSelection[1].lng);

        mapRef.current.fitBounds([start, end], { padding: [50, 50] });

        if (routingControl) {
          mapRef.current.removeControl(routingControl);
          const oldContainer = document.querySelector('.leaflet-routing-container');
          if (oldContainer) oldContainer.remove();
        }

        const newRoute = L.Routing.control({
          waypoints: [start, end],
          routeWhileDragging: false,
          lineOptions: { styles: [{ color: 'blue', weight: 4 }] },
          show: false,
          addWaypoints: false,
          createMarker: () => { return null; }
        }).addTo(mapRef.current);

        newRoute.on('routesfound', function (e) {
          const route = e.routes[0];
          const distanceInKm = (route.summary.totalDistance / 1000).toFixed(2);
          const durationInMin = Math.ceil(route.summary.totalTime / 60);

          toast.info(`ໄລຍະທາງ: ${distanceInKm} km, ໃຊ້ເວລາ: ${durationInMin} ນາທີ`);

          setCustomRouteInfo({
            distance: distanceInKm,
            duration: durationInMin
          });
        });

        setRoutingControl(newRoute);
        setIsPanelOpen(false)
      }
    }
  };




  useEffect(() => {
    if (mapRef.current && location.latitude && location.longitude && showUserMarker) {
      mapRef.current.flyTo([location.latitude, location.longitude], 17);
    }
  }, [location, showUserMarker]);

  {/** FUNCTION CHANGE LOCATION BRANCH */ }

  const handleChangeLocationBranch = async (id) => {
    setSelectedBranchId(id); // 👉 Track the selected branch
    setEnableClick(true);

    // 👉 Remove the marker from map
    const marker = branchMarkersRef.current[id];
    if (marker) {
      mapRef.current.removeLayer(marker);
      delete branchMarkersRef.current[id]; // Remove from the tracking object
    }
  };

  return (
    <Box m="20px">
      <Header title="ແຜນທີ" subtitle="ລາຍລະອຽດແຜນທີ" />

      {/* Map and Floating Button Wrapper */}
      <Box
        m="40px 0 0 0"
        height="75vh"
        position="relative"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },
        }}
      >
        {/* Sliding Panel */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: isPanelOpen ? 0 : "-320px", // Slide in/out
            width: "300px",
            height: "100%",
            backgroundColor: colors.primary[400],
            boxShadow: "2px 0px 5px rgba(0,0,0,0.5)",
            padding: "20px",
            transition: "left 0.3s ease-in-out",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
          }}
        >


          {/* Tabs Header */}
          <Tabs
            value={selectedTab}
            onChange={(e, newValue) => setSelectedTab(newValue)}
            textColor="inherit"
            indicatorColor="primary"
            sx={{
              marginBottom: "10px",
              marginBottom: "10px",
              "& .MuiTab-root": {
                fontFamily: "Noto Sans Lao",
                color: colors.grey[100], // Inactive color
              },
              "& .Mui-selected": {
                color: colors.greenAccent[100], // Active tab text color
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "green", // Optional: Change underline color to green
              },
            }}
          >
            <Tab label="ສາຂາທັງໝົດ" sx={{ fontFamily: "Noto Sans Lao" }} />
            <Tab label="ຄິດໄລ່ ໄລຍະທາງ" sx={{ fontFamily: "Noto Sans Lao" }} />
            <Tab label="ແກ້ໄຂ ທີ່ຢູ່ສາຂາ" sx={{ fontFamily: "Noto Sans Lao" }} />
          </Tabs>

          {/* Tab 1: Buttons */}
          {selectedTab === 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel
                    id="demo-simple-select-label"
                    sx={{
                      fontFamily: 'Noto Sans Lao',
                      fontSize: '16px',
                      color: 'black', // Default color
                      '&.Mui-focused': {
                        color: 'green', // When focusing the select
                      },
                      '&.MuiInputLabel-shrink': {
                        color: 'white', // When an item is selected (shrink state)
                      },
                    }}
                  >
                    ເລືອກແຂວງ
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={province}
                    label="ເລືອກແຂວງຂອງສາຂາ"
                    sx={{
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'green',
                      },
                    }}
                    onChange={handleChange}
                  >
                    <MenuItem value={"Vientiane Prefecture"}>Vientiane Prefecture</MenuItem>
                    <MenuItem value={"Xaisomboun Province"}>Xaisomboun Province</MenuItem>
                    <MenuItem value={"Xiengkhouang"}>Xiengkhouang</MenuItem>
                    <MenuItem value={"Vientiane Province"}>Vientiane Province</MenuItem>
                    <MenuItem value={"Sekong"}>Sekong</MenuItem>
                    <MenuItem value={"Savannakhet"}>Savannakhet</MenuItem>
                    <MenuItem value={"Salavan"}>Salavan</MenuItem>
                    <MenuItem value={"Sainyabuli"}>Sainyabuli</MenuItem>
                    <MenuItem value={"Phongsaly"}>Phongsaly</MenuItem>
                    <MenuItem value={"Oudomxay"}>Oudomxay</MenuItem>
                    <MenuItem value={"Luang Prabang"}>Luang Prabang</MenuItem>
                    <MenuItem value={"Luang Namtha"}>Luang Namtha</MenuItem>
                    <MenuItem value={"Khammouane"}>Khammouane</MenuItem>
                    <MenuItem value={"Champasak"}>Champasak</MenuItem>
                    <MenuItem value={"Bolikhamsai"}>Bolikhamsai</MenuItem>
                    <MenuItem value={"Bokeo"}>Bokeo</MenuItem>
                    <MenuItem value={"Attapeu"}>Attapeu</MenuItem>
                  </Select>
                </FormControl>
                {
                  province && (
                    <List>
                      {filteredBranches.map((branchItem) => {
                        return (
                          <ListItemButton
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              backgroundColor: selectedBranches.some(b => b.id === branchItem?.id) ? colors.greenAccent[700] : 'transparent',
                            }}
                            key={branchItem?.id}
                          >
                            <ListItemIcon onClick={() => handleBranchClick(branchItem.latitude, branchItem.longitude, branchItem.id)} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LocationOnIcon />
                              <ListItemText primary={branchItem?.branchname}
                                primaryTypographyProps={{ fontFamily: 'Noto Sans Lao', color: branchItem.aviable ? colors.grey[100] : colors.redAccent[500] }} />
                            </ListItemIcon>

                            <ListItemIcon
                              onClick={() => handleChangeLocationBranch(branchItem?.id)}
                              sx={{
                                cursor: 'pointer',
                                '&:hover .hover-icon': {
                                  color: colors.greenAccent[400],
                                },
                              }}
                            >
                              <LocalOfferIcon className="hover-icon" sx={{ color: colors.grey[100] }} />
                            </ListItemIcon>
                          </ListItemButton>

                        );
                      })}
                    </List>
                  )
                }
              </Box>
            </Box>
          )}

          {/* Tab 2: Product List */}
          {selectedTab === 1 && (
            ""
          )}

          {/* Tab 3: Input Form */}
          {selectedTab === 2 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="ຊື່ສາຂາ"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  alert(`ເພີ່ມສາຂາ: ${branchName}`);
                  setBranchName("");
                }}
              >
                ເພີ່ມສາຂາ
              </Button>
            </Box>
          )}

          {/* Toggle Handle Button */}
          <IconButton
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            sx={{
              position: "absolute",
              top: "50%",
              right: isPanelOpen ? "-20px" : "-50px",
              transform: "translateY(-50%)",
              backgroundColor: colors.blueAccent[700],
              color: "#fff",
              borderRadius: "50%",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.3)",
              "&:hover": { backgroundColor: colors.blueAccent[800] },
            }}
          >
            {isPanelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Box>

        {/** mylocation button */}

        <IconButton
          variant="contained"
          sx={{ position: 'absolute', bottom: 20, right: 20, zIndex: 999 }}
          onClick={() => {
            fetchLocation();
            setShowUserMarker(true); // Show the marker only after button click
          }}
        >
          <NearMeIcon sx={{ fontSize: 30, color: "black" }} />
        </IconButton>

        {/** calculate maile button */}

        <IconButton
          variant="contained"
          sx={{ position: 'absolute', bottom: 26, right: 80, zIndex: 999 }}
          onClick={() => {
            if (routingControl) {
              mapRef.current.removeControl(routingControl);
              const oldContainer = document.querySelector('.leaflet-routing-container');
              if (oldContainer) oldContainer.remove();
              setRoutingControl(null);
              setSelectedBranches([]);
              setCustomRouteInfo(null);
              setIsDistanceMode(false);
              return;
            }
            setIsPanelOpen(true)
            setIsDistanceMode(true);
            toast.info("ເລືອກ 2 ສາຂາທີ່ຈະຄຳນວນໄລຍະທາງ");
          }}
        >
          <MinorCrashIcon sx={{ fontSize: 30, color: isDistanceMode ? "red" : "black" }} />
        </IconButton>



        {customRouteInfo && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 100,
              right: 20,
              backgroundColor: 'white',
              padding: '10px 15px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              zIndex: 999
            }}
          >
            <Typography fontFamily="Noto Sans Lao" color="black">
              ໄລຍະທາງ: {customRouteInfo.distance} km
            </Typography>
            <Typography fontFamily="Noto Sans Lao" color="black">
              ໃຊ້ເວລາ: {customRouteInfo.duration} ນາທີ
            </Typography>
          </Box>
        )}



        {/* Map */}
        <div id="map" ref={mapContainerRef} style={{ height: "100%", width: "100%" }}></div>
      </Box>
      <ToastContainer position="top-center" />
    </Box>
  );
};

export default OpenStreetMap;
