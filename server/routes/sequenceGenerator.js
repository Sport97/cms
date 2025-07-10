const Sequence = require("../models/sequence");

let maxDocumentId;
let maxMessageId;
let maxContactId;
let sequenceId = null;

function SequenceGenerator() {}

SequenceGenerator.prototype.init = async function () {
  try {
    const sequence = await Sequence.findOne();
    if (!sequence) throw new Error("No sequence found in database.");

    sequenceId = sequence._id;
    maxDocumentId = sequence.maxDocumentId;
    maxMessageId = sequence.maxMessageId;
    maxContactId = sequence.maxContactId;
  } catch (err) {
    console.error("Failed to initialize SequenceGenerator:", err);
    throw err;
  }
};

SequenceGenerator.prototype.nextId = async function (collectionType) {
  if (!sequenceId) {
    throw new Error("SequenceGenerator not initialized. Call init() first.");
  }

  let updateObject = {};
  let nextId;

  switch (collectionType) {
    case "documents":
      maxDocumentId++;
      updateObject = { maxDocumentId };
      nextId = maxDocumentId;
      break;
    case "messages":
      maxMessageId++;
      updateObject = { maxMessageId };
      nextId = maxMessageId;
      break;
    case "contacts":
      maxContactId++;
      updateObject = { maxContactId };
      nextId = maxContactId;
      break;
    default:
      return -1;
  }

  try {
    await Sequence.updateOne({ _id: sequenceId }, { $set: updateObject });
    return nextId;
  } catch (err) {
    console.error("Error updating sequence:", err);
    throw err;
  }
};

module.exports = new SequenceGenerator();
