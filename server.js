var express          = require('express');
var logger           = require('morgan');
var bodyParser       = require('body-parser');
var pg               = require('pg');
var session          = require('express-session');
var pgSession        = require('connect-pg-simple')
var path             = require('path');
var methodOverride   = require('method-override');
var env              = require('dotenv');
var app              = express();

app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json());

app.use( logger('short'));

app.use( methodOverride('_method'));

app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', function(req,res){
  res.send("homepageeee")
})


var port = process.env.PORT || 3000;
var server = app.listen(port, function(){
  console.log("up and runnning");
})
