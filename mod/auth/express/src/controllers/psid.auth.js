^^
var ucfirst = methods.ucfirst;
var usernameFieldName = global.userSchema.usernameField.name;
var idFieldName = global.userSchema.idField.name;
var passwordFieldName = global.userSchema.passwordField.name;
$$

// Load required packages
var passport = require('passport');
var User = require('../models/^^=global.userSchema.name$$');

var BearerStrategy = require('passport-http-bearer').Strategy;
passport.use("auth", new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));
module.exports.midware = passport.authenticate('auth', { session: false });




function auth(username, password, done){
  User.findOne({ '^^=usernameFieldName$$': username }, function(err, user) {
    if (err) { return done(err); }
    if (!user) {
			return done("Username doesn't exist", null, 1);
    }
    user.verifyPassword(password, function(err, isMatch){
			if(err) return done(err);
			else if(isMatch){
				user.getToken(function(err, token){
					if(err) return done(err);
					else{
						return done(null, {
							id: user.^^=idFieldName$$,
							username: user.^^=usernameFieldName$$,
							token: token
						});
					}
				});
			}
			else return done("Incorrect password", null, 2);
    });
  });
}

function signin(body, fn){
	if(body.body) body = body.body;
  if(!body.username || !body.password){
    fn("no username or password");
    return;
  }
  auth(body.username, body.password, fn);
}

function signup(body, fn){
	if(body.body) body = body.body;
	if(!body.username || !body.password){
		fn("no username or password");
		return;
	}

^^if(global.code){ var code = global.codeSchema.name;$$
	if(!body.code){
		fn("no validation code");
		return;
	}
	require("../models/^^=code$$").method.VerifyCode({
		id: body.username,
		code: body.code,
		minutes: 3
	}, function(err, valid){	
		if(err){
			fn(err);
			return;
		}
		if(!valid){
			fn("validation code error", null, 2);
			return;
		}
^^}$$
		var json = {};
		var user = json.^^=usernameFieldName$$ = body.username;
		var pass = json.^^=passwordFieldName$$ = body.password;
	  var model = new User(json);
		model.save(function(err, doc) {
    	if (err){
				if(err.code == 11000) fn(err, null, 1);
				else fn(err);
			}else{
^^if(local.signinAfterSignup){$$
				auth(user, pass, function(err, user, message){
					if(err) fn("signin after signup err");
					else fn(null, user);
				});
^^}else{$$
				fn(null, {
					id: doc.^^=idFieldName$$,
					username: doc.^^=usernameFieldName$$
				});
^^}$$
			}
		});
^^if(global.code){$$
	});
^^}$$
}

function checkDuplicateUser(username, fn){
	User.method.get({"^^=usernameFieldName$$": username}, null, function(err, result){
		if(err) fn(err);
		else 
			fn(null, !result);
	});
}

module.exports.auth = auth;
module.exports.signup = signup;
module.exports.signin = signin;
module.exports.checkDuplicateUser = checkDuplicateUser;


