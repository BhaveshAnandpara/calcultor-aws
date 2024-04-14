var express = require("express");
var app = express();
const router = express.Router();
const path = require("path");

router.get("/signup", async (req, res) => {
  res.sendFile(path.join(__dirname, "../signup.html"));
});

router.get("/login", async (req, res) => {
  res.sendFile(path.join(__dirname, "../login.html"));
});

router.post("/signup", async (req, res) => {
  try {

    res.json(req.body)

  } catch (err) {}
});

module.exports = router;
