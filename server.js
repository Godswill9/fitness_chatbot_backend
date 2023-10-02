require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const chat = require("./routes/chat");
// const chatPremium = require("./routes/chatPremium");
// const messages = require("./routes/messages");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5500",
      "http://localhost:5501",
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "https://simpleasoro.netlify.app",
      "https://premiumasoro.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello server 2");
});

app.use("/", chat);
// app.use("/", chatPremium);
// app.use("/premium/api", messages);

app.listen(process.env.PORT || 8080, () => {
  console.log("app is listening");
});
