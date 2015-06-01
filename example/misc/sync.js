var doSync = require("../../lib/js/sync").doSync;
var webreq = require("../../lib/nodejs/webreq");
function signin(env, fn){
	console.log(env.var1);
	webreq.postForm("", {}, function(err, result){
		fn();
	});
}
function signin2(env, fn){
	webreq.postForm("", {}, function(err, result){
		fn();
	});
}
doSync([signin, signin2], {var1: "variable1"},function(err, result){
	console.log(err);
	console.log(result);
});
