//GET /mapa
exports.map = function(req,res) {
	res.render('mapa', {mapa: 'mapa de carreteras'});
};