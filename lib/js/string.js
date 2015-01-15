function ucfirst(str) 
// convert the first character to uppercase
// discuss at: http://phpjs.org/functions/lcfirst/
// original by: Brett Zamir (http://brett-zamir.me)
{
	str += '';
	var f = str.charAt(0)
				.toUpperCase();
	return f + str.substr(1);
}
function escapeRegex(str){
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function quote(str){
	return (str+'').replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
}
function maskUtilLast(str, num){
  return str.substr(0, str.length-num).replace(/./g, "*") +
        str.substr(str.length-num, num);
}
module.exports.escapeRegex = escapeRegex;
module.exports.ucfirst = ucfirst;
module.exports.quote = quote;
module.exports.maskUtilLast = maskUtilLast;

