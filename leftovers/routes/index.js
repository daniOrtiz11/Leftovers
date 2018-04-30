var express = require('express');
var router = express.Router();
var ingredientes = require('../models/ingredientes');
var database = require('../models/database');
var vision = require('@google-cloud/vision');
var fs = require('fs');
var ba64 = require("ba64");
const translate = require('google-translate-api');
var sleep = require('system-sleep');
GOOGLE_APPLICATION_CREDENTIALS="./Leftovers.json";

//Variables
var someIngredients = [];
var obj = [];
//puestas solo para la prueba del filtro
var filtrarPor = [];


exports.index = function(req, res){
res.render('home', { title: 'ejs' });};
/* GET home page. */
router.get('/', function(req, res, next) {
res.render('home', { title: 'ejs' });
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
		.labelDetection('./naranja.png')
		.then(results => {
		const labels = results[0].labelAnnotations;

		console.log('Labels:');
		labels.forEach(label => console.log(''+ label.description + ' ' + label.score + ''));
		for (var i = 0, len = labels.length; i < len; i++) {
			translate(labels[i].description, {to: 'es'}).then(resul => {
				console.log(resul.text);
				someIngredients.push(resul.text);
			}).catch(err => {
				console.error(err);
			});
		}
		 })
		.catch(err => {
			console.error('ERROR:', err);
		});
		setTimeout(sendToFront, 2500,res);
});

router.get('/ingr', function(req, res, next) {
  ingredientes.getLista(function(error, data){
		obj = data;
  });

  /*
  database.connection.query('SELECT nombre FROM ingredientes', function(error, results){
	if(error){
		console.log(error.code);
	}	
	else{
		obj = results;
	}
});
  */
  setTimeout(sendToFrontIngr, 2500,res);
});

function sendToFront(res){
	res.send(someIngredients);
	someIngredients = [];
}

function sendToFrontIngr(res){
	res.send(obj);
	obj = {};
}


//obtener recetas - ingredientes: uso --> filtrarPor = ['Sal', 'Huevo']; getRecipes(filtrarPor);
function getAllIngredients(callback){
	var sql = 'SELECT * FROM ingredientes';
	database.connection.query(sql, function(error, result)
	{
	if(error)
		throw error;
	else{
		callback(null, result);
	}
	});
}


function filterIngrs(recetas) {
    return function(element) {
        for (var index = 0; index < recetas.length; index++) {  
		if (element.idreceta == recetas[index]) {  
		    return true;  
		}  
	}   
    	return false;
	}
}

function getRecipes(filtrarPor){
	getAllIngredients(function(error, obtainedBd){
		//console.log(obtainedBd);
		recetas = [];
		for (var index = 0; index < filtrarPor.length; index++){
			//se obtienen las recetas que tienen ese ingrediente
			recetas = (obtainedBd.filter(ingr => ingr.nombre == filtrarPor[index])).map(a => a.idreceta);
			console.log(recetas);
			//se actualiza la lista de ingredientes para que solo contenga las apariciones de ingredientes de esas recetas			
			obtainedBd = obtainedBd.filter(filterIngrs(recetas));
			console.log(obtainedBd);
		}
		
		recetasAlgunoMas = [];
		for (var index = 0; index < obtainedBd.length; index++){
			elem = obtainedBd[index];
			if(filtrarPor.indexOf(elem.nombre) < 0){
				if(recetasAlgunoMas.indexOf(elem.idreceta)<0)
					recetasAlgunoMas.push(elem.idreceta);			
			}
		}
		//console.log(recetasAlgunoMas);

		recetasSoloEsosIngredientes = []
		todasLasRecetas = obtainedBd.map(a => a.idreceta);
		//console.log(todasLasRecetas);

		for(var index = 0; index < todasLasRecetas.length; index++){
			inReceta = todasLasRecetas[index];
			if(recetasAlgunoMas.indexOf(inReceta) < 0){
				if(recetasSoloEsosIngredientes.indexOf(inReceta) < 0)
					recetasSoloEsosIngredientes.push(inReceta);
			}
		}
		//console.log(recetasSoloEsosIngredientes);
  	});
}


module.exports = router;

//selecciona todos los ingredientes con un nombre

/*database.connection.query('SELECT * FROM ingredientes WHERE nombre = ?', ['Sal'], function(err, result){
	if(err)
		console.log(err.code);
	else
		console.log(result);
});*/

//seleccion el id de las recetas que contienen un ingrediente
/*
database.connection.query('SELECT idreceta FROM ingredientes WHERE nombre = ?', ['Sal'], function(err, result){
	if(err)
		console.log(err.code);
	else
		console.log(result);
});
*/

//selecciona el titulo de una receta a partir de su identificador
/*
database.connection.query('SELECT titulo FROM recetas WHERE id = ?', [2], function(err, result){
	if(err)
		console.log(err.code);
	else
		console.log(result);
});
*/
  	


