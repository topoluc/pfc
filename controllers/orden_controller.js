
//Muestra la lista de todas las órdenes
exports.orden_list = function(req,res) {
	res.send('NOT IMPLEMENTED: Orden list');
	// res.render('ordenes/agenda');
};

// Muestra el detalle de cada orden de trabajo
exports.orden_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden detail: ' + req.params.id);
};

// Muestra el formulario de creación de órdenes on GET
exports.orden_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden create GET');
};

// Handle Orden create on POST
exports.orden_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden create POST');
};

// Display Orden delete form on GET
exports.orden_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden delete GET');
};

// Handle Orden delete on POST
exports.orden_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden delete POST');
};

// Display Orden update form on GET
exports.orden_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden update GET');
};

// Handle Orden update on POST
exports.orden_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Orden update POST');
};