
//Muestra la lista de todas las órdenes
exports.orden_list = function(req, res){
	res.render('agenda', { title: 'Agenda', ordenes: [{
			num: 1,
			ctra: 'CO-5211',
			pkini: '4+300',
			pkfin: '4+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 2,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 3,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 4,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 5,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 6,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		},{
			num: 7,
			ctra: 'CO-6202',
			pkini: '5+100',
			pkfin: '5+800',
			fechaini: '26/12/2017',
			fechafin: '26/02/2017'
		}]
	});
};

// Muestra el detalle de cada orden de trabajo
exports.orden_detail = function(req, res) {
    res.render('detalle', { title: 'Mostrar orden', orden: {
		num: 1,
		ctra: 'CO-5211',
		pkini: '4+300',
		pkfin: '4+800',
		fechaini: '26/12/2017',
		fechaestfin: '26/01/2017',
		fechafin: '26/02/2017',
		grupo: 'I',
		descr: 'Baches en calzada',
		instr: 'Aplicar aglomerado en frío a primera hora de la mañana. Utilizar aridos del tamaño 12 y rulo compactador de 1.5 metros',
		estado: 'En curso'
		}
	});
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