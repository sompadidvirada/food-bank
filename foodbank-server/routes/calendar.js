const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  createCalendar,
  getCalendar,
  updateCalendar,
  deleteCalendar,
  getCalendarAdmin,
  updateSuccessPo,
  detailupdate,
} = require("../controller/calendar");
const router = express.Router();

router.post("/createcalendar", createCalendar);
router.get("/getcalendar/:id", getCalendar);
router.put("/updatecalendar/:id", updateCalendar);
router.delete("/deletecalendar/:id", deleteCalendar);
router.get("/getcalendaradmin", getCalendarAdmin);
router.put("/updatesuccesspo/:id", updateSuccessPo);
router.put("/detailupdate/:id", detailupdate);

module.exports = router;
