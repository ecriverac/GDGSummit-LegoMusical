var express = require('express');  
var app = express();  
var server = require('http').Server(app); 
var io = require('socket.io')(server); 

var five = require("johnny-five"),
  board = new five.Board();

//
app.get('/holamundo', function(req, res) {  
  res.status(200).send("Hola Mundo!");
});
app.use(express.static('public3'));
//socket
io.on('connection', function(socket) {  
	console.log('Alguien se ha conectado');
	socket.emit('saludo', 'Hola Mundo desde el Socket');

	socket.on('saludoDesdeCliente', function(data) {
		console.log(data);
	});

});
//
server.listen(8888, function() {  
  console.log("Servidor corriendo en http://localhost:8888");
});




board.on("ready", function() {
	var valor=0;
	//Vamos a leer el sensor conectado a la entrada analógica A0
	var sensors = new five.Sensors([ "A0", "A1", "A2","A3" ]);
	//conectamos nuestra bocina a la salida digital 3
	var piezo = new five.Piezo(3);
	var arValores = [0,0,0,0];
	var arValoresIniciales = [0,0,0,0];

	var indexSecuencia=0;


	sensors.scale([0, 30]).on("change", function(sensor) {
		if(arValoresIniciales[sensor.pin]==0) arValoresIniciales[sensor.pin]=Math.round(sensor.value);
		arValores[sensor.pin]=Math.round(sensor.value);
	});

  	setInterval(function(){
  		if(arValores[indexSecuencia]>arValoresIniciales[indexSecuencia]){
  			piezo.frequency((arValores[indexSecuencia]*5)+(140*indexSecuencia), 700);
  		}

  		indexSecuencia++;
		if(indexSecuencia>3) indexSecuencia=0;

  	},1000);  	
});