var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SprintSchema = new Schema({
  Pback_Sprint: [{ type: Schema.ObjectId, ref: 'product' }],
  Proj_Sprint: { type: Schema.ObjectId, ref: 'Proj' },
  sprintname:{type:String},
  sprintdesc: {type:String},
  timebox: {type:Number},
  sprintstatus: {type:String}
});

module.exports = mongoose.model('sprint', SprintSchema);


