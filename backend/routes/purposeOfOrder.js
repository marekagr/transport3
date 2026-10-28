const express = require("express");
const PurposeOfOrder = require("../models/PurposeOfOrder");
const router = express.Router();





router.get("", (req, res, next) => {
  PurposeOfOrder.find().then(documents => {
    // console.log('PurposeOfOrder:',documents)
    res.status(200).json(documents);
});
});

module.exports = router;