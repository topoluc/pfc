var express = require('express');
var router = express.Router();

// Require controller modules
var ordenController = require('../controllers/orden_controller');

/// ORDEN ROUTES ///

/* GET request for creating a Orden. NOTE This must come before routes that display Orden (uses id) */
router.get('/create', ordenController.orden_create_get);

/* POST request for creating orden. */
router.post('/create', ordenController.orden_create_post);

/* GET request to delete orden. */
router.get('/:id/delete', ordenController.orden_delete_get);

// POST request to delete orden
router.post('/:id/delete', ordenController.orden_delete_post);

/* GET request to update orden. */
router.get('/:id/update', ordenController.orden_update_get);

// POST request to update orden
router.post('/:id/update', ordenController.orden_update_post);

/* GET request for one orden. */
router.get('/:id', ordenController.orden_detail);

/* GET request for list of all orden items. */
router.get('/', ordenController.orden_list);

module.exports = router;