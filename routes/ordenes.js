var express = require('express');
var router = express.Router();

// Require controller modules
var ordenController = require('../controllers/orden_controller');
var medicionController = require('../controllers/medicion_controller');


function requireRole (role) {
    return function (req, res, next) {
        if (req.session.user && role.indexOf(req.session.user.role) !== -1) {
            next();
        }
         else {
            res.redirect('/#');
            // let error = new Error("No autorizado");
            //           next(error);
        }
    }
};



//ORDEN ROUTES

//GET request for list of all orden items
router.get('/', requireRole("admin jefed jefeo"), ordenController.ordenList);

//GET request for one order
router.get('/:ordenid(\\d+)', ordenController.ordenDetail);

//GET request for obtaining the order create form
router.get('/new', requireRole("admin jefed"), ordenController.ordenNew);

//POST request for creating order
router.post('/new', ordenController.ordenCreate);

//DELETE request to delete order
router.delete('/:ordenid(\\d+)/delete', requireRole("admin jefed"), ordenController.ordenDelete);

// GET request for obtaining the update form
router.get('/:ordenid(\\d+)/update', requireRole("admin jefed"), ordenController.ordenEdit);

// PUT request to update order
router.put('/:ordenid(\\d+)', ordenController.ordenUpdate);

//Meto aqui las rutas para crear mediciones porque estan directamente relacionadas con las ordenes
//GET request for obtaining the medicion create form
router.get('/:ordenid(\\d+)/mediciones/new', requireRole("admin jefeo"), medicionController.medicionNew);

//POST request for creating medicion
router.post('/:ordenid(\\d+)/mediciones/new', medicionController.medicionCreate);


// GET request to get order cost
router.get('/:ordenid(\\d+)/cost', ordenController.ordenCost);

// PUT request to close order
router.put('/:ordenid(\\d+)/close', requireRole("admin jefed"), ordenController.ordenClose);








module.exports = router;