var mongoose = require('mongoose');
//var Project=require('../models/Proj');
var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  product_proj: { type: Schema.ObjectId, ref: 'Proj' },
  name:{type:String},
  productdesc: {type:String},
  priority: {type:Number},
  producttype: {type:String},
  productstatus: {type:String},
});


module.exports = mongoose.model('product', ProductSchema);
