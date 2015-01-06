module.exports.isArray = isArray;
function isArray(obj){
	return Object.prototype.toString.call( obj ) === '[object Array]';
}
module.exports.copy1 = copy1;
function copy1(obj)
//copy obj
{
	var rtnObj = {};
	if(obj)
		for(var key in obj)
			rtnObj[key] = obj[key];
	return rtnObj;
}
module.exports.extend1 = extend1;
function extend1(targetObj, obj)
//extend first level
{
	if(!targetObj) targetObj = {};
	if(obj)
		for(var key in obj)
			targetObj[key] = obj[key];
	return targetObj;
}

function append1(targetObj, obj)
//extend first level
{
	if(!targetObj) targetObj = {};
	if(obj)
		for(var key in obj){
			if(!targetObj.hasOwnProperty(key)){
				targetObj[key] = obj[key];
			}
		}
	return targetObj;
}
module.exports.append1 = append1;

function iterate(config, fnBasic, fnArray){
	for (var key in config){
		if(typeof config[key] == "object"){
			if(isArray(config[key])){
				fnArray(key, config);
			}else{
				iterate(config[key], fnBasic, fnArray);
			}
		}else{
			fnBasic(key, config);
		}
	}
}
module.exports.iterate = iterate;
function iterate2(config, config2, fnBasic, fnArray){
	if(!config2) config2 = {};
	for (var key in config){
		if(typeof config[key] == "object"){
			if(isArray(config[key])){
				fnArray(key, config, config2);
			}else{
				if(!config2[key]) config2[key] = {};
				iterate(config[key], config2[key], fnBasic, fnArray);
			}
		}else{
			fnBasic(key, config, config2);
		}
	}
}
module.exports.iterate2 = iterate2;


