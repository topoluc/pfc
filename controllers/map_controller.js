//GET /mapa
exports.map = function(req,res) {
	
	var cliente = require("../model/db.js"); // require Postgres module
	
	var ctras_query = cliente.query("SELECT row_to_json(fc) FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, ST_AsGeoJSON(st_transform(v.geom, 4326))::json As geometry, row_to_json((select l from (select gid, matricula, denom) as l)) As properties FROM pfc.via2 as v) As f) As fc");

	ctras_query.on("row", function (row, result) {
		result.addRow(row);
	});
	
	//Pass the result to the map page
	ctras_query.on("end", function (result) {
		var data = result.rows[0].row_to_json; // Save the JSON as variable data
		res.render('mapa', {
			title: 'Mapa', // Give a title to our page
			jsonData: JSON.stringify(data) // Pass data to the View
		});
		// res.send(result.rows[0].row_to_json);
        // res.end();
	});

	
	
	
};