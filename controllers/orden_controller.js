
//Muestra la lista de todas las órdenes
exports.orden_list = function(req, res){
	res.render('agenda', { title: 'Agenda' });
};

// Muestra el detalle de cada orden de trabajo
exports.orden_detail = function(req, res) {
    res.render('detalle', { title: 'Mostrar orden'});
};

// Muestra el formulario de creación de órdenes on GET
exports.orden_create_get = function(req, res) {
    res.render('crearorden', { title: 'Nueva orden'});
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