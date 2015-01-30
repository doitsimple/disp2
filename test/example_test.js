var assert = require('assert');
var fs = require('fs');
var exec = require("child_process").exec;
var path = require("path");
var libFile = require("../lib/nodejs/file");
var exampleDir = path.resolve(__dirname + "/../example");
var disp2 = path.resolve(__dirname + "/../bin") + "/disp2";
describe('exampleTest', function() {
	before(function(){
  });
  it('example 1-simple', function(done) {
		console.log(exampleDir + "/1-simple");
		exec(disp2, {
			cwd: exampleDir + "/1-simple"
		}, function(err, stdout, stderr){
			console.log(stdout);
			console.log(stderr);
			assert.equal(null, err);
			assert.equal(true, libFile.isSameFile(
				exampleDir + "/1-simple/doc.txt",
				exampleDir + "/1-simple/doc.txt.test"
			));
			done();
		});
	});

});
