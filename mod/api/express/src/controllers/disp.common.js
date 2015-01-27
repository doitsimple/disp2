// Load required packages
var path = require("path");
var fs = require("fs");
var Db = require('../db');
^^if(global.uploadPath){$$
var uploadPath = "^^=global.uploadPath$$";
^^}$$
^^for (var key in global.multipartApiContents){$$
^^=global.multipartApiContents[key]$$
^^}$$
