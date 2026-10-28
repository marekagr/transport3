const mongoose = require('mongoose');


const purposeOfOrderSchema = mongoose.Schema({
  name:String,
},{ collection: 'purposeOfOrder' });
purposeOfOrderSchema.set('collection', 'purposeOfOrder');
module.exports = mongoose.model('PurposeOfOrder', purposeOfOrderSchema,'purposeOfOrder');