const mongoose = require('mongoose');


const targetSchema = mongoose.Schema({
  name:String,
},{ collection: 'target' });
targetSchema.set('collection', 'target');
module.exports = mongoose.model('Target', targetSchema,'target');
