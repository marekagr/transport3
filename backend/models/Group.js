const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  name: { type: String },
},{ collection: 'group' });
groupSchema.set('collection', 'group');
module.exports = mongoose.model('Group', groupSchema,'group');
