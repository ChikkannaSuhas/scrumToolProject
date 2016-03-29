var User = require('../models/users');
var bodyParser = require('body-parser');
var localStrategy = require('passport-local').Strategy;
var Project=require('../models/Proj');
var Product=require('../models/product');
var Sprint=require('../models/sprint')
var Task=require('../models/task')


//authentication to routes

module.exports = function(app,passport){
	passport.serializeUser(function(users,done){
		//console.log(users);
		done(null,users.id);
	});

	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,users){
			done(err,users);
			//console.log('user');
		});
	});
	function loggedIn(req, res, next) {
    if (req.user) {
      console.log("herei"+req.user)
        next();
    } else {
        res.redirect('/login');
    }
}

function Owner(req, res, next) {
    if (req.user.productowner=='YES') {
      console.log("herei"+req.user)
        next();
    } else {
        res.redirect('/login');
    }
}

function Master(req, res, next) {
    if (req.user.scrummaster=='YES') {
      console.log("herei"+req.user)
        next();
    } else {
        res.redirect('/');
    }
}

	passport.use('local-login',new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        // usernameField:'req.body.username',
  		 //passwordField:'req.body.password',
        passReqToCallback:true // allows us to pass back the entire request to the callback
    },
    function(req,username,password,done) { 
    	
    	
    // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'usernam' :  username }, function(err, users) {
            // if there are any errors, return the error before anything else

            //console.log('hello'+req.body.password);
            if (err){
                return done(err);
            }

            // if no user is found, return the message
            if (!users)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!users.validPassword(req.body.password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            return done(null, users);
        });

    }));

passport.use('local-signup',new localStrategy({
        // by default, local strategy uses username and password, we will override with email
        // usernameField:'req.body.username',
  		 //passwordField:'req.body.password',

        passReqToCallback:true // allows us to pass back the entire request to the callback
    },
    function(req,username,password,done) { 
    	//console.log('hello'+username);
    	
    // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'usernam' :  username }, function(err, users) {
            // if there are any errors, return the error before anything else

            console.log('hello');
            if (err){
                return done(err);
            }

            // if no user is found, return the message
            if (users)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
            

            // if the user is found but the password is wrong
            //if (!users.validPassword(req.body.password))
              //  return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
				
            // all is well, return successful user
           // return done(null, users);
           else
           {
           	console.log("i m here")
           	var newUser=new User();
           	newUser.usernam=req.body.username;
           	newUser.password=req.body.password;
           	newUser.email=req.body.email;
           	newUser.productowner=req.body.productowner;
           	newUser.scrummaster=req.body.scrummaster;
           	newUser.save(function(err){
           		if(err)
           			throw err;
           	})
           	console.log("success");}
           
        });

    }));

app.get('/chats',loggedIn,function(req,res){
        
    res.sendfile('views/chats.html');
  })

	app.get('/index',loggedIn,function(req,res){
      	
		res.sendfile('views/index.html');
  })

  app.get('/edit',loggedIn,function(req,res){
        
    res.sendfile('views/EditProfile.html');
  })

  app.post('/edit',loggedIn,function(req,res){
        //console.log(req.user)
        req.user.usernam=req.body.Name
        req.user.address=req.body.Address
        req.user.phonenumber=req.body.PhoneNumber
        req.user.password=req.body.password
        req.user.email=req.body.Email
        console.log(req.user.address)
        req.user.save(function(err){
              if(err)
                throw err;
            })
      
    })

	app.get('/registeration', function(req, res) {
    res.sendfile('views/Registerationpage.html');
	})
	
	//require('./controllers/authController.js')(User.local,passport);

	app.get('/', function(req, res) {
    res.sendfile('views/loginpage.html');
	})

	app.get('/logout',loggedIn, function(req, res) {
		req.session.destroy();
    res.redirect('/');
	})

	/*app.get('/project/:users', function(req, res){
  //JSON file in the /public/skills directory
  //res.sendFile(__dirname + '/public/skills/'+req.params.skill+".json");

  //or some database lookup followed by a json send:
  var users = db.users.local.username.find();
  res.json(users);
 });*/

app.get('/',function(req,res){

    res.sendfile('views/chat.html');

});


app.get('/projectview/sprint', function(req, res) {
  console.log("suhas")
    res.sendfile('views/sprinttable.html');
  })

app.get('/projectview/sprint/task', function(req, res) {
  console.log("suhas")
    res.sendfile('views/tasks.html');
  })

app.get('/projectview/sprint/task/tasks', function(req, res) {
  console.log("suhas")
    res.sendfile('views/task.html');
  })


app.get('/projectview/sprint/sprint', function(req, res) {
  console.log("suhas")
    res.sendfile('views/sprints.html');
  })

app.get('/projectview/sprint/sprint/sprintproj', function(req, res) {
  console.log("suhas")
    res.sendfile('views/sprint_proj.html');
  })


app.get('/sprint/sprints',function(req,res){
    Sprint.find({}).exec(function(err, sprint) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(sprint);
            }
        });

  })

app.post('/sprint_backlog',function(req,res){
  console.log(req.body.abc)
    Sprint.find({'Proj_Sprint': req.body.abc}).populate ('Proj_Sprint').exec (function (err, sprint)
    {
      console.log(sprint)
      if(err)
        return done(err);
      if(sprint.sprintstatus=='In Progress'){
        console.log(sprint.sprintname)
        sprint.Pback_Sprint=req.body.selecteddevelopers
        console.log("congrats")}
    })})


app.post('/sprint_pr',function(req,res){
  console.log(req.body.abc)
    Sprint.findOne({'Proj_Sprint': req.body.abc}).populate ('Proj_Sprint').exec (function (err, sprint)
    {
      console.log(sprint)
      if(err)
        return done(err);
      if(sprint.sprintstatus=='In Progress'){
        console.log(sprint.sprintname)
        sprint.Pback_Sprint=req.body.selecteddevelopers
        sprint.save(function(err){
              if(err)
                throw err;
              console.log("sucs")
            })
        console.log("congrats")}
        /*Sprint.find({'Pback_Sprint': sprint.Pback_Sprint}).populate ('Pback_Sprint').exec (function (err, sprinti)
         {
          sprinti.Pback_Sprint.productstatus='In-progress'
          console.log("yay")
         } 
         )*/
    }
    )})


app.post('/updatesprint',Owner,function(req,res){
    Sprint.findOne({'sprintname':req.body.name},function(err,sprint)
    {
      
      if(err)
        return done(err);
      if(sprint)
        {
        var newProj=new Sprint();
        sprint.sprintname=req.body.name;
        sprint.sprintdesc=req.body.description;
        sprint.timebox=req.body.timebox
        console.log(req.body.status)
        sprint.sprintstatus=req.body.status
        sprint.Proj_Sprint=req.body.selectedproject
        
        sprint.save(function(err){
              if(err)
                throw err;
              console.log("sucs")
            })
            console.log("success")
        //newProj.ScrumMaster=req.body.scrumaster
        //newProj.Developers=req.body.developers
      }
      
})})


app.post('/sprint',loggedIn,function(req,res){
    Sprint.findOne({'sprintname':req.body.name},function(err,sprint)
    {
      
      if(err)
        return done(err);
      if(sprint)
        return done("exists");
      else{
        var newProj=new Sprint();
        newProj.sprintname=req.body.name;
        newProj.sprintdesc=req.body.description;
        newProj.timebox=req.body.timebox
        console.log(req.body.status)
        newProj.sprintstatus=req.body.status
        newProj.Proj_Sprint=req.body.selectedproject
        
        newProj.save(function(err){
              if(err)
                throw err;
              console.log("sucs")
            })
            console.log("success")
        //newProj.ScrumMaster=req.body.scrumaster
        //newProj.Developers=req.body.developers
      }
      
})})

app.get('/projectview',loggedIn, function(req, res) {
    res.sendfile('views/tablea.html');
  })

app.get('/currentuser',loggedIn, function(req, res) {
    res.send(req.user);
    console.log(req.user.usernam)
  })

app.get('/pro', Owner,function(req, res) {
    res.sendfile('views/formproj.html');
  })

app.get('/pro/project', Owner,function(req, res) {
    res.sendfile('views/newprojdev.html');
  })

app.get('/project', loggedIn,function(req, res) {
    res.sendfile('views/newprojdev.html');
  })

  app.post('/proj_sprint',function(req,res){
    
    console.log("hi")
    console.log(req.body.abc)
    Product.find ({'product_proj': req.body.abc}).populate ('product_proj').exec (function (err, produc) {
    //console.log(req.body.selectedproject)
    return res.json (produc);
  })
    /*Product.findOne({'product_proj.name':req.body.name},function(err,prod)
    {
      //console.log(prod)
      console.log("ucc")
      if(err)
        return done(err);
      if(prod)
        if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                console.log(prod.product_proj.name)
                console.log("succ")
                res.json(prod);

            }
        /*{
          Sprint.findOne({'Proj_Sprint.name':prod.product_proj.name},function(err,sprint)
    {
      
      if(err)
        return done(err);
      if(sprint)
        sprint.Pback_Sprint=prod;
        sprint.save(function(err){
              if(err)
                throw err;
            })
            console.log("success")
        //newProj.ScrumMaster=req.body.scrumaster
        //newProj.Developers=req.body.developers
      }
      
)}})*/


  })

  app.get('/project/users',loggedIn,function(req,res){
    User.find({ 'productowner': { $ne:'YES'}}).exec(function(err, users) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(users);
            }
        });

  })



	app.get('/project', function(req, res) {
    res.sendfile('views/newprojdev.html');
	})

	app.post('/project',function(req,res){
		Project.findOne({'name':req.body.name},function(err,proj)
		{
			if(err)
				return done(err);
			if(proj)
				return done("exists");
			else{
				var newProj=new Project();
				newProj.name=req.body.name;
				newProj.desc=req.body.description;
				newProj.Type=req.body.singleSelect
        newProj.save(function(err){
              if(err)
                throw err;
            })
            console.log("success")
				//newProj.ScrumMaster=req.body.scrumaster
				//newProj.Developers=req.body.developers
			}
			
})})

  app.get('/projectview/backlog', function(req, res) {
    res.sendfile('views/formproductbac.html');
  })

  app.get('/backlog/backlogs',function(req,res){
    Product.find({}).exec(function(err, prod) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(prod);
            }
        });

  })


app.post('/task',function(req,res){
    
    Task.findOne({'taskname':req.body.name},function(err,prod)
    {
      if(err)
        return done(err);
      if(prod)
        return done("exists");
      else{
        
        var newProd=new Task();
        newProd.taskname=req.body.name;
        newProd.taskdesc=req.body.description;
        newProd.taskstatus=req.body.type
        newProd.tasksprintbacklog=req.body.selecteddeveloper
        newProd.sprinttask=req.body.selectedsprint
        newProd.assignedto=req.body.selecteddeveloperi
        newProd.save(function(err){
              if(err)
                throw err;
            })
        
        
            console.log("success")
            return
      }
      
})  
  })


app.get('/tasks',function(req,res){
    Task.find({}).exec(function(err, use) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
              console.log(use)
                res.json(use);

            }
        });

  })


app.post('/upbacklog',Owner,function(req,res){
    
    Product.findOne({'name':req.body.name},function(err,prod)
    {
      if(err)
        return done(err);
      if(prod)
        {
        prod.name=req.body.name;
        prod.productdesc=req.body.description;
        prod.product_proj=req.body.selectedproject
      prod.priority=req.body.priority
        prod.producttype=req.body.type
        prod.productstatus=req.body.status
        prod.save(function(err){
              if(err)
                throw err;
            })
        
        
            console.log("success")
            return
      }
      
})  
  })



  app.post('/backlog',Owner,function(req,res){
    
    Product.findOne({'name':req.body.name},function(err,prod)
    {
      if(err)
        return done(err);
      if(prod)
        return done("exists");
      else{
        
        var newProd=new Product();
        newProd.name=req.body.name;
        newProd.productdesc=req.body.description;
        newProd.product_proj=req.body.selectedproject
        newProd.priority=req.body.priority
        newProd.producttype=req.body.type
        newProd.productstatus=req.body.status
        newProd.save(function(err){
              if(err)
                throw err;
            })
        
        
            console.log("success")
            return
      }
      
})  
  })

   app.get('/users',function(req,res){
    User.find({}).exec(function(err, users) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
              console.log(users)
                res.json(users);

            }
        });

  })

  app.get('/projects',function(req,res){
    Project.find({}).exec(function(err, projs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.json(projs);
            }
        });

  })

  app.post('/projects',function(req,res){
    console.log(req.body.selectedproject.name)
    Project.findOne({'name':req.body.selectedproject.name},function(err,proj)
    {
      if(err)
        return done(err);
      if(proj)
        {
          console.log("ccess")
        //newProj.name=req.body.name;
        //newProj.desc=req.body.description;
        proj.Developers=req.body.selecteddevelopers
        proj.save(function(err){
              if(err)
                throw err;
              console.log("success")
            })
            //console.log("success")
        //newProj.ScrumMaster=req.body.scrumaster
        //newProj.Developers=req.body.developers
      }
      
})})

	/*app.post('/login',passport.authenticate('local-login',{
		successRedirect:'/',
		failureRedirect: 'yahoo.com',
		failureFlash : true

	}))*/

app.post(
  '/login', 
  passport.authenticate('local-login', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log("i am here"+req.body.password)
    res.json({status: 200});
    //res.redirect('/index');
  }
)
/*app.post('/login', bodyParser.urlencoded({ extended: true }), function (req, res, next) {
          passport.authenticate('local', function (err, user, info) {
               if (err) { return next(err) }
               if (!user) {
                    console.log('bad');
                    req.session.messages = [info.message];
                    return res.redirect('/login')
               }
               req.logIn(user, function (err) {
                    console.log('good');
                    if (err) { return next(err); }
                    return res.redirect('/');
               });
          })(req, res, next);
     });*/

	/*app.post('/login', 
  passport.authenticate('local-login', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/login.html');
  });*/
	/*app.post('/login', function(req, res) {
    var newuser= new User();
    newuser.local.username=req.body.username;
    newuser.local.password=req.body.password;
    res.redirect('/');
	});*/	

	app.get('/loginFailure', function(req, res, next) {
 	res.send('Failed to authenticate');
	});

	app.post(
  '/registeration', 
  passport.authenticate('local-signup', { failureRedirect: '/login' }),
  function(req, res) {
  	console.log("i am here"+req.body.password)
    res.json({status: 200});
    //res.redirect('/index');
  })

	app.get('/loginSuccess', function(req, res, next) {
  	res.send('Successfully authenticated');
	});

	/*app.get('/:username/:password',function(req,res){
		var newuser= new User(); 
		newuser.local.username=req.params.username;
		newuser.local.password=req.params.password;
		console.log(newuser.local.username);
		newuser.save(function(err){
			if(err)
				throw  err;
		});
		res.send("Success");
	})*/
}