var express = require('express');
var router = express.Router();

var ctrlOrdenes = require('../controllers/ordenes');
// var ctrlReviews = require('../controllers/mediciones');

// ordenes
router.get('/ordenes', ctrlOrdenes.ordenList);
router.get('/ordenes/new', ctrlOrdenes.ordenReadForm);
router.post('/ordenes', ctrlOrdenes.ordenCreate);
router.get('/ordenes/:ordenid', ctrlOrdenes.ordenReadOne);
router.put('/ordenes/:ordenid', ctrlOrdenes.ordenUpdateOne);
router.delete('/ordenes/:ordenid', ctrlOrdenes.ordenDeleteOne);


module.exports = router;