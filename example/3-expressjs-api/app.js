// Load required packages
var express = require('express');
var bodyParser = require('body-parser');



// Create our Express application
var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());



app.set('port', 3000);

var path = require("path");
var libFile=require("./lib/file");

var common = require("./controllers/common");
var sendRes = require("./response").sendRes;

var router = express.Router();
// Create our Express router


router.route('/signin')
      .post(sendRes(common.signin));


app.use('/api', router);




module.exports = app;
