var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
  taskname: String,
  taskdesc:String,
  taskstatus:String,
  tasksprintbacklog:{ type: Schema.ObjectId, ref: 'product' },
  sprinttask : { type: Schema.ObjectId, ref: 'sprint' },
  assignedto : { type: Schema.ObjectId, ref: 'users' }

});

module.exports= mongoose.model('task', TaskSchema);
