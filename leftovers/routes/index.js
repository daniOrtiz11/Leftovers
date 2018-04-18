var express = require('express');
var router = express.Router();
var ingredientes = require('../models/ingredientes');
var obj = {};

exports.index = function(req, res){
res.render('home', { title: 'ejs' });};
/* GET home page. */
router.get('/', function(req, res, next ){
ingredientes.getLista(function(error, data){
	obj = data;
	});
  res.render('home', { ingredientes: obj });
});
router.get('/image', function(req, res, next){
	console.log(req.params.imagen);
	console.log("HOLA DESDE IMAGEN");
});
router.get('/principal/:modo?', function(req, res, next) {
	var modo = req.query.modo;	
	console.log(modo);
	res.render('principal', { opcion: modo });
  	
	//var modo = req.query.modo;
	/*
	Si modo = 1, busca con filtro -> principal pestaña recetas
	busca recetas con filtro....
	if(modo == 1){
	
	}
	Si modo = 2, buscar sin filtro -> principal pestaña añadir filtros para busqueda
	busqueda de recetas al azar...
	else if(modo == 2){
	
	}
	*/
});
router.get('/principal', function(req, res, next) {
	res.render('principal', { opcion: 2 });
});
router.get('/receta', function(req, res, next) {
	res.render('receta', { nombre: "" });
});
module.exports = router;

//ingredientes.getLista(function(error, data){
//		console.log(data);
//	});
