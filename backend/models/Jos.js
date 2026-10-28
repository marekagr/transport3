const mongoose = require('mongoose');


const josSchema = mongoose.Schema({
  IDK_JOS:String,
  NAZWA:String,
  STAN_DOSTEPN:String,
  IDK_JOS_NADRZ:String,
  TYP:String,
  PODTYP:String,
  OPK:String
},{ collection: 'jos' });
josSchema.set('collection', 'jos');
module.exports = mongoose.model('Jos', josSchema,'jos');
