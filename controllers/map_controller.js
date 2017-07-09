//GET /mapa
exports.map = function(req,res) {
	res.render('mapa', {title: 'Mapa'});
};