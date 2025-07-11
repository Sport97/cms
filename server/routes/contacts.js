const express = require("express");
const router = express.Router();
const sequenceGenerator = require("./sequenceGenerator");
const Contact = require("../models/contact");

router.get("/", (req, res, next) => {
  Contact.find()
    .populate("group")
    .then((contacts) => {
      res.status(200).json({
        message: "Contacts fetched successfully!",
        contacts: contacts,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred",
        error: error,
      });
    });
});

router.post("/", async (req, res, next) => {
  try {
    const maxContactId = await sequenceGenerator.nextId("contacts");

    const contact = new Contact({
      id: maxContactId.toString(),
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      imageUrl: req.body.imageUrl,
      group: req.body.group,
    });

    const createdContact = await contact.save();
    res.status(201).json({
      message: "Contact added successfully",
      contact: createdContact,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while adding the contact.",
      error: error,
    });
  }
});

router.put("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        throw new Error("Contact not found");
      }

      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;
      contact.group = req.body.group;

      return Contact.updateOne({ id: req.params.id }, contact);
    })
    .then((result) => {
      res.status(204).json({ message: "Contact updated successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while updating the contact.",
        error: error,
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then((contact) => {
      if (!contact) {
        throw new Error("Contact not found");
      }

      return Contact.deleteOne({ id: req.params.id });
    })
    .then((result) => {
      res.status(204).json({ message: "Contact deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "An error occurred while deleting the contact.",
        error: error,
      });
    });
});

module.exports = router;
