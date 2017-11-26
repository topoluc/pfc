var db = require('../model/db_promises');

//función para formatear fechas
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

// Muestra el formulario de creación de contratos on GET
// exports.contratoNew = function(req, res, next) {
	// res.render('nuevoContrato', {
		
		// title: 'Nuevo contrato',
		// contrato: [],
		// errors: []
	// });
// };


// Muestra el formulario de edición de contratos on GET
exports.contratoShow = function(req, res, next) {
	db.one('select * from contrato')
	.then(function (contrato) {
		contrato.total = contrato.total.toFixed(2);
		contrato.fechaini = formatDate(new Date(contrato.fechaini));
		contrato.fechafin = formatDate(new Date(contrato.fechafin));
		res.render('editaContrato', {
			title: 'Datos del contrato',
			contrato: contrato,
			errors: []
		});
	})
	.catch(function(error) {next(error);});
};

// Handle Contrato update on PUT
exports.contratoUpdate = function(req, res, next) {
	//Validamos los campos rellenos
	req.checkBody('fini', 'Indique una fecha de inicio del contrato.').notEmpty();
	req.checkBody('ffin', 'Introduzca una fecha de finalización del contrato.').notEmpty();
	req.checkBody('total', 'Introduzca el importe total del contrato.').notEmpty();
	
	var nuevocontrato = {
		adjudicatario: req.body.contratista,
		total: req.body.total,
		fechaini: req.body.fini,
		fechafin: req.body.ffin
	};
	
	var result = req.validationErrors();
	if (result) {
		//If there are errors render the form again, passing the previously entered values and errors
		// db.task('get-everything', t => {
			// return t.batch([
				// t.any('select * from via order by matricula'),
				// t.any('select * from grupo order by id')
			// ]);
		// })
		// .then(data => {
			res.render('editaContrato', {
				title: 'Actualizar contrato',
				contrato: nuevocontrato,
				errors: result
			})
		// });
	} else {
		db.none('update contrato set adjudicatario=$1, fechaini=$2, fechafin=$3, total=$4 where gid=1', [req.body.contratista, req.body.fini, req.body.ffin, req.body.total])
		.then(function () {
			res.redirect('/ordenes');
		})
		.catch(function(error) {next(error);});
	};
};

