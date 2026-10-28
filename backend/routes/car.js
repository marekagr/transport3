const express = require("express");
const Car = require("../models/Car");
const router = express.Router();



router.post("", (req, res) => {
  // console.log('body:',req.get('Content-Type'),req.body);
  const body=JSON.parse(req.body);
  delete body['_id'];

  const item = new Car(body);
  item.save().then(data => {
    res.status(201).json(data);
  });
});

router.delete("/:id", (req, res, next) => {
  Car.deleteOne({ _id: req.params.id }).then(result => {
    // console.log(result);
    res.status(200).json(result);
  });
});

router.get("/:id", (req, res, next) => {
  Car.findOne({_id:req.params.id}).then(document => {
    // console.log('document:',document)
    res.status(200).json(document);
});
});

router.get("", (req, res, next) => {
  Car.find().then(documents => {
    // console.log('documents:',documents)
    res.status(200).json(documents);
});
});


router.put("/:id", (req, res, next) => {
  const car=JSON.parse(req.body);
  // console.log('put car',car);
  Car.findByIdAndUpdate({ _id: req.params.id },car).then(data=>{
    // console.log('put',data);
    res.status(200).json(data)
  })
});


module.exports = router;
