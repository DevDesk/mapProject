var express = require('express');
var request = require('request');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
var flash = require ('connect-flash');
var us = require('us')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// var db = require('./models');

app.get("/state", function(req,res){
	res.render("state");
});

app.get("/collapse", function(req,res){
	res.render("collapse");
});

app.get("/map", function(req,res){
	res.render("map");
});

app.get("/rightPanel", function(req,res){
	res.render("rightPanel");
});

app.get("/login", function(req,res){
	res.render("login");
})

app.get('/',function(req,res){
	var stateList = us.states;
	// var newArray = [];
		// for ( var i = 0; i < stateList.length; i++){
			// for (var state in stateList){
				// newArray.push(stateList[i]);
				// res.send(newArray);
			// }
			res.send(Object.keys(stateList));
		// }
	}
)
app.listen(process.env.PORT || 3000);