var users = { admin: {id:1, username:"admin", password:"1234", role:"admin"},
	ahg01: {id:2, username:"ahg01", password:"5678", role:"jefed"},
	ahg02: {id:3, username:"ahg02", password:"1234", role:"jefeo"}
};

//Comprueba si el usuario esta registrado en users
//Si la autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	if(users[login]) {
		if(password === users[login].password) {
			
			callback(null, users[login]);

		} else {callback(new Error('Password erróneo.'));}
	} else { callback(new Error('No existe el usuario.'));}
};