//Muestra la lista de todas las órdenes


exports.medicion_list = function(req,res) {
	res.send('NOT IMPLEMENTED: medicion list');
	// res.render('mediciones/agenda');
};

// Muestra el detalle de cada medicion de trabajo
exports.medicion_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion detail: ' + req.params.id);
};

// Muestra el formulario de creación de órdenes on GET
exports.medicion_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion create GET');
};

// Handle medicion create on POST
exports.medicion_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion create POST');
};

// Display medicion delete form on GET
exports.medicion_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion delete GET');
};

// Handle medicion delete on POST
exports.medicion_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion delete POST');
};

// Display medicion update form on GET
exports.medicion_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion update GET');
};

// Handle medicion update on POST
exports.medicion_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: medicion update POST');
};