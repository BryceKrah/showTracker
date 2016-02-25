var express          = require('express');
var logger           = require('morgan');
var bodyParser       = require('body-parser');
var pg               = require('pg');
var session          = require('express-session');
var pgSession        = require('connect-pg-simple')
var path             = require('path');
var methodOverride   = require('method-override');
var app              = express();







var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
  console.log("up and runnning");
})
