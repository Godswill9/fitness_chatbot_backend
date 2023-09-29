const express = require("express");
const route = express.Router();
const {
  saveMessage,
  fetchMessages,
  fetchMessage,
} = require("../controllers/messageController");

route.post("/saveMessage", saveMessage);
route.post("/fetchMessages", fetchMessages);
route.get("/fetchMessage/:id", fetchMessage);

module.exports = route;
