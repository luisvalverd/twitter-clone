const { Router } = require("express");
const router = Router();
const {
  getChat,
  createChat,
  addMessage,
} = require("../controllers/chat.controller");

const {
  addUser,
  removeUser,
  getUserSocket,
} = require("../controllers/users.controllers");

// * chat routers
router.post("/get-chat", getChat);
router.post("/create-chat", createChat);
router.post("/send-message", addMessage);

// * users routers
router.post("/add-user", addUser);
router.post("/remove-user", removeUser);
router.post("/get-user-socket", getUserSocket);

module.exports = router;
