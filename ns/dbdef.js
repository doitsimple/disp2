var libString = require("../lib/js/string");
var ucfirst = libString.ucfirst;


var table = {};
table.Boolean = table.bool = table.boolean = {
	"name": "bool",
	"basic": "int",
	"mongoose": "Boolean",
	"mysql": "BOOLEAN",
	"sqlite": "INTEGER",
	"java": "boolean",
	"js": "boolean",
	"jstest": "true"
};
table.Integer = table.int = table.Int = {
	"name": "int",
	"basic": "int",
	"mongoose": "Number",
  "mysql": "INT",
  "sqlite": "INTEGER",
  "java": "int",
  "js": "number",
	"jstest": "1"
};
table.TinyInteger = table.tinyint = table.TinyInt = {
	"name": "tinyint",
	"basic": "int",
	"mongoose": "Number",
  "mysql": "TINYINT",
  "sqlite": "INTEGER",
  "java": "int",
  "js": "number",
	"jstest": "1"
};
table.SmallInteger = table.smallint = table.SmallInt = {
	"name": "smallint",
	"basic": "int",
	"mongoose": "Number",
  "mysql": "SMALLINT",
  "sqlite": "INTEGER",
  "java": "int",
  "js": "number",
	"jstest": "1"
};
table.MediumInteger = table.mediumint = table.MediumInt = {
	"name": "mediumint",
	"basic": "int",
	"mongoose": "Number",
  "mysql": "MEDIUMINT",
  "sqlite": "INTEGER",
  "java": "int",
  "js": "number",
	"jstest": "1"
};
table.BigInteger = table.bigint = table.BigInt = {
	"name": "bigint",
	"basic": "int",
	"mongoose": "Number",
  "mysql": "BIGINT",
  "sqlite": "INTEGER",
  "java": "long",
  "js": "number",
	"jstest": "1"
};
table.Number = table.number = table.num 
	= table.double = table.Double = {
		"name": "double",
	"basic": "long",
	"mongoose": "Number",
  "mysql": "DOUBLE",
  "sqlite": "REAL",
  "java": "double",
  "js": "number",
	"jstest": "0.1"
};
table.Float = table.float = {
	"name": "float",
	"basic": "double",
	"mongoose": "Number",
  "mysql": "FLOAT",
  "sqlite": "REAL",
  "java": "double",
  "js": "number",
	"jstest": "0.1"
};

table.Date = table.date = {
	"name": "date",
	"basic": "string",
	"mongoose": "String",
  "mysql": "DATE",
  "sqlite": "TEXT",
  "java": "Date",
  "js": "object",
	"jstest": "'1970-01-01'"
};
table.DateTime = table.datetime = {
	"name": "datetine",
	"basic": "string",
	"mongoose": "Date",
  "mysql": "DATETIME",
  "sqlite": "TEXT",
  "java": "Date",
  "js": "object",
	"jstest": "new Date()"
};
table.Char = table.char = {
	"name": "char",
	"basic": "string",
	"mongoose": "String",
  "mysql": "CHAR",
  "sqlite": "TEXT",
  "java": "String",
  "js": "string",
	"jstest": "'a'"
};
table.VarChar = table.varchar = {
	"name": "varchar",
	"mongoose": "String",
  "mysql": "VARCHAR",
  "sqlite": "TEXT",
  "java": "String",
  "js": "string",
	"jstest": "'a'"
};
table.String = table.string = {
	"name": "string",
	"basic": "string",
	"mongoose": "String",
  "mysql": "VARCHAR(100)",
  "sqlite": "TEXT",
  "java": "String",
  "js": "string",
	"jstest": "'a'"
};
table.Array = table.array = {
	"name": "string",
	"basic": "string",
	"mongoose": "Array",
  "mysql": "VARCHAR(255)",
  "sqlite": "TEXT",
  "java": "List<String>",
  "js": "object",
	"jstest": "['1','2']"
};
table.Text = table.text = {
	"name": "string",
	"mongoose": "String",
  "mysql": "VARCHAR(255)",
  "sqlite": "TEXT",
  "java": "String",
  "js": "string",
	"jstest": "'a'"
};
table["enum"] = table.Enum = table.Index = table.index 
	= table.Select = table.select = {
	"name": "enum",
	"basic": "string",
	"mongoose": "Number",
  "mysql": "ENUM",
  "sqlite": "INTEGER",
  "java": "char",
  "js": "number",
	"jstest": 1
};
table.Path = table.path = {
	"name": "path",
	"basic": "string",
	"mongoose": "String",
  "mysql": "VARCHAR(255)",
  "sqlite": "TEXT",
  "java": "String",
  "js": "string",
	"jstest": "'a'"
};

table.Buffer = table.buffer = table.Blob = table.blog = {
	"name": "buffer",
	"basic": "string",
	"mongoose": "Buffer",
	"mysql": "BLOB",
	"sqlite": "BLOB",
	"java": "String",
	"js": "string",
	"jstest": "'a'"
};

/*
table.Set = table.set = table.mulitselect = table.MultiSelect = {
	"name": "set",
	"js": ""
};
*/

function getType(f, c, prefix){

	if(!f.type){
		console.error("no type for schema "+JSON.stringify(f));
		process.exit(1);
	}
	if(!c){
		console.error("no class, should be mongoose, mysql ... ");
		process.exit(1);
	}
	if(c=="jstest" && table[f.type].basic == "string"){
		if(!prefix) prefix = "test";
		return "'" + prefix +f.name + "'";
	}
		
	var v = table[f.type][c];
	if(v) return v;
	else {
		console.error("undefied type: "+f.type);
		process.exit(1);
	}
}
function getField(name, fields){
	var field;
	fields.forEach(function(f){
		if(f.name == name)
			field = f;
	});
	return field;
}
function extendSchemas(env){
	for(var key in env.schemas){
		var schema = env.schemas[key];
		if(!schema.name) schema.name = key;
		if(!schema.engine) schema.engine = "mongo";

		if(schema.isUserSchema) env.userSchema = schema;
		else schema.isUserSchema = false;
		if(schema.isTokenSchema) env.tokenSchema = schema;
		else schema.isTokenSchema = false;
		if(schema.isCodeSchema) env.codeSchema = schema;
		else schema.isCodeSchema = false;

		schema.idField = schema.fields[0];

		if(!schema.userIdField) schema.userIdField = false;
		if(!schema.phoneField) schema.phoneField = false;
		if(!schema.emailField) schema.emailField = false;
		if(!schema.usernameField) schema.usernameField = false;
		if(!schema.passwordField) schema.passwordField = false;
		if(!schema.tokenField) schema.tokenField = false;
		if(!schema.codeField) schema.codeField = false;
		if(!schema.timeField) schema.timeField = false;

		schema.fields.forEach(function(f){
			if(f.isUserId) schema.userIdField = f;
			if(f.isPhone) schema.phoneField = f;
			if(f.isEmail) schema.emailField = f;
			if(f.isPassword) schema.passwordField = f;
			if(f.isUsername) schema.usernameField = f;
			if(f.isToken)	schema.tokenField = f;
			if(f.isCode)	schema.codeField = f;
			if(f.isTime)	schema.timeField = f;
/*
			if(f.upload){
				var nameStr = ucfirst(schema.name) + ucfirst(f.name); 
				if(!f.media) f.media = "Image";
				env.apis["upload" + nameStr] = {
					"route": schema.name + "/" + f.name,
					"text": "上传" + f.text,
					"multipart": true,
					"method": "post",
					"params": [
            {
              "name": "_id"
            }
					],
					"fields": [
            {
              "name": f.name,
              "type": f.media
            }
					],
					"db": schema.name,
					"auth": true
				};
			};
*/
		});
		
	}
}
function extendApis(env){
	env.hasMultipart = false;
	for(var key in env.apis){
		var api = env.apis[key];
		if(!api.type) api.type = false;
		if(api.multipart)
			env.hasMultipart = true;
		if(api.isSignin)
			env.signinApi = api;
		else
			api.isSignin = false;
		if(api.isSignup)
			env.signupApi = api;
		else
			api.isSignup = false;
		if(api.isSignupSendCode)
			env.signupSendCodeApi = api;
		else
			api.isSignupSendCode = false;

		if(!api.fields) api.fields = [];

		if(!api.db) api.db = false;
		if(!api.fieldFromSchema) api.fieldFromSchema = false;
		else if(api.db){
			env.schemas[api.db].fields.slice(1).forEach(function(f){
				if(!f.auto) return api.fields.push(f);
			});
		}


		if(!api.name) api.name = key;
		if(!api.text) api.text = key;
		if(!api.route) api.route = key;
		if(!api.params) api.params = [];
		if(!api.querys) api.querys = [];
		if(!api.errorCode) api.errorCode = {};
		if(!api.isList) api.isList = false;
		if(!api.saveArg) api.saveArg = false;
		if(!api.saveRes) api.saveRes = false;
		if(!api.saveAuth) api.saveAuth = false;
		if(!api.auth) api.auth = false;
		if(!api.multipart) api.multipart = false;
		if(!api.withResult) api.withResult = false;
	}
}
module.exports.extendApis = extendApis;
module.exports.extendSchemas = extendSchemas;
module.exports.getType = getType;
module.exports.getField = getField;

