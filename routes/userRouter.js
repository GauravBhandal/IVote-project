const router = require("express").Router();
const {
  signUp,
  verifyOtp,
  signIn,
  updateUser,
} = require("../Controllers/userControllers");

router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/addVote").put(updateUser);
router.route("/signin/verify").post(verifyOtp);

module.exports = router;
