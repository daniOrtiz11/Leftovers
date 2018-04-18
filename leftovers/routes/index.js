var express = require('express');
var router = express.Router();
var ingredientes = require('../models/ingredientes');
var obj = {};
var vision = require('@google-cloud/vision');
var fs = require('fs');
var ba64 = require("ba64");
const translate = require('google-translate-api');
GOOGLE_APPLICATION_CREDENTIALS="./Leftovers.json";

exports.index = function(req, res){
res.render('home', { title: 'ejs' });};
/* GET home page. */
router.get('/', function(req, res, next) {
  ingredientes.getLista(function(error, data){
		obj = data;
  });
  res.render('home', { ingredientes: obj });
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

router.get('/image', function(req, res, next) {
 
	ba64.writeImageSync("myimage", req.query.imagen);
	// Creates a client
	const client = new vision.ImageAnnotatorClient();
	
	// Performs label detection on the image file - req.query.imagen contains image
		client
		.labelDetection('./myimage.jpeg')
		.then(results => {
		const labels = results[0].labelAnnotations;

		console.log('Labels:');
		labels.forEach(label => console.log(''+ label.description + ' ' + label.score + ''));
		var someIngredients = [];
		for (var i = 0, len = labels.length; i < len; i++) {
			translate(labels[i].description, {to: 'es'}).then(resul => {
				someIngredients[i] = resul.text;
				console.log(someIngredients[i]);
			}).catch(err => {
				console.error(err);
			});
		}
		res.render('home', {posIng: someIngredients});
		 })
		.catch(err => {
			console.error('ERROR:', err);
		});
});

module.exports = router;

//ingredientes.getLista(function(error, data){
//		console.log(data);
//	});
