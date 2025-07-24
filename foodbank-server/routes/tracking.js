const express = require("express");
const { authCheck, adminCheck } = require("../middleware/authCheck");
const {
  checkTrackSell,
  checkTrackSend,
  checkTrackExp,
  insertTrackSell,
  deleteTracksell,
  insertTrackSend,
  insertTrackExp,
  deleteTracksend,
  deleteTrackexp,
  updateTrackSell,
  updateTrackSend,
  updateTrackExp,
  uploadImageTrack,
  checkImageTrack,
  deleteImages,
  fecthImageTrack,
} = require("../controller/tracking");
const router = express.Router();

router.post("/checktracksell", authCheck, checkTrackSell);
router.post("/checktracksend", authCheck, checkTrackSend);
router.post("/checktrackexp", authCheck, checkTrackExp);
router.post("/inserttracksell", authCheck, insertTrackSell);
router.post("/inserttracksend", authCheck, insertTrackSend);
router.post("/inserttrackexp", authCheck, insertTrackExp);
router.post("/deletealltracksell", authCheck, deleteTracksell);
router.post("/deletealltracksend", authCheck, deleteTracksend);
router.post("/deletealltrackexp", authCheck, deleteTrackexp);
router.post("/updatetracksell", authCheck, updateTrackSell);
router.post("/updatetracksend", authCheck, updateTrackSend);
router.post("/updatetrackexp", authCheck, updateTrackExp);
router.post("/deleteimagestrack", authCheck, deleteImages)

// upload image track

router.post("/uploadimagetrack", authCheck, uploadImageTrack)
router.post("/getimagetrack", authCheck, checkImageTrack)
router.post("/getimagetracking", authCheck, fecthImageTrack)

module.exports = router;
