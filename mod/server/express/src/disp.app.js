// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var libFile = require("./lib/file");


// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

^^if(global.staticPath){$$
app.use(express.static(__dirname + '/^^=global.staticPath$$'));
^^}$$

app.set('port', ^^=global.port$$);

^^for(var key in global.nodeAppContents){$$
^^=global.nodeAppContents[key]$$
^^}$$



module.exports = app;