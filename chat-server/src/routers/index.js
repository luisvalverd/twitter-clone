const { Router } = require("express");
const router = Router();
const {
  getChat,
  createChat,
  addMessage,
} = require("../controllers/chat.controller");

router.post("/get-chat", getChat);
router.post("/create-chat", createChat);
router.post("/send-message", addMessage);

module.exports = router;
