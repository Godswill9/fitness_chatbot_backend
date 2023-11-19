const express = require("express");
const route = express.Router();
const fetch = require("node-fetch");
// const database = require("../model/schema");

const conversation = [];

route.post("/premium", async (req, res) => {
  // const {sender, reciever, messa}=req.body
  console.log(req.body.message);
  try {
    var url = "https://api.openai.com/v1/chat/completions";
    var api_key = process.env.API_KEY;

    conversation.push({
      role: "user",
      content: `${req.body.message}. Dont exceed 150 words`,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: conversation,
      }),
    });

    const responseData = await response.json();

    conversation.push({
      role: "assistant",
      content: responseData.choices[0].message.content,
    });
    res.send({
      data: responseData.choices[0].message.content,
      conversation: conversation,
    });

    // var createMessage = `INSERT INTO messages (
    //   sender,
    //   reciever,
    //   message,
    //   timestamp,
    //   chat_id) VALUES?`;

    //   var values = [
    //     [
    //       sender,
    //       reciever,
    //       req.body.message,
    //       date,
    //       "TRUE",
    //     ],
    //   ];

    //   database.query(createMessage, [values], (err, result) => {
    //     if (err) throw err;
    //     console.log(result);
    //   });
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ data: "An error occurred" });
  }
});

module.exports = route;
