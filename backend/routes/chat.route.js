const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  getFacultyOptionsController,
  getStudentChatController,
  sendStudentMessageController,
  getFacultyChatsController,
  getFacultyChatController,
  sendFacultyMessageController,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/faculty-options", auth, getFacultyOptionsController);
router.get("/student/:facultyId", auth, getStudentChatController);
router.post("/student/:facultyId", auth, sendStudentMessageController);
router.get("/faculty", auth, getFacultyChatsController);
router.get("/faculty/:studentId", auth, getFacultyChatController);
router.post("/faculty/:studentId", auth, sendFacultyMessageController);

module.exports = router;
