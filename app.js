//Importamos los paquetes que contienen los middlewares
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

//Importamos los enrutadores
var index = require('./routes/index');
var users = require('./routes/users');
var ordenes = require('./routes/ordenes');  //Import routes for "ordenes" area of site
var mediciones = require('./routes/mediciones');  //Import routes for "mediciones" area of site

//Importamos la API de la DB
//var routesApi = require('./model/routes/ordenes');


//var routes = require('./routes/index');


//Creamos la aplicación
var app = express();

//Instalamos el generador de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Instalamos los middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser('pfc'));
app.use(session({secret: 'keyboard cat'}));
app.use(expressValidator());
app.use(cookieParser());
app.use(methodOverride('_method'));
//Set public folder
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});



//Instalamos MW para vistas parciales
app.use(partials());

//Instalamos MW para enrutadores
app.use('/', index);
//app.use('/api', routesApi);
// app.use('/users', users);
app.use('/ordenes', ordenes);
app.use('/mediciones', mediciones);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {errors: []});
});

//exporta la aplicación para que pueda ser importada en el arraque bin/www
module.exports = app;

//Verificamos por consola la conexion a la BD
let db = require('./model/db_promises')
db.connect()
.then(obj => {
	obj.done();
	console.log('DB conectada');
})
.catch(error => {
	console.log('ERROR:', error.message || error);
});