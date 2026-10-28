const mongoose = require('mongoose');

const carSchema = mongoose.Schema({
  name: { type: String, required: true },
  active:{ type: Boolean, default: true },
  // typeid : {type: mongoose.Schema.Types.ObjectId},
  make: {type:String,required:true}, //producent
  model: String,
  licence_number:{type:String,required:true}, //nr rejestracyjny
  vin:{type:String,required:true},
  sn:String,
  certificate:String,
  chassis_number:String,
  engine_number:String,
  year_production:Date,
  date_registered:Date,
  inventory_number :String,
  engine_capacity:Number,
  groupid:{type: mongoose.Schema.Types.ObjectId,ref: 'group'},
  meter_reading:Number,

  petrolid:{type: mongoose.Schema.Types.ObjectId,ref: 'petrol'},
  tank_capacity:Number,
  hour_cost:Number,
  km_cost:Number,

  meter_reading_start:Number,
  meter_reading_date_start:Date,
  meter_reading_end:Number,
  meter_reading_date_end:Date,

  icon:String,



},{ collection: 'car' });
carSchema.set('collection', 'car');


module.exports = mongoose.model('Car', carSchema,'car');
