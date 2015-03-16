var libObject = require("../../lib/js/object.js");
var Core = require("../../src/core");
module.exports = function(env){
	env.nodeDeps = env.nodeDeps || {};
	env.nodeDevDeps = env.nodeDevDeps || {};
	if(env.hasMultipart)
		env.nodeDeps["connect-multipart"] = "*";	
	if(!env.lib){
		var lib = {files: [
      "##js/string.js",
      "##js/array.js",
      "##js/object.js",
      "##js/date.js",
      "##js/random.js",
      "##js/sync.js",
      "##nodejs/file.js",
      "##nodejs/encrypt.js",
      "##nodejs/webreq.js"
    ]};
		Core.intepretJSON(lib);
		env.lib = lib;
	}
}
