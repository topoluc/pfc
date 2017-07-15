/* PostgreSQL and PostGIS module and connection setup */
var pg = require("pg"); // require Postgres module
// Setup connection to PostGIS "+username+":"+password+"@"+host+"/"+database;
var conexion = "postgres://ahg01:pg@localhost/ctras";

var cliente = new pg.Client(conexion);
cliente.connect(function(error) {
	if(error) {
		console.log('NO SE HA PODIDO CONECTAR, MAS INFO EN ' + error);        
	} else {
		console.log('HEMOS CONECTADO, VAMOS A HACER LA CONSULTA');                
	}
});

	
module.exports = cliente;