var express = require('express');
var router = express.Router();

/* PostgreSQL and PostGIS module and connection setup */
var pg = require("pg"); // require Postgres module

/* Setup connection to PostGIS
var username = "ahg01"
var password = "pg"
var host = "localhost"
var database = "ctras"
var conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection*/



//var ordenController = require('../controllers/orden_controller');
var mapController = require('../controllers/map_controller');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'GIS Roads' });
});


//De momento no lo borro por si uso un solo enrutador
//router.get('/ordenes/agenda', ordenController.agenda);
router.get('/mapa', mapController.map);


module.exports = router;
