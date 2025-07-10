const express = require("express");
const router = express.Router();

const sequenceGenerator = require("./sequenceGenerator");
const Message = require("../models/message");

router.get("/", (req, res, next) => {
  Message.find()
    .populate("sender") // populates the referenced Contact
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while fetching messages.",
        error: error,
      });
    });
});

router.post("/", (req, res, next) => {
  const maxMessageId = sequenceGenerator.nextId("messages");

  const message = new Message({
    id: maxMessageId,
    subject: req.body.subject,
    msgText: req.body.msgText,
    sender: req.body.sender,
  });

  message
    .save()
    .then((createdMessage) => {
      res.status(201).json({
        message: "Message added successfully",
        messageObj: createdMessage,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while adding the message.",
        error: error,
      });
    });
});

router.put("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        throw new Error("Message not found");
      }

      message.subject = req.body.subject;
      message.msgText = req.body.msgText;
      message.sender = req.body.sender;

      return Message.updateOne({ id: req.params.id }, message);
    })
    .then((result) => {
      res.status(204).json({ message: "Message updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while updating the message.",
        error: error,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Message.findOne({ id: req.params.id })
    .then((message) => {
      if (!message) {
        throw new Error("Message not found");
      }

      return Message.deleteOne({ id: req.params.id });
    })
    .then((result) => {
      res.status(204).json({ message: "Message deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while deleting the message.",
        error: error,
      });
    });
});

module.exports = router;
