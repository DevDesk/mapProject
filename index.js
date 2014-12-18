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


//userAuth
//create custom middleware step 1
app.use(function(req, res, next){


	/////////////////////// AUTO LOGIN DELETE LATER
	// req.session.user = {
	// 	id:23,   //id of user (only part that matters)
	// 	email: 's@w.com',
	// 	firstName: 'steve',
	// 	lastName: 'w',
	// 	userName: 'sw'
	// };
	//////////////////////////////////////////////////

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

//fills drop down menu on home page with list of States
app.get("/", function(req,res){
	var stateList = us.states;
	var stateListKey = Object.keys(stateList);
	var user = req.getUser();
	var currentUser = req.session.user;
	//User is false when logged out
	//currentUser is undefined when logged out
	if(user === false || currentUser === 'undefined'){
		res.render('index',{user:false,stateListKey:stateListKey,sites:false})
	} else {
		db.user.find(currentUser).then(function(returnedUser){
			returnedUser.getSites().then(function(postData){
				res.render('index',{user:user,stateListKey:stateListKey,sites:postData});
			})	
		// res.render("index",{stateListKey:stateListKey});
		})
	}
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
});


app.post("/auth/login", function(req,res){
	db.user.find({where:{email: req.body.loginEmail}}).then(function(userObj){
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
				} else {
					req.flash("danger", "invalid password");
					res.redirect("/incorrectLogin");
				}
			})
		} else {
			req.flash("danger", "User not found");
			res.redirect("/incorrectLogin");
		}
	});
});

app.post("/submit/site", function(req, res){
	var currentUser = req.session.user;
	// res.sendStatus(currentUser.id);
	// console.log(currentUser);
	if(currentUser === undefined){
		req.flash("danger", "Register or Login to Save Sites!");
		res.redirect('/');
	} else {
		db.user.find({where:{id: currentUser.id}}).then(function(userObj){
			// res.sendStatus(currentUser.id);

			var siteData = {
				userId:currentUser.id,
				siteName:req.body.siteName,
				// siteRef:req.body.siteRef,
				image:req.body.image,
				address1:req.body.address1,
				address2:req.body.address2,
				city:req.body.city,
				state:req.body.state,
				zip:req.body.zip,
				county:req.body.county,
				// longitude:req.body.longitude,
				// latitude:req.body.latitude,
				siteUrl:req.body.siteUrl,
				siteNotes:req.body.siteNotes
			};
			//DATES CANNOT BE EMPTY STRINGS
			if(req.body.dateVisited){
				siteData.dataVisited=new Date(req.body.dateVisited).toString();
			}

			//GET LAT AND LNG IF WE HAVE AN ADDRESS
			if(req.body.address1 && req.body.city && req.body.state && req.body.zip){
				var fullAddress = req.body.address1 + ' ' + req.body.city + ', '+ req.body.state + ' ' + req.body.zip;
				geocoder.geocode(fullAddress, function( err, data) {
					if(data.results && data.results.length > 0){
						siteData.latitude = data.results[0].geometry.location.lat;
						siteData.longitude = data.results[0].geometry.location.lng;					
						saveSiteToDatabase();
					}else{
						saveSiteToDatabase();
					}
				});			
			}else{
				saveSiteToDatabase();
			}

			//FUNCTION TO SAVE OBJECT DATA ABOVE TO DATABASE
			var saveSiteToDatabase = function(){
				db.site.create(siteData).then(function(postData){
					res.redirect('/');
				});
			}
		})
	}
});

// app.get('/saved/sites', function (req, res) {
// 	$('savedSites a').click(function (e) {
// 	  e.preventDefault()
// 	  $(this).tab('show');
// 	  console.log(getUser());
// 	})
// })


// //userAuth - Logout
app.get('/auth/logout',function(req,res){
    // res.send('logged out');
    delete req.session.user;
    req.flash('info','You have been logged out.');
    res.redirect("/");
});


app.listen(process.env.PORT || 3000);