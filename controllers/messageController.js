const database = require("../model/schema");
const { v4 } = require("uuid");

function generateChatId() {
  return `CHAT_${Date.now()}`;
}

exports.saveMessage = async (req, res, next) => {
  var date = new Date();
  var arr = [];

  const chatId = req.body.chatId;
  //   console.log(req.body.count);

  if (req.body.count == 1) {
    arr = [
      req.body.messages[req.body.messages.length - 2],
      req.body.messages[req.body.messages.length - 1],
    ];
    // chatId =
    //   arr[0].content.slice(10, arr[0].content.length).split(" ").join("") +
    //   Date.now();
    var createChat = `INSERT INTO chat (
              chat_id,
              chat_title,
              userName,
              timestamp) VALUES?`;

    var values = [[chatId, arr[0].content, "USER1", date]];

    database.query(createChat, [values], (err, result) => {
      if (err) throw err;
      //   console.log(result);
    });

    //save the message
    arr.forEach((item, i) => {
      var createMessage = `INSERT INTO messages (
                  sender,
                  reciever,
                  message,
                  chat_id) VALUES?`;

      var values = [
        [
          item.role,
          item.role == "assistant" ? "user" : "assistant",
          item.content,
          chatId,
        ],
      ];

      database.query(createMessage, [values], (err, result) => {
        if (err) throw err;
        // console.log(result);
      });
    });
  } else {
    arr = [
      req.body.messages[req.body.messages.length - 2],
      req.body.messages[req.body.messages.length - 1],
    ];
    // chatId =
    //   req.body.messages[0].content
    //     .slice(10, req.body.messages[0].content.length)
    //     .split(" ")
    //     .join("") + Date.now();
    arr.forEach((item, i) => {
      var createMessage = `INSERT INTO messages (
          sender,
          reciever,
          message,
          chat_id) VALUES?`;

      var values = [
        [
          item.role,
          item.role == "assistant" ? "user" : "assistant",
          item.content,
          chatId,
        ],
      ];

      database.query(createMessage, [values], (err, result) => {
        if (err) throw err;
        // console.log(result);
      });
    });
  }
};

exports.fetchMessages = async (req, res, next) => {
  const { name } = req.body;
  const query = "SELECT * FROM chat WHERE userName = ?";
  database.query(query, [name], (err, result) => {
    if (err) {
      throw err;
    } else {
      const promises = result.map((item) => {
        const query = "SELECT * FROM messages WHERE chat_id = ?";
        return new Promise((resolve, reject) => {
          database.query(query, [item.chat_id], (err, result2) => {
            if (err) {
              reject(err);
            } else {
              resolve(result2);
            }
          });
        });
      });

      // Wait for all promises to resolve
      Promise.all(promises)
        .then((resultsArray) => {
          res.send(resultsArray); // Send an array of arrays to the frontend
        })
        .catch((err) => {
          console.error("Error querying the messages table:", err);
          res.status(500).send("An error occurred.");
        });
    }
  });
};

exports.fetchMessage = async (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT * FROM messages WHERE chat_id = ?";
  database.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching messages:", err);
      res.status(500).send("An error occurred while fetching messages.");
    } else {
      res.send(result);
    }
  });
};

// create database ConvolverNode

// store messages
// if first message, create new Chat
//  subsequent messages will have the same chatid, with its position in
//     the chat

//     every click of the chatbot will result in a new conversation

//     user wont have the ability to edit past conversations
