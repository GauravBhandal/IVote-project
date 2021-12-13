const router = require("express").Router();
let VotersList = require("../models/votesModel");

router.route("/").get((req, res) => {
  VotersList.find()
    .then((voter) => res.json(voter))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const date = req.body.date;
  const details = req.body.details;
  const participants = req.body.participants;
  const data = participants.map((participant) => ({
    username: participant.username,
    partyname: participant.partyname,
  }));
  const newVotersList = new VotersList({
    name,
    date,
    details,
    participants: data,
  });
  console.log(participants);
  newVotersList
    .save()
    .then(() => res.json("VotersList added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").get((req, res) => {
  VotersList.findById(req.params.id)
    .then((voter) => res.json(voter))
    .then((err) => res.status(400).json("Error: " + err));
});
router.route("/update/:id").post((req, res) => {
  VotersList.findById(req.params.id)
    .then((voter) => {
      //   participant.meeting = req.body.meeting;
      voter.name = req.body.name;
      voter.date = req.body.date;
      voter.details = req.body.details;
      voter.participants = req.body.participants;
      voter
        .save()
        .then(() => res.json("Voters details updated"))
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => err.status(400).json("Error: " + err));
});

module.exports = router;
