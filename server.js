var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser')
var session = require('express-session')
var _ = require('lodash');
var User = require('./models/users');
var flash = require('connect-flash');
var passport = require('passport');
var configDB = require('./config/database.js');
var http = require( 'http' );
var socket = require( 'socket.io' );
mongoose.connect(configDB.url);
//require('./config/passport')(passport);

// Create the application.
var app = express();
var users = {};
var server = http.createServer(app).listen(3000);
var Chat = require('./models/chat')

//var http = require('http').Server(app);
var io = socket.listen( server );
io.sockets.on('connection', function(socket){
    socket.on('new user', function(data, callback){
        if(data in users){
            callback(false);
        }else{
            callback(true);
            socket.nickname = data;
            users[socket.nickname] = socket;
            updateNicknames();
        }
    });

    function updateNicknames(){
        io.sockets.emit('usernames', Object.keys(users));
    }

    socket.on('send message', function(data, callback){
        var msg = data.trim();
        if(msg.substr(0,3) === '/w '){
            msg = msg.substr(3);
            var ind = msg.indexOf(' ');
            if(ind !== -1) {
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);
                if(name in users){
                    users[name].emit('whisper', {msg: msg, nick: socket.nickname});
                    console.log('whisper');
                }else{
                    callback('Error! Enter a valid user')
                }
            }else{
                callback('Error! Please enter a message for your whisper');
            }
        }else{
            var newMsg = new Chat({msg: msg, nick: socket.nickname});
            newMsg.save(function(err){
                if(err) throw err;
                io.sockets.emit('new message', {msg: msg, nick: socket.nickname});
            })

        }
    });

    socket.on('disconnect', function(data){
        if(!socket.nickname) return;
        delete users[socket.nickname];
        updateNicknames();
    })

});


app.use(express.static(__dirname + '/public'));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use(bodyParser.json()); // get information from html forms
        app.use(bodyParser.urlencoded({ extended: true }));






 // Load the models.
  //app.models = require('./models/users.js');

  /*app.get('/',function(req,res){
		//res.send("Hello World");
		User.find({}, function(err, users) {
  if (err) throw err;

  // object of all the users
  console.log(users);
  res.send(users);
});
	});*/

//var User = require('./models/user.js');
//passport.use(User.local);
//passport.serializeUser(User.local.serializeUser);
//passport.deserializeUser(User.local.deserializeUser);

//cookieparsing
app.use(cookieParser());
app.use(session({secret: 'abcdefg',
				saveUninitialized: true,
				resave: true}));

//Passport piggybacking
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Load the routes
require('./routes/router.js')(app,passport);

// Add Middleware necessary for REST API's
/*app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// CORS Support
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});*/

// Connect to MongoDB
//mongoose.connect('mongodb://localhost/myapp');
//require(./config/passport)(passport);
//mongoose.connection.once('open', function() {


  // Load the routes.
  // Set up your express routes

 // var routes = require('./routes/router');
 // _.each(routes, function(controller, route) {
 //   app.use(route, controller(app, route));
 // });
/*app.post('/auth/login', auth.login);
app.post('/auth/logout', auth.logout);
app.get('/auth/login/success', auth.loginSuccess);
app.get('/auth/login/failure', auth.loginFailure);
*/
  console.log('Listening on port 3000...');
  //app.listen(3000);

//});