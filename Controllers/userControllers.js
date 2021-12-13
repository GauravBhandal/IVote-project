const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const twilio = require("twilio");
require("dotenv").config();
const otpGenerator = require("otp-generator");

const { User } = require("../models/userModel");
const { Otp } = require("../models/otpModel");

const client = new twilio(
  "ACb0c0a5c62b791c5bc2ff04080250fa07",
  "8da7e96cbc92727dbd38020d3760aae8"
);

module.exports.signUp = async (req, res) => {
  const { name, email, number, adhar } = req.body;
  if (!email || !number || !name || !adhar) {
    return res.status(422).json({ error: "please add all the fields" });
  }
  User.findOne({ adhar: adhar })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exists with that adhar number" });
      }
      const user = new User({
        name,
        email,
        number,
        adhar,
      });

      user
        .save()
        .then((user) => {
          res.json({ message: "saved successfully" });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.signIn = async (req, res) => {
  const user = await User.findOne({
    adhar: req.body.adhar,
  });
  if (!user) return res.status(400).send("User not found!");
  const OTP = otpGenerator.generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  console.log(user);
  const number = user.number;
  client.messages
    .create({
      body: `Here is your OTP for login: ${OTP}`,
      to: `+91${number}`,
      from: "+19123616545",
    })
    .then((message) => console.log(message.sid))
    .catch((error) => console.log(error));
  console.log(OTP);
  console.log(number);
  const otp = new Otp({ number: number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).send("Otp send successfully");
};

module.exports.verifyOtp = async (req, res) => {
  const user = await User.findOne({
    adhar: req.body.adhar,
  });
  const otpHolder = await Otp.find({
    number: user.number,
  });
  if (otpHolder.length === 0)
    return res.status(400).send("You use an Expired OTP!");
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

  if (rightOtpFind.number === user.number && validUser) {
    // const user = new User(_.pick(req.body, ["number"]));
    const token = user.generateJWT();
    // const result = await user.save();
    const OTPDelete = await Otp.deleteMany({ number: rightOtpFind.number });
    return res.status(200).send({
      Message: "User Login Successfully!",
      token: token,
      data: user,
    });
  } else {
    return res.status(400).send("Your OTP was wrong!");
  }
};

module.exports.updateUser = async (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $push: { VotedList: req.body.voteId },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      res.json(result);
    }
  );
  console.log(req.body);
};
