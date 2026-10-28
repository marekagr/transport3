const mongoose = require('mongoose');

const petrolSchema = mongoose.Schema({
  name: { type: String },
  __v:Number
},{ collection: 'petrol' });
petrolSchema.set('collection', 'petrol');
module.exports = mongoose.model('Petrol', petrolSchema,'petrol');
