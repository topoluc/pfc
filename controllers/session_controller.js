// formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

//crear la sesion
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {

		if (error) { // si hay error retornamos mensajes de error de sesión
			req.session.errors = [{msg: ' '+error}];
			res.redirect("/login");

			return;
		}

		// Crear req.session.user y guardar campos id y username
		// La sesion se define por la existencia de req.session.user
		req.session.user = {id:user.id, username:user.username, role:user.role};

		res.redirect("/");// redireccion a path anterior a login
	});
};

// Destruir sesion
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect("/login"); // redirect a path anterior a login
};