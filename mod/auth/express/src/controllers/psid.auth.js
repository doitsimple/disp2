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

function signin(req, fn){
  if(!req.body.username || !req.body.password){
    fn("no username or password");
    return;
  }
  auth(req.body.username, req.body.password, fn);
}

function signup(req, fn){
	var body = req.body;
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
			fn("validation code error");
			return;
		}
^^}$$
		var json = {};
		var user = json.^^=usernameFieldName$$ = body.username;
		var pass = json.^^=passwordFieldName$$ = body.password;
	  var model = new User(json);
		model.save(function(err, doc) {
    	if (err)
				fn(err);
			else{
^^if(signinAfterSignup){$$
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
^^global.userSchema.fields.forEach(function(f){$$
 ^^if(f.encrypt){$$
function verify^^=ucfirst(f.name)$$(req, fn){
	User.method.verify^^=ucfirst(f.name)$$ById(req.body.id, req.body.password, function(err, isMatch){
		if(err) {fn(err); return; }
		fn(null, {result: isMatch});
	});
}
module.exports.verify^^=ucfirst(f.name)$$ = verify^^=ucfirst(f.name)$$;
 ^^}$$
^^})$$
module.exports.auth = auth;
module.exports.signup = signup;
module.exports.signin = signin;
module.exports.checkDuplicateUser = checkDuplicateUser;


