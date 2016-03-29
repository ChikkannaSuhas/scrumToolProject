var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

/*var user = new mongoose.Schema({
	local:{
    username: {type:String, required:true, trim:true},
    //email: {type:String, required: true, trim: true, lowercase:true, unique: true},
    image: {type:String},
    password: {type:String, required: true },
    created: {type: Date, default: Date.now}
}
});
//var model = mongoose.model('User', user);

exports = module.exports = model;
//exports = module.exports = mongoose.model('User',user);*/
 
var users = new Schema({
    usernam: {type:String, required:true, trim:true},
    //email: {type:String, required: true, trim: true, lowercase:true, unique: true},
    email: {type:String},
    phonenumber: {type:Number},
    address: {type:String},
    productowner: {type:String},
    scrummaster: {type:String},
    password: {type:String, required: true },
    created: {type: Date, default: Date.now}
});

users.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.password === pwd );
};

module.exports= mongoose.model('users', users);
//var model = mongoose.model('User', user);