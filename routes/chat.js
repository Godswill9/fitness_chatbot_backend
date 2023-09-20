const express = require("express");
const route = express.Router();

const conversation = [];
route.post("/chat", async (req, res) => {
  var url = "https://api.openai.com/v1/chat/completions";
  var api_key = process.env.API_KEY;
  conversation.push({
    role: "user",
    content: `always reply very simply as a mechanic and in not more than 30 words. ${req.body.message}`,
  });
  //   console.log(req.body);
  await fetch(url, {
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
  })
    .then((res) => res.json())
    .then((response) => {
      conversation.push({
        role: "assistant",
        content: response.choices[0].message.content,
      });
      res.send({ data: response.choices[0].message.content });
      // console.log(conversation);
    })
    .catch((err) => {
      res.send({ data: "an error occured" });
      throw err;
    });
});

module.exports = route;
