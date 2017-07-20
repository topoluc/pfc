var db = require('../../model/db_promises')

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.ordenList = function (req, res, next) {
	db.any('select o.gid as num, v.matricula as matricula, v.denom as denom, o.pkini as pkini, o.pkfin as pkfin, o.fechaini as f_ini, o.f_estimada as f_estimada, o.estado as estado from orden o, via v where o.idctra = v.gid order by o.gid')
		.then(function (ordenes) {
			sendJsonResponse(res, 200, ordenes);
		})
		.catch(function (err) {
			sendJsonResponse(res, 404, err);
			return;
		})
};

module.exports.ordenReadOne = function (req, res, next) {
	// var ordenID = parseInt(req.params.ordenid); parece que se puede quitar
	db.one('select o.gid as num, v.matricula as matricula, o.pkini as pkini, o.pkfin as pkfin, o.fechaini as f_ini, o.f_estimada as f_estimada,	o.estado as estado, o.fechafin as f_fin, o.descr as descr, o.instr as instr from orden o, via v where o.idctra = v.gid and o.gid = $1', req.params.ordenid)
		.then(function (orden) {
			sendJsonResponse(res, 200, orden);
		})
		.catch(function (err, data) {
			if (!data) {
				sendJsonResponse(res, 404, {"message": "ordenid not found"});
				return;
			} else if (err) {
				sendJsonResponse(res, 404, err);
				return;
			};
		});
};

module.exports.ordenReadForm = function (req, res, next) {
	// var ordenID = parseInt(req.params.ordenid); parece que se puede quitar
	db.task('get-everything', t => {
		return t.batch([
			t.any('select * from via order by matricula'),
			t.any('select * from grupo order by gid')
		]);
	})
	.then(data => {
		sendJsonResponse(res, 200, data);
	})
	.catch(function (err) {
			sendJsonResponse(res, 404, err);
			return;
	});
};







	
module.exports.ordenCreate = function (req, res, next) {
	
	db.none('insert into orden(idctra, pkini, pkfin, descr, instr, f_estimada)' + 'values(${idctra}, ${pkini}, ${pkfin}, ${descr}, ${instr}, ${f_estimada})', req.body)
		.then(function () {
			sendJsonResponse(res, 201, {"message": "Inserted one order"});
		})
		.catch(function (err) {
			sendJsonResponse(res, 400, err);
			return;
		});
};

module.exports.ordenUpdateOne = function (req, res, next) {
	db.none('update orden set idctra=$1, pkini=$2, pkfin=$3, descr=$4, instr=$5, f_estimada=$6 where gid=$7', [req.body.idctra, req.body.pkini, req.body.pkfin,
	req.body.descr, req.body.instr, req.body.f_estimada, req.params.ordenid])
    .then(function () {
		sendJsonResponse(res, 200, {"message": "Updated order"});
    })
    .catch(function (err) {
		sendJsonResponse(res, 400, err);
			return;
    });

	//sendJsonResponse(res, 200, {"status" : "success"});
};
module.exports.ordenDeleteOne = function (req, res, next) {
	db.result('delete from orden where gid = $1', req.params.ordenid)
    .then(function (result) {
      /* jshint ignore:start */
		res.status(200)
			.json({
				status: 'success',
				message: `Removed ${result.rowCount} puppy`
			});
      /* jshint ignore:end */
    })
    .catch(function (err) {
		return next(err);
    });

	//sendJsonResponse(res, 200, {"status" : "success"});
};