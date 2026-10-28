const mongoose = require('mongoose');


const configAppSchema = mongoose.Schema({
  defaultCar: [
    {
      default: { 
        type: Boolean, 
        required: true, 
        default: false 
      },
      car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true }
    }
  ]
},{ collection: 'configApp' });
configAppSchema.set('collection', 'configApp');
module.exports = mongoose.model('ConfigApp', configAppSchema,'configApp');