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

//Evento en caso de error
connection.on('error', function(err){
	console.log(err.code);
});

exports.connection = connection;
