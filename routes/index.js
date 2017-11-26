var express = require('express');
var router = express.Router();

//var ordenController = require('../controllers/orden_controller');
var mapController = require('../controllers/map_controller');
var contratoController = require('../controllers/contrato_controller');
var sessionController = require('../controllers/session_controller');



//Definicion de rutas de sesion
router.get('/login', sessionController.new);	//formulario login
router.post('/login', sessionController.create);	//crear sesion
router.get('/logout', sessionController.destroy);	//destruir sesion


function requireRole (role) {
    return function (req, res, next) {
        if (req.session.user) {
        	if(role.indexOf(req.session.user.role) !== -1) {
            	next();
        	} else {
        		res.redirect("/#");
        	}
        }
         else {
            res.redirect('/login');
        }
    }
};

/* GET home page. */
router.get('/', requireRole("admin jefed jefeo"), function(req, res, next) {
  res.render('index', { title: 'GIS Roads', errors: []});
});


//Gestión del mapa
router.get('/mapa', requireRole("admin jefed jefeo"), mapController.mapShow);
router.get('/mapa/:ordenid(\\d+)', mapController.mapShow);
router.get('/mapa/inversa/longitud/:lng/latitud/:lat', mapController.geoInversa);
router.get('/mapa/directa/idvia/:idvia/pk/:pk', mapController.geoDirecta);

//Actualizar contrato
router.get('/contrato/edit', requireRole("admin jefed"), contratoController.contratoShow);
router.put('/contrato/update', contratoController.contratoUpdate);





module.exports = router;
