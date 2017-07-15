var express = require('express');
var router = express.Router();

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
