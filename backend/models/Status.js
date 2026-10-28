const mongoose = require('mongoose');


const statusSchema = mongoose.Schema({
  name:String,
},{ collection: 'status' });
statusSchema.set('collection', 'status');
module.exports = mongoose.model('Status', statusSchema,'status');
