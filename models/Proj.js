var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjSchema = new Schema({
  name: String,
  desc:String,
  Type:String,
  ScrumMaster:{ type: Schema.ObjectId, ref: 'users'},
  Developers: [{ type: Schema.ObjectId, ref: 'users' }]
});

module.exports= mongoose.model('Proj', ProjSchema);