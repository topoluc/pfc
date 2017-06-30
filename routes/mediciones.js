var express = require('express');
var router = express.Router();

// Require controller modules
var medicionController = require('../controllers/medicion_controller');

/// MEDICION ROUTES ///

/* GET request for creating a Medicion. NOTE This must come before routes that display Medicion (uses id) */
router.get('/create', medicionController.medicion_create_get);

/* POST request for creating medicion. */
router.post('/create', medicionController.medicion_create_post);

/* GET request to delete medicion. */
router.get('/:id/delete', medicionController.medicion_delete_get);

// POST request to delete medicion
router.post('/:id/delete', medicionController.medicion_delete_post);

/* GET request to update medicion. */
router.get('/:id/update', medicionController.medicion_update_get);

// POST request to update medicion
router.post('/:id/update', medicionController.medicion_update_post);

/* GET request for one medicion. */
router.get('/:id', medicionController.medicion_detail);

/* GET request for list of all medicion items. */
router.get('/', medicionController.medicion_list);

module.exports = router;