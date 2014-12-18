var express = require('express');
var request = require('request');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var flash = require ('connect-flash');
var us = require('us');
var geocoder = require('geocoder');

var db = require('./models');

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: 'mothers maiden name',
    resave: false,
    saveUninitialized: true
}))

app.use(flash());


app.get("/state", function(req,res){
	res.render("state");
});

app.get("/collapse", function(req,res){
	res.render("collapse");
});

// app.get("/siteForm", function(req,res){
// 	var stateList = us.states;
// 	var stateListKey = Object.keys(stateList);
// 	// res.send(Object.keys(stateList));
// 	res.render("siteForm",{stateListKey:stateListKey});
// });

//userAuth
//create custom middleware step 1
app.use(function(req, res, next){
	req.getUser = function(){
		return req.session.user || false;
	}
	next();
})

//userAuth
//below could use app.use to apply middleware(route) to all app.get / app.post / etc.
//use next to make sure passes through to all other routes
app.get('*', function(req,res,next){
    var alerts = req.flash();
    res.locals.alerts = alerts;
    res.locals.user = req.getUser();
    next();
});

app.get("/search", function(req,res){
	geocoder.geocode(req.query.searchAddress, function( err, data) {
		// for(var i = 0; i < data.results.length; i++) {
		var lat = data.results[0].geometry.location.lat;
		var lng = data.results[0].geometry.location.lng;
		var latlng = lat + "," + lng;

		res.send('mapData',{latlng:latlng});
	// }
	});
})


app.get("/", function(req,res){
	var stateList = us.states;
	var stateListKey = Object.keys(stateList);
	var user = req.getUser();
	res.render('index',{user:user,stateListKey:stateListKey});
	// res.render("index",{stateListKey:stateListKey});
});

app.get("/rightPanel", function(req,res){
	res.render("rightPanel");
});

app.get("/login", function(req,res){
	res.render("login");
});

app.get("/navbar", function(req,res){
	res.render("navbar");
});

app.get("/incorrectLogin", function(req, res){
	res.render("incorrectLogin");
});

app.get("/register", function(req, res){
	res.render("register");
});

app.post("/auth/register", function(req,res){
	// res.send(req.body);
	db.user.findOrCreate(
		{
			where: {email: req.body.emailRegistration},
			defaults: {
				email: req.body.emailRegistration, 
				password: req.body.passwordRegistration, 
				firstName: req.body.firstNameRegistration,
				lastName: req.body.lastNameRegistration,
				userName: req.body.userNameRegistration
			}	
		}
	).spread(function(userObj, created){
		if(created===true){

			req.session.user = {
				id: userObj.id,
				email: userObj.email,
				firstName: userObj.firstName,
				lastName: userObj.lastName,
				userName: userObj.userName
			};

			req.flash('info','Registration Successful!');
			res.redirect('/');
		} else {
			req.flash('danger','this email is already registered');
			res.redirect('/register');
		}
		// res.send(user)
			// res.send({signUpData:data, wasCrated: created});
			// res.redirect('/');
	}).catch(function(error){
		if(error && Array.isArray(error.errors)){
			error.errors.forEach(function(errorItem){
				req.flash('danger',errorItem.message);
			});
		} else {
			console.log('---------------',error);
			req.flash('danger','unknown error');
		}
		// res.send(error.errors)
		res.redirect('/register');
	});
	// user is signed up forward them to the home page
	// res.redirect('/');
});


app.post("/auth/login", function(req,res){
	// res.send(req.body);
	db.user.find({where:{email: req.body.loginEmail}}).then(function(userObj){
		// res.send(req.body.loginEmail);
		if(userObj){
			bcrypt.compare(req.body.loginPassword, userObj.password, function (err, match){
				if (match === true) {
					req.session.user = {
						id: userObj.id,
						email: userObj.email,
						firstName: userObj.firstName,
						lastName: userObj.lastName,
						userName: userObj.userName
					};
					res.redirect("/");
					// res.send("correct password");
				} else {
					// res.send("invalid password");
					req.flash("danger", "invalid password");
					res.redirect("/incorrectLogin");
				}
			})
			// res.send("User found ... check password")
		} else {
			// res.send("User not found");
			req.flash("danger", "User not found");
			res.redirect("/incorrectLogin");
		}
	});
	// res.redirect("/");
});




// //userAuth - working
// app.get('/',function(req,res){
//     var user = req.getUser();
//     // res.send(req.flash());
//     // var alerts = req.flash();
//     res.render('index',{user:user});
//     // removed from line above and added to app.get('*') alerts above
//     // , alerts:alerts
// });

// //userAuth - in Modal of root, don't need to launch extra pg?
// //login form
// app.get('/login',function(req,res){
//     res.render('login');
// });

// //userAuth  -- need help: how to redirect to Modal
// app.post('/login',function(req,res){
//     //do login here (check password and set session value)

//     //user is logged in forward them to the home page
//     // res.send(req.body);
//     db.user.find({where:{email: req.body.email}}).then(function(userObj){
//         if(userObj){
//             bcrypt.compare(req.body.password, userObj.password, function (err, match){
//                 if (match === true) {
//                     //store user object in session
//                     req.session.user = {
//                         id: userObj.id,
//                         email: userObj.email,
//                         name: userObj.name
//                     };
//                     res.redirect("/");
//                     // res.send("correct password");
//                 } else {
//                     // res.send("invalid password");
//                     req.flash("danger", "invalid password");
//                     res.redirect("/login");
//                 }
//             })
//             // res.send("User found... check password")
//         } else {
//             // res.send("User not found");
//             req.flash("danger", "User not found");
//             res.redirect("/login");
//         }
//     });
//     // res.redirect('/');
// });

// //userAuth
// //sign up form
// app.get('/auth/signup',function(req,res){
//     res.render('signup');
// });

// //userAuth
// app.post('/auth/signup',function(req,res){
//     //do sign up here (add user to database)
//     db.user.findOrCreate(
//         {
//             where: {email: req.body.email},
//             defaults: {email: req.body.email, password: req.body.password, name: req.body.name}
//         }
//     ).spread(function (user, created) {
//         res.send(user)
//             // res.send({signUpData:data, wasCreated: created});
//     }).catch(function(error){
//         if(error && Array.isArray(error.errors)){
//             // res.send(Array.isArray(error.errors));
//             // res.send(error.errors);
//             error.errors.forEach(function(errorItem){
//                 req.flash('danger',errorItem.message);
//             });
//         }else{
//             req.flash('danger','unknown error');
//         }
//         // res.send(error.errors)
//         res.redirect('/auth/signup');
//     });

//     //user is signed up forward them to the home page
//     // res.redirect('/');
// });

// //userAuth
// //logout
// //sign up form
app.get('/auth/logout',function(req,res){
    // res.send('logged out');
    delete req.session.user;
    req.flash('info','You have been logged out.');
    res.redirect("/");
});



//testing US from NPM to get States in USA
// app.get('/siteForm',function(req,res){
// 	var stateList = us.states;
// 	// var newArray = [];
// 		// for ( var i = 0; i < stateList.length; i++){
// 			// for (var state in stateList){
// 				// newArray.push(stateList[i]);
// 				// res.send(newArray);
// 			// }
// 			res.send(Object.keys(stateList));
// 		// }
// 	}
// );
app.listen(process.env.PORT || 3000);