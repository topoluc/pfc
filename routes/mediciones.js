var express = require('express');
var router = express.Router();

// Require controller modules
var medicionController = require('../controllers/medicion_controller');

function requireRole (role) {
    return function (req, res, next) {
        if (req.session.user && role.indexOf(req.session.user.role) !== -1) {
            next();
        }
         else {
            res.redirect('/#');
        }
    }
};


// MEDICION ROUTES

//La creacion de mediciones va en el enrutador de ordenes 


//GET request for list of all mediciones items
router.get('/', requireRole("admin jefed jefeo"), medicionController.medicionList);

//DELETE request to delete medicion
router.delete('/:medicionid(\\d+)/delete', medicionController.medicionDelete);

// GET request for obtaining the update form
router.get('/:medicionid(\\d+)/update', medicionController.medicionEdit);

// PUT request to update medicion
router.put('/:medicionid(\\d+)', medicionController.medicionUpdate);

//GET request for list of all mediciones items
router.get('/control', requireRole("admin jefed jefeo"), medicionController.medicionControl);



module.exports = router;