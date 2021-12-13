const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("../config/keys");

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      required: true,
    },
    adhar: {
      type: String,
      required: true,
    },
    VotedList: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports.User = model("User", userSchema);
