import React from "react";
import { forwardRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { formatDate } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Box, List, ListItem, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import { useEffect } from "react";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import useFoodBankStorage from "../../zustand/foodbank-storage";
import {
  createCalendar,
  deleteCalendar,
  detailUpdate,
  getCalendarAdmin,
  updateCalendar,
  updateSuccessPo,
} from "../../api/calendar";
import Header from "../component/Header";

const renderEventContent = (eventInfo) => {
  const isSuccess = eventInfo.event.extendedProps?.isSuccess;
  return (
    <Box
      sx={{
        fontFamily: "Noto Sans Lao",
        fontSize: "0.9rem",
        color: "#fff",
        backgroundColor: isSuccess ? "#4caf50" : "#2196f3", // green or blue
        borderRadius: "4px",
        padding: "2px 4px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {eventInfo.event.title}
    </Box>
  );
};

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CalendarAdmin = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const user = useFoodBankStorage((state) => state.user);
  const [calendarad, setCalendarad] = useState([]) || "";
  const [newEvent, setNewEvent] = useState({
    suplyer: "",
    description: "",
    poLink: "",
  });
  const [selectedEventInfUllCalendar, setSelectedEventInfUllCalendar] =
    useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetailOpen, setEventDetailOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().startOf("month"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month"));
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEventData, setEditEventData] = useState({
    id: "",
    title: "",
    description: "",
    poLink: "",
  });
  const [selectedDateInfo, setSelectedDateInfo] = useState(null); // for storing the calendar selection
  const [searchTerm, setSearchTerm] = useState("");

  const start = startDate.startOf("day");
  const end = endDate.startOf("day");

  const getCalen = async () => {
    try {
      const ress = await getCalendarAdmin();
      setCalendarad(ress.data);
    } catch (err) {
      console.log();
    }
  };
  useEffect(() => {
    getCalen();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  const handleDateClick = (selected) => {
    setSelectedDateInfo(selected); // Save selection for use after dialog submit
    setOpen(true); // Open the dialog
  };

  const handleAddEvent = async () => {
    if (newEvent.suplyer && selectedDateInfo) {
      const calendarApi = selectedDateInfo.view.calendar;
      calendarApi.unselect();

      calendarApi.addEvent({
        id: `${selectedDateInfo.dateStr}-${newEvent.suplyer}`,
        title: newEvent.suplyer,
        start: selectedDateInfo.startStr,
        end: selectedDateInfo.endStr,
        allDay: selectedDateInfo.allDay,
        extendedProps: {
          description: newEvent.description,
          poLink: newEvent.poLink,
        },
      });

      const formData = {
        suplyer: newEvent.suplyer,
        polink: newEvent.poLink || "",
        discription: newEvent.description || "",
        userId: user.id,
        date: new Date(selectedDateInfo.startStr), // converts string to Date
      };

      const respone = await createCalendar(formData);

      getCalen();

      setOpen(false);
      setSelectedDateInfo(null);
      setNewEvent({ suplyer: "", description: "", poLink: "" });
    }
  };

  const handleEventClick = (selected) => {
    setSelectedEventInfUllCalendar(selected.event._def);
    setDialogOpen(true);
  };

  const handleInputChange = (field) => (e) => {
    setNewEvent((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };
  const handleEventDrop = async (info) => {
    const { event } = info;

    const updatedData = {
      suplyer: event.title,
      polink: event.extendedProps?.poLink || "",
      discription: event.extendedProps?.description || "",
      date: new Date(event.start),
    };

    const updateCalen = await updateCalendar(event.id, updatedData);

    // Refresh events
    getCalen();
  };

  const handleUpdateStatusEvent = async (status) => {
    try {
      const updated = await updateSuccessPo(selectedEvent?.id, status);
      console.log("Updated:", updated.data);

      setCalendarad((prev) => {
        const updatedList = prev.map((event) =>
          event.id === String(updated?.data?.id)
            ? {
                ...event,
                extendedProps: {
                  ...event.extendedProps,
                  isSuccess: updated?.data?.isSuccess,
                },
              }
            : event
        );
        return [...updatedList]; // force change detection
      });
    } catch (err) {
      console.log(err);
    }
  };

  console.log(calendarad);
  const handleEditEvent = () => {
    setEditEventData({
      id: selectedEventInfUllCalendar?.publicId,
      title: selectedEventInfUllCalendar?.title,
      description:
        selectedEventInfUllCalendar?.extendedProps?.description || "",
      linkPO: selectedEventInfUllCalendar?.extendedProps?.poLink,
    });

    setEditModalOpen(true);
  };

  const handleUpdateEventSubmit = async () => {
    try {
      // Call your backend update function (you may need to create one)
      const updated = await detailUpdate(editEventData.id, {
        title: editEventData.title,
        description: editEventData.description,
        polink: editEventData.linkPO,
      });

      // Refresh calendar data

      console.log(updated);
      getCalen();

      setEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update:", err);
      alert("ບໍ່ສາມາດບັນທຶກໄດ້");
    }
  };

  return (
    <Box m="20px">
      <Header title="CALENDAR" />
      <Box display={"flex"} marginBottom={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div style={{ display: "flex", gap: "10px" }}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
            />
          </div>
        </LocalizationProvider>
      </Box>
      <Box display="flex" justifyContent="space-between">
        {/**CALENDAR SIDE BAR */}
        <Box
          flex="1 1 20%"
          backgroundColor={colors.primary[400]}
          p="15px"
          borderRadius="4px"
          height={550}
          overflow={"auto"}
        >
          <Typography fontFamily={"Noto Sans Lao"}>ລາຍລະອຽດ</Typography>
          <TextField
            size="small"
            placeholder="ຄົ້ນຫາຊື່ supplier..."
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
            sx={{
              my: 1,
              "& .MuiInputBase-input::placeholder": {
                fontFamily: "Noto Sans Lao",
                fontSize: "14px",
                color: "#999", // light gray
                opacity: 1, // make sure it's visible
              },
            }}
          />
          <List>
            {calendarad
              ?.filter((event) => {
                const eventDate = dayjs(event.start).startOf("day");
                const matchesDate =
                  eventDate.isSame(start, "day") ||
                  eventDate.isSame(end, "day") ||
                  (eventDate.isAfter(start, "day") &&
                    eventDate.isBefore(end, "day"));

                const matchesSearch = event.title
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase());

                return matchesDate && matchesSearch;
              })
              .sort((a, b) => {
                // Compare by dayjs date
                if (dayjs(a.start).isBefore(dayjs(b.start))) return -1;
                if (dayjs(a.start).isAfter(dayjs(b.start))) return 1;
                return 0;
              })
              .map((event, index) => (
                <ListItem
                  key={event.id}
                  sx={{
                    backgroundColor: event.extendedProps?.isSuccess
                      ? colors.greenAccent[500]
                      : colors.blueAccent[500],

                    margin: "10px 0",
                    borderRadius: "2px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setSelectedEvent(event);
                    setEventDetailOpen(true);
                  }}
                >
                  <Box padding={0}>
                    <Typography fontFamily={"Noto Sans Lao"} fontWeight="bold">
                      {event.title}
                    </Typography>
                    <Typography fontFamily={"Noto Sans Lao"}>
                      {formatDate(event.start, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
          </List>
        </Box>
        {/**CALENDAR */}

        <Box flex="1 1 100%" ml="15px">
          <FullCalendar
            height="75vh"
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            eventContent={renderEventContent}
            dayMaxEvents={true}
            select={handleDateClick}
            eventClick={(events) => handleEventClick(events)}
            events={calendarad}
            eventDrop={handleEventDrop} // Add this line
          />
        </Box>
      </Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>
          ເພີ່ມລາຍລະອຽດ
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="ບໍລິສັດຜູ້ສະໜອງ"
            fullWidth
            InputLabelProps={{
              sx: { fontFamily: "Noto Sans Lao" },
            }}
            variant="standard"
            value={newEvent.suplyer}
            onChange={handleInputChange("suplyer")}
          />
          <TextField
            margin="dense"
            label="ລາຍລະອຽດ"
            fullWidth
            InputLabelProps={{
              sx: { fontFamily: "Noto Sans Lao" },
            }}
            variant="standard"
            value={newEvent.description}
            onChange={handleInputChange("description")}
          />
          <TextField
            margin="dense"
            label="ລີ້ງພີໂອ"
            fullWidth
            InputLabelProps={{
              sx: { fontFamily: "Noto Sans Lao" },
            }}
            variant="standard"
            value={newEvent.poLink}
            onChange={handleInputChange("poLink")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            sx={{ fontFamily: "Noto Sans Lao" }}
            onClick={handleClose}
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant="contained"
            color="success"
            sx={{ fontFamily: "Noto Sans Lao" }}
            onClick={handleAddEvent}
          >
            ເພີ່ມບັນທືກ
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={eventDetailOpen}
        onClose={() => setEventDetailOpen(false)}
        TransitionComponent={Transition}
      >
        <DialogTitle
          sx={{
            fontFamily: "Noto Sans Lao",
            alignSelf: "center",
            fontSize: 25,
          }}
        >
          ລາຍລະອຽດ
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column" }}>
          <Box
            borderBottom={"1px solid"}
            display={"flex"}
            flexDirection={"column"}
            p={2}
          >
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
            >
              ບໍລິສັດຜູ້ສະໜອງ:
            </Typography>
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              color={colors.grey[100]}
              fontSize={18}
            >
              {selectedEvent?.title}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            borderBottom={"1px solid"}
            p={2}
          >
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
            >
              ວັນທີ
            </Typography>
            <Typography
              fontFamily="Noto Sans Lao"
              alignSelf={"center"}
              color={colors.grey[100]}
              fontSize={18}
            >
              {new Date(selectedEvent?.start).toLocaleDateString("en-GB")}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            borderBottom={"1px solid"}
            p={2}
          >
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
            >
              ລາຍລະອຽດ:
            </Typography>
            <Typography
              fontFamily="Noto Sans Lao"
              alignSelf={"center"}
              color={colors.grey[100]}
              fontSize={18}
            >
              {selectedEvent?.extendedProps?.description || "ບໍ່ມີ"}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={"column"}
            borderBottom={"1px solid"}
            p={2}
          >
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
              p={2}
            >
              ລິ້ງພີໂອ
            </Typography>
            <Typography fontFamily="Noto Sans Lao" alignSelf={"center"}>
              <Box sx={{ wordBreak: "break-all", textAlign: "center" }}>
                <Link
                  sx={{
                    color: colors.blueAccent[400],
                    fontSize: 18,
                  }}
                  href={selectedEvent?.extendedProps?.poLink}
                  target="_blank"
                  rel="noopener"
                >
                  {selectedEvent?.extendedProps?.poLink}
                </Link>
              </Box>
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            borderBottom={"1px solid"}
            p={2}
          >
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
              p={2}
            >
              ສະຖານະການຈັດສົ່ງ
            </Typography>
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={18}
              color={
                selectedEvent?.extendedProps?.isSuccess === false
                  ? "rgba(255, 0, 0, 0.64)"
                  : "rgba(21, 255, 0, 0.6)"
              }
            >
              {selectedEvent?.extendedProps?.isSuccess === false
                ? "ຍັງບໍ່ປິດ PO"
                : "ປິດ PO ແລ້ວ"}
            </Typography>
          </Box>
          <Box display={"flex"} flexDirection={"column"} p={2}>
            <Typography
              fontFamily={"Noto Sans Lao"}
              alignSelf={"center"}
              fontSize={15}
              color={colors.grey[300]}
              p={2}
            >
              ອັປເດດສະຖານະ
            </Typography>
            {selectedEvent?.extendedProps?.isSuccess === false ? (
              <Button
                variant="contained"
                onClick={() => {
                  handleUpdateStatusEvent(true);
                  setEventDetailOpen(false);
                }}
                sx={{
                  fontFamily: "Noto Sans Lao",
                  fontSize: 15,
                  fontWeight: "bold",
                  width: "30%",
                  alignSelf: "center",
                }}
                color="success"
              >
                ຈັດສົ່ງແລ້ວ
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  handleUpdateStatusEvent(false);
                  setEventDetailOpen(false);
                }}
                sx={{
                  fontFamily: "Noto Sans Lao",
                  fontSize: 15,
                  fontWeight: "bold",
                  width: "30%",
                  alignSelf: "center",
                }}
                color="error"
              >
                ຍັງບໍ່ທັນຈັດສົ່ງ
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ alignSelf: "center" }}>
          <Button
            variant="contained"
            onClick={() => setEventDetailOpen(false)}
            sx={{ fontFamily: "Noto Sans Lao" }}
            color="info"
          >
            ກັບຄືນ
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontFamily: "Noto Sans Lao" }}>ຈັດການ</DialogTitle>
        <DialogContent>
          <Typography fontFamily="Noto Sans Lao">
            ກະລຸນາ ເລືອກຮູບແບບການຈັດການບໍລິສັດ{" "}
            {selectedEventInfUllCalendar?.title}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            onClick={() => {
              setDialogOpen(false);
              // trigger your edit logic here
              handleEditEvent();
            }}
          >
            ແກ້ໄຂ
          </Button>
          <Button
            sx={{ fontFamily: "Noto Sans Lao" }}
            variant="contained"
            onClick={async () => {
              try {
                await deleteCalendar(selectedEventInfUllCalendar?.publicId);
                setDialogOpen(false);
                setSelectedEvent(null);
                getCalen(); // refresh from backend
              } catch (error) {
                console.error("Delete failed:", error);
              }
            }}
            color="error"
          >
            ລົບ
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontFamily="Noto Sans Lao">ແກ້ໄຂລາຍລະອຽດ</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label={<Typography variant="laoText">ຊື່ບໍລິສັດ</Typography>}
            value={editEventData.title}
            onChange={(e) =>
              setEditEventData({ ...editEventData, title: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label={<Typography variant="laoText">ລາຍລະອຽດ</Typography>}
            value={editEventData.description}
            onChange={(e) =>
              setEditEventData({
                ...editEventData,
                description: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            margin="dense"
            label={<Typography variant="laoText">ລິ້ງ PO</Typography>}
            value={editEventData.linkPO}
            onChange={(e) =>
              setEditEventData({
                ...editEventData,
                linkPO: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateEventSubmit}
            color="success"
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ບັນທຶກ
          </Button>
          <Button
            onClick={() => setEditModalOpen(false)}
            color="error"
            variant="contained"
            sx={{ fontFamily: "Noto Sans Lao" }}
          >
            ຍົກເລີກ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarAdmin;
