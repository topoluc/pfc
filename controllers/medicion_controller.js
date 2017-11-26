var db = require('../model/db_promises');
var moment = require('moment');
moment().format();


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

//Muestra el listado de todas las operaciones efectuadas por carretera on GET
exports.medicionList = function(req, res, next) {
	db.task('get-everything', t => {
		return t.batch([
			t.any('select v.matricula, v.denom, o.gid, o.coste, m.gid, m.cantidad, m.costemed, m.fechamed, op.codigo, op.descr, op.unitario, op.unidad, g.nombre, g.actividad from operacion as op inner join grupo as g on op.idgrupo = g.id inner join medicion as m on op.gid = m.idope inner join orden as o on m.idorden = o.gid inner join via as v on o.idctra = v.gid order by v.matricula, g.nombre, op.codigo'),
			t.one('select sum(costemed) from medicion')
		]);
	})		
	.then(data => {
		var mediciones = data[0];
		var suma = data[1].sum;
		for (i=0; i < mediciones.length; i++) {
			mediciones[i].fechamed = formatDate(new Date(mediciones[i].fechamed));
		}
		res.render('mediciones/mediciones', {
			title: 'Operaciones ejecutadas y coste total',
			mediciones: mediciones,
			total: suma,
			errors: []
		});
		
	})
	.catch(function(error) {next(error);});
}

// Muestra el formulario de creación de mediciones on GET
exports.medicionNew = function(req, res, next) {
	db.task(t => {
		return t.one('select gid, idgrupo from orden where gid = $1', req.params.ordenid)
		.then(resultado => {
			return t.batch([
				t.one('select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, o.fechafin, o.idestado, o.descr, o.instr, g.id as idgrupo, g.nombre as grupo, g.actividad, e.descr as estado from orden as o inner join estado as e on o.idestado = e.gid inner join grupo as g on o.idgrupo = g.id inner join via as v on o.idctra = v.gid and o.gid = $1', resultado.gid),
				t.any('select * from operacion where idgrupo = $1 order by codigo', resultado.idgrupo),
				t.any('select m.gid, m.fechamed as fecha, m.cantidad, m.costemed as coste, o.codigo, o.descr from medicion m, operacion o where m.idorden = $1 and m.idope = o.gid order by fecha asc', resultado.gid)
			]);
		});	
	})
	.then(data => {
		data[0].fechaini = formatDate(new Date(data[0].fechaini));
		data[0].f_estimada = formatDate(new Date(data[0].f_estimada));
		
		for (i=0; i < data[2].length; i++) {
			data[2][i].fecha = formatDate(new Date(data[2][i].fecha));
		}
	
		res.render('mediciones/nuevaMed', {
			title: 'Crear / Modificar parte de trabajo',
			orden: data[0],
			operaciones: data[1],
			medicion: [],
			mediciones: data[2],
			errors: []
		});
	}).catch(function(error) {next(error);});
		
};

// Handle Medicion create on POST
exports.medicionCreate = function(req, res, next) {
	//Validamos los campos rellenos
	req.checkBody('operacion', 'Seleccione la operación que ha realizado.').notEmpty();
	req.checkBody('nunidades', 'Indique el número de unidades ejecutadas para esta operación.').notEmpty();
	
	var nuevamedicion = {
		idorden: req.params.ordenid,
		idope: req.body.operacion,
		cantidad: req.body.nunidades,
	};
	
	var result = req.validationErrors();
	if (result) {
		//If there are errors render the form again, passing the previously entered values and errors
		db.task(t => {
			return t.one('select gid, idgrupo from orden where gid = $1', req.params.ordenid)
				.then(resultado => {
					return t.batch([
						t.one('select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, o.fechafin, o.idestado, o.descr, o.instr, g.id as idgrupo, g.nombre as grupo, g.actividad, e.descr as estado from orden as o inner join estado as e on o.idestado = e.gid inner join grupo as g on o.idgrupo = g.id inner join via as v on o.idctra = v.gid and o.gid = $1', resultado.gid),
						t.any('select * from operacion where idgrupo = $1 order by codigo', resultado.idgrupo),
						t.any('select m.gid, m.fechamed as fecha, m.cantidad, m.costemed as coste, o.codigo, o.descr from medicion m, operacion o where m.idorden = $1 and m.idope = o.gid order by fecha asc', resultado.gid)
					]);
				});
		})
		.then(data => {
			data[0].fechaini = formatDate(new Date(data[0].fechaini));
			data[0].f_estimada = formatDate(new Date(data[0].f_estimada));
		
			for (i=0; i < data[2].length; i++) {
				data[2][i].fecha = formatDate(new Date(data[2][i].fecha));
			}
	
			res.render('mediciones/nuevaMed', {
				title: 'Crear / Modificar parte de trabajo',
				orden: data[0],
				operaciones: data[1],
				medicion: nuevamedicion,
				mediciones: data[2],
				errors: result
			});
		}).catch(function(error) {next(error);});
			
	} else {
		db.none('insert into medicion(idorden, idope, cantidad)' + 'values(${idorden}, ${idope}, ${cantidad})', nuevamedicion)
		.then(function () {
			res.redirect('/ordenes/'+req.params.ordenid+'/mediciones/new');
		})
		.catch(function(error) {next(error);});
	};
};

// Handle Medicion delete on DELETE
exports.medicionDelete = function(req, res, next) {
	db.result('delete from medicion where gid = $1', req.params.medicionid)
	.then(function (result) {
		res.redirect('back');
	})
	.catch(function(error) {next(error);});  
};

// Display Medicion update form on GET
exports.medicionEdit = function(req, res, next) {
	db.task('get-everything', t => {
		return t.batch([
			t.one('select * from medicion where gid = $1', req.params.medicionid),
			t.any('select * from operacion order by gid')
		]);
	})
	.then(data => {
		//data[0].fechamed = formatDate(new Date(data[0].fechamed));
		res.render('mediciones/editaMed', {
			title: 'Editar medición',
			medicion: data[0],
			operaciones: data[1],
			errors: []
		});
    })	
	.catch(function(error) {next(error);});
};

// Handle Medicion update on PUT
exports.medicionUpdate = function(req, res, next) {
	//Validamos los campos rellenos
	req.checkBody('operacion', 'Seleccione la operación que ha realizado.').notEmpty();
	req.checkBody('nunidades', 'Indique el número de unidades ejecutadas para esta operación.').notEmpty();
	
	var nuevamedicion = {
		//idorden: req.params.ordenid,
		idope: req.body.operacion,
		cantidad: req.body.nunidades,
	};
	
	var result = req.validationErrors();
	
	if (result) {
		//If there are errors render the form again, passing the previously entered values and errors
		db.task('get-everything', t => {
			return t.batch([
				t.one('select * from medicion where gid = $1', req.params.medicionid),
				t.any('select * from operacion order by gid')
			]);
		})
		.then(data => {
			res.render('mediciones/editaMed', {
				title: 'Editar medición',
				medicion: nuevamedicion,
				operaciones: data[1],
				errors: result
			})
		});
	} else {
		db.none('update medicion set idope=$1, cantidad=$2 where gid=$3', [req.body.operacion, req.body.nunidades, req.params.medicionid])
		.then(function () {
			res.redirect('back');
		})
		.catch(function(error) {next(error);});
	};
};

//Muestra el informe económico de todas las ordenes cerradas
exports.medicionControl = function(req, res, next) {
	db.task(t => {
		return t.batch([
			t.any("select to_char(o1.fechafin, 'mm-yyyy') as fecha, to_char(date_trunc('month', o1.fechafin), 'fmMON') as mes, to_char(date_trunc('year', o1.fechafin), 'YYYY') as año, sum(o1.coste) as total, sum(o2.coste) as vialidad, round(sum(o2.coste)*100/sum(o1.coste), 2) as perc_vial, sum(o3.coste) as ordinaria, round(sum(o3.coste)*100/sum(o1.coste), 2) as perc_ord from (select * from orden where idestado = 5) as o1 left join (select gid, coste from orden where idgrupo = 1 and idestado = 5)as o2 on o1.gid = o2.gid left join (select gid, coste from orden where idgrupo = 2 and idestado = 5) as o3 on o1.gid = o3.gid group by fecha, mes, año order by fecha"),
			t.any("select date_trunc('year', o.fechafin) as fecha_trunc, to_char(date_trunc('year', o.fechafin), 'YYYY') as año, round(sum(o.coste)*1.18, 2) as ejecutado, c.total-round(sum(o.coste)*1.18, 2) as falta from (select * from orden where idestado = 5) as o inner join contrato as c on o.idcontrato = c.gid group by fecha_trunc, año, c.total order by fecha_trunc"),
			t.one("select * from contrato"),
			t.any("select to_char(fechafin, 'mm-yyyy') as fecha, sum(coste) as suma from orden where idestado = 5 and idgrupo = 1 group by fecha order by fecha"),
			t.any("select to_char(fechafin, 'mm-yyyy') as fecha, sum(coste) as suma from orden where idestado = 5 and idgrupo = 2 group by fecha order by fecha")

		]);
	})		
	.then(data => {
		var mediciones = data[0];
		console.log(mediciones);
		var resumen = data[1];
		var contrato = data[2];
		
		var dateStart = moment(contrato.fechaini);
		var dateEnd = moment(contrato.fechafin);
		var meses = [];
		var index = 0;
		while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
			var mes =[];
			mes[0] = index;
			mes[1] = dateStart.format('MM-YYYY');
			meses.push(mes);
			dateStart.add(1,'month');
			index++;
		}
		
		contrato.fechaini = formatDate(new Date(contrato.fechaini));
		contrato.fechafin = formatDate(new Date(contrato.fechafin));
		
		var vialidad= [];
		for (var i=0; i < data[3].length; i++) {
			var importe = [];
			importe[0] = data[3][i].fecha;
			importe[1] = parseFloat(data[3][i].suma);
			vialidad.push(importe);
		};
		
		var conserv = [];
		for (var i=0; i < data[4].length; i++) {
			var importe = [];
			importe[0] = data[4][i].fecha;
			importe[1] = parseFloat(data[4][i].suma);
			conserv.push(importe);
		};
		
		for (var i=0; i < vialidad.length; i++) {
			for( var j=0; j < meses.length; j++) {
				if(vialidad[i][0] == meses[j][1]) {
					vialidad[i][0] = meses[j][0];
				};
			};
		};
		
		for (var i=0; i < conserv.length; i++) {
			for( var j=0; j < meses.length; j++) {
				if(conserv[i][0] == meses[j][1]) {
					conserv[i][0] = meses[j][0];
				};
			};
		};
		
		res.render('mediciones/informe', {
			title: 'Informe de Control Económico',
			mediciones: mediciones,
			resumen: resumen,
			contrato: contrato,
			vialidad: vialidad,
			conserv: conserv,
			meses: meses,
			errors: []
		});
		
	})
	.catch(function(error) {next(error);});
}

