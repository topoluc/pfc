var request = require('request');
var apiOptions = {
	server : "http://localhost:3000"
};

var formatDate = function(date) {
	var day = date.getDate();
	if (day<10) {
		day = '0'+day;
	}
	var month = date.getMonth()+1;
	if (month<10) {
		month = '0'+month;
	}
	var year = date.getFullYear();
	
	return day + '/' + month + '/' + year;
};

var renderAgenda = function(req, res, responseBody){
	res.render('agenda', {
		title: 'Agenda',
		ordenes: responseBody
	});
};

//Muestra la lista de todas las órdenes
exports.orden_list = function(req, res){
	var requestOptions, path;
	path = '/api/ordenes';
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			if (response.statusCode === 200 && data.length) {
				for (i=0; i<data.length; i++) {
					data[i].f_ini = formatDate(new Date(data[i].f_ini));
					data[i].f_estimada = formatDate(new Date(data[i].f_estimada));
				};
				renderAgenda(req, res, data);
			}
		}
	);
};
	
var renderDetailOrden = function(req, res, responseBody){
	res.render('detalle', {
		title: 'Mostrar orden',
		orden: responseBody
	});
};
	
// Muestra el detalle de cada orden de trabajo
exports.orden_detail = function(req, res) {
	var requestOptions, path;
	path = "/api/ordenes/" + req.params.ordenid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, orden) {
			if (response.statusCode === 404) {
				res.send('NOT IMPLEMENTED: Orden create POST');
			} else {
				orden.f_ini = formatDate(new Date(orden.f_ini));
				orden.f_estimada = formatDate(new Date(orden.f_estimada));
			};
			renderDetailOrden(req, res, orden);
		}
	);
};

// Muestra el formulario de creación de órdenes on GET
exports.orden_create_get = function(req, res) {
	var requestOptions, path;
	path = "/api/ordenes/new";
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, data) {
			res.render('crearorden', {
				title: 'Nueva orden',
				vias: data[0],
				grupos: data[1]
			});
		}
	);
	
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