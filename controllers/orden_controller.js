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

//Muestra la lista de todas las órdenes
exports.ordenList = function(req, res, next){
	db.any("select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, o.idestado, ST_AsGeoJSON(st_transform(o.geom1, 4326))::json As geom1, ST_AsGeoJSON(st_transform(o.geom2, 4326))::json As geom2 from orden o, via v where o.idctra = v.gid and o.idestado!=5 order by o.idestado, o.f_estimada")
	.then(function (ordenes_lista) {
		for (i=0; i<ordenes_lista.length; i++) {
			ordenes_lista[i].fechaini = formatDate(new Date(ordenes_lista[i].fechaini));
			ordenes_lista[i].f_estimada = formatDate(new Date(ordenes_lista[i].f_estimada));
			ordenes_lista[i].geom = ordenes_lista[i].geom1||ordenes_lista[i].geom2;
		};
		res.render('ordenes/agenda', {
			title: 'Agenda',
			ordenes: ordenes_lista,
			errors: []
		});
	})
	.catch(function(error) {next(error);})
};
	
// Muestra el detalle de cada orden de trabajo
exports.ordenDetail = function(req, res, next) {
	db.one('select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, o.fechafin, e.descr as estado, o.descr, o.instr, g.id as idgrupo, g.nombre as grupo, g.actividad from orden as o inner join grupo as g on o.idgrupo = g.id inner join estado as e on o.idestado = e.gid inner join via as v on o.idctra = v.gid and o.gid = $1', req.params.ordenid)
	.then(function (orden_data) {
		orden_data.fechaini = formatDate(new Date(orden_data.fechaini));
		orden_data.f_estimada = formatDate(new Date(orden_data.f_estimada));
		res.render('ordenes/detalleOrden', {
			title: 'Mostrar orden',
			orden: orden_data,
			errors: []
		});
	})
	.catch(function(error) {next(error);});
};

// Muestra el formulario de creación de órdenes on GET
exports.ordenNew = function(req, res, next) {
	db.task('get-everything', t => {
		return t.batch([
			t.any('select * from via order by matricula'),
			t.any('select * from grupo order by id')
		]);
	})
	.then(data => {
		res.render('ordenes/nuevaOrden', {
			title: 'Nueva orden',
			orden: [],
			vias: data[0],
			grupos: data[1],
			errors: []
		});
	})
	.catch(function(error) {next(error);});
};

// Handle Orden create on POST
exports.ordenCreate = function(req, res, next) {
	//Validamos los campos rellenos
	req.checkBody('pkini', 'Introduzca el PK inicial.').notEmpty();
	req.checkBody('pkfin', 'Introduzca un PK final.').notEmpty();
	req.checkBody('ffin', 'Introduzca una fecha estimada de finalización.').notEmpty();
	req.checkBody('grupo', 'Indique el grupo al que pertenecerán las operaciones.').notEmpty();
	req.checkBody('descr', 'Introduzca una descripción de la incidencia.').notEmpty();
	
	var nuevaorden = {
		idctra: req.body.via,
		pkini: req.body.pkini,
		pkfin: req.body.pkfin,
		fini: req.body.fini,
		f_estimada: req.body.ffin,
		idgrupo: req.body.grupo,
		descr: req.body.descr,
		instr: req.body.instr,
	};
	
	var result = req.validationErrors();
	if (result) {
		//If there are errors render the form again, passing the previously entered values and errors
		db.task('get-everything', t => {
			return t.batch([
				t.any('select * from via order by matricula'),
				t.any('select * from grupo order by id')
			]);
		})
		.then(data => {
			res.render('ordenes/nuevaOrden', {
				title: 'Nueva orden',
				orden: nuevaorden,
				vias: data[0],
				grupos: data[1],
				errors: result
			})
		});
			
    // return;
	} else {
		db.none('insert into orden(idctra, pkini, pkfin, descr, instr, f_estimada, idgrupo)' + 'values(${idctra}, ${pkini}, ${pkfin}, ${descr}, ${instr}, ${f_estimada}, ${idgrupo})', nuevaorden)
		.then(function () {
			res.redirect('/ordenes');
		})
		.catch(function(error) {next(error);});
	};
};

// Handle Orden delete on DELETE
exports.ordenDelete = function(req, res, next) {
	db.result('delete from orden where gid = $1', req.params.ordenid)
	.then(function (result) {
		res.redirect('/ordenes');
	})
	.catch(function(error) {next(error);});  
};

// Display Orden update form on GET
exports.ordenEdit = function(req, res, next) {
	db.task('get-everything', t => {
		return t.batch([
			t.any('select * from via order by matricula'),
			t.any('select * from grupo order by id'),
			t.one('select o.gid, o.idctra, o.pkini, o.pkfin, o.fechaini, o.fechafin, o.descr, o.instr, o.f_estimada, e.descr as estado, o.idgrupo, g.nombre, g.actividad from orden as o inner join estado as e on o.idestado = e.gid inner join grupo as g on o.idgrupo = g.id and o.gid = $1', req.params.ordenid)
		]);
	})
	.then(data => {
		data[2].fechaini = formatDate(new Date(data[2].fechaini));
		data[2].f_estimada = formatDate(new Date(data[2].f_estimada));
		
		res.render('ordenes/editaOrden', {
			title: 'Editar orden de trabajo',
			vias: data[0],
			grupos: data[1],
			orden: data[2],
			errors: []
		});
    })	
	.catch(function(error) {next(error);});
};

// Handle Orden update on PUT
exports.ordenUpdate = function(req, res, next) {
	//Validamos los campos rellenos
	req.checkBody('pkini', 'Introduzca el PK inicial.').notEmpty();
	req.checkBody('pkfin', 'Introduzca un PK final.').notEmpty();
	// La introducción de fecha de inicio es opcional..........
	req.checkBody('ffin', 'Introduzca una fecha estimada de finalización.').notEmpty();
	req.checkBody('grupo', 'Indique el grupo al que pertenecerán las operaciones.').notEmpty();
	req.checkBody('descr', 'Introduzca una descripción de la incidencia.').notEmpty();
	
	var nuevaorden = {
		gid: req.params.ordenid,
		idctra: req.body.via,
		pkini: req.body.pkini,
		pkfin: req.body.pkfin,
		fini: req.body.fini,
		f_estimada: req.body.ffin,
		idgrupo: req.body.grupo,
		descr: req.body.descr,
		instr: req.body.instr,
	};
	
	var result = req.validationErrors();
	if (result) {
		//If there are errors render the form again, passing the previously entered values and errors
		db.task('get-everything', t => {
			return t.batch([
				t.any('select * from via order by matricula'),
				t.any('select * from grupo order by id')
			]);
		})
		.then(data => {
			res.render('ordenes/editaOrden', {
				title: 'Nueva orden',
				orden: nuevaorden,
				vias: data[0],
				grupos: data[1],
				errors: result
			})
		});
	} else {
		db.none('update orden set idctra=$1, pkini=$2, pkfin=$3, descr=$4, instr=$5, f_estimada=$6 where gid=$7', [req.body.via, req.body.pkini, req.body.pkfin, 
		req.body.descr, req.body.instr, req.body.ffin, req.params.ordenid])
		.then(function () {
			res.redirect('/ordenes');
		})
		.catch(function(error) {next(error);});
	};
};

//Handle order cost on GET
exports.ordenCost = function(req, res, next) {
	db.any('select z.matricula, z.denom, z.gid, z.coste, l.cantidad, l.costemed, l.fechamed, l.codigo, l.descr, l.unitario, l.unidad, z.nombre, z.actividad from (select v.matricula, v.denom, o.gid, o.coste, g.nombre, g.actividad from orden as o inner join via as v on o.idctra = v.gid inner join grupo as g on o.idgrupo = g.id and o.gid=$1) as z left join (select * from medicion as m inner join operacion as op on m.idope=op.gid) as l on z.gid = l.idorden', req.params.ordenid)
	.then(data => {
		if (data[0].coste) {
			for (i=0; i < data.length; i++) {
				data[i].fechamed = formatDate(new Date(data[i].fechamed));
			}
			res.render('ordenes/costOrden', {
				title: 'Coste de la orden',
				mediciones: data,
				errors: []
			});
		} else {
			res.redirect('/ordenes');
		};
	})
	.catch(function(error) {next(error);});
};


// Handle Orden close on POST
exports.ordenClose = function(req, res, next) {
	db.none('update orden set idestado=5, fechafin=now() where gid=$1', req.params.ordenid)
    .then(function () {
		res.redirect('/ordenes');
    })
    .catch(function(error) {next(error);});
};

// Check end date orden
function ordenOut() {
	var today = formatDate(new Date());
	db.any('select * from orden where idestado = 4')
	.then(function (ordenes) {
		for (i=0; i<ordenes.length; i++) {
			ordenes[i].f_estimada = formatDate(new Date(ordenes[i].f_estimada));
			if (ordenes[i].f_estimada == today ) {
				db.none('update orden set idestado=2 where gid=$1', ordenes[i].gid)
			}
		}
	})
	.catch(function(error) {next(error);});
};

function checkTime() {
	var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    if(h + ":" + m + ":" + s == "0:0:0") {
		ordenOut();
	}
	var t = setTimeout(checkTime, 500);
};

ordenOut();
checkTime();