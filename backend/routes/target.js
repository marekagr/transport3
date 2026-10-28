const express = require("express");
const Target = require("../models/Target");
const router = express.Router();





router.get("", (req, res, next) => {
  Target.find().then(documents => {
    // console.log('target:',documents)
    res.status(200).json(documents);
});
});

module.exports = router;
