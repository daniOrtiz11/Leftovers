var mysql = require('mysql');

// connection
var connection = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	database : 'leftovers',
});

connection.connect(function(error){
	if(error){
		throw error;
	}
	else{
		console.log('Conexion correcta con id' + connection.threadId);
	}
});

// Object

var ingredientes = {};

// function to obtain all the ingredients on the database
ingredientes.getLista = function(callback){
	connection.query('SELECT nombre FROM ingredientes', function(error, results){
	if(error){
		throw error;
	}	
	else{
		console.log('Se han obtenido los ingredientes');
		resultados = [];
		for (var index = 0; index < results.length; index++){
			elem = results[index];
			if(resultados.indexOf(elem) < 0){
				resultados.push(elem);			
			}
		}
		callback(null, resultados);
	}
});
}

// function to obtain an ingredient
ingredientes.getIngrediente = function(nombre, callback){
	var sql = 'SELECT * FROM ingredientes WHERE nombre = ' + connection.escape(nombre);
	connection.query(sql, function(error, result)
	{
	if(error){
		throw error;
	}	
	else{
		console.log('Ingrediente obtenido');
		callback(null, result);
	}
	});
}

//connection.end(function(error){
//	if(error){
//		throw error;
//	else{
//		console.log('Conexión cerrada');
//	}
//});

module.exports = ingredientes;
