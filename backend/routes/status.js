const express = require("express");
const Status = require("../models/Status");
const router = express.Router();





router.get("", (req, res, next) => {
  Status.find().then(documents => {
    // console.log('status Types:',documents)
    res.status(200).json(documents);
});
});

module.exports = router;
