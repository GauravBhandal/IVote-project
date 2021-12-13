const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const votersListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    date: { type: String, required: true },
    details: { type: String, required: true },
    participants: [
      {
        username: { type: String, required: true },
        partyname: { type: String, required: true },
        logo: { type: String },
      },
    ],
  },
  {
    timestamp: true,
  }
);

const VotersList = mongoose.model("VotersList", votersListSchema);

module.exports = VotersList;
