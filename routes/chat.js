const express = require("express");
const route = express.Router();
const fetch = require("node-fetch");

const conversation = [];

route.post("/chat", async (req, res) => {
  try {
    var url = "https://api.openai.com/v1/chat/completions";
    var api_key = process.env.API_KEY;

    conversation.push({
      role: "user",
      content: `always reply very simply as a mechanic and in not more than 30 words. ${req.body.message}`,
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

    res.send({ data: responseData.choices[0].message.content });
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ data: "An error occurred" });
  }
});

module.exports = route;
