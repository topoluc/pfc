var db = require('../model/db_promises')

//función para formatear fechas
var formatDate = function(date) {
	var year = date.substring(0, 4);
	var month = date.substring(5, 7);
	var day = date.substring(8, 10);
	
	// var day = date.getDate();
	// if (day<10) {
		// day = '0'+day;
	// }
	// var month = date.getMonth()+1;
	// if (month<10) {
		// month = '0'+month;
	// }
	// var year = date.getFullYear();
	
	return day + '/' + month + '/' + year;
};

//Show map on GET
exports.mapShow = function(req, res, next) {
	db.task('get-everything', t => {
		return t.batch([
			t.any("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(st_transform(v.geom, 4326))::json As geometry, row_to_json((select l from (select gid, matricula, denominacion, longitud) as l)) As properties FROM pfc.ctras_view as v order by matricula) As f) As fc"),
			t.any("SELECT row_to_json(kc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(k)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(st_transform(h.geom, 4326))::json As geometry, row_to_json((select l from (select gid, pk) as l)) As properties FROM pfc.hitos as h) As k) As kc"),
			t.any("SELECT row_to_json(pc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(p)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(st_transform(op.geom1, 4326))::json As geometry, row_to_json((select l from (select num, matricula, denom, pkini, pkfin, fechaini, f_estimada, estado, descr) as l)) As properties FROM (select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, e.descr as estado, o.geom1, o.geom2, o.descr from orden as o inner join via as v on o.idctra = v.gid and o.geom2 is null and o.idestado!=5 inner join estado as e on o.idestado=e.gid) as op) As p) As pc"),
			t.any("SELECT row_to_json(pc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(p)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(st_transform(ol.geom2, 4326))::json As geometry, row_to_json((select l from (select num, matricula, denom, pkini, pkfin, fechaini, f_estimada, estado, descr) as l)) As properties FROM (select o.gid as num, v.matricula, v.denom, o.pkini, o.pkfin, o.fechaini, o.f_estimada, e.descr as estado, o.geom1, o.geom2, o.descr from orden as o inner join via as v on o.idctra = v.gid and o.geom1 is null and o.idestado!=5 inner join estado as e on o.idestado=e.gid) as ol) As p) As pc"),
		]);
	})
	.then(function (todo) {
		
		//para cargar un listado de vias en el modal de geo directa
		var vias = todo[0][0].row_to_json.features;
		
		var ctras = todo[0][0].row_to_json;
		var pks = todo[1][0].row_to_json;
		var ordenesp = todo[2][0].row_to_json;
		for (i=0; i<ordenesp.features.length; i++) {
			ordenesp.features[i].properties.fechaini = formatDate(ordenesp.features[i].properties.fechaini);
			ordenesp.features[i].properties.f_estimada = formatDate(ordenesp.features[i].properties.f_estimada);
		};
		var ordenesl = todo[3][0].row_to_json;
		for (i=0; i<ordenesl.features.length; i++) {
			ordenesl.features[i].properties.fechaini = formatDate(ordenesl.features[i].properties.fechaini);
			ordenesl.features[i].properties.f_estimada = formatDate(ordenesl.features[i].properties.f_estimada);
		};
		if (req.params.ordenid) {
			var orden = req.params.ordenid;
		} else {
			var orden =[];
		}
		res.render('mapa', {
			title: 'Mapa',
			carreteras: JSON.stringify(ctras),
			hitos: JSON.stringify(pks),
			ordenesp: JSON.stringify(ordenesp),
			ordenesl: JSON.stringify(ordenesl),
			orden: orden,
			vias: vias,
			errors: []
		});
	})
	.catch(function(error) {next(error)});
};

//Picar en pantalla y devuelve carretera y pk
exports.geoInversa = function(req, res, next) {
	db.one('select stx_geoinversa($1, $2)', [req.params.lng, req.params.lat])
	.then(function (data) {
		res.send(data.stx_geoinversa);
	})
	.catch(function(error) {
		next(error);
	});
	
};

//con carretera y pk obtiene las coordenadas
exports.geoDirecta = function (req, res, next) {
	db.one('select stx_geodirecta($1, $2)', [req.params.idvia, req.params.pk])
	.then(function (data) {
		console.log(data.stx_geodirecta);
		res.send(data.stx_geodirecta);
	})
	.catch(function(error) {
		next(error);
	})
};