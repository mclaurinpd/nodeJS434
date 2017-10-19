var express = require('express');
var app = express();
var fs = require("fs");

app.get('/temp/latest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var latest = table.device1.timestamp;
       var index = 1;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var timeCheck = table['reading'+i].timestamp
			if (timeCheck > latest) {
				index = i;
				latest = timeCheck;
			}	
	   }
	   var reading = table['reading'+index];
	   res.end("Most recent submission since UNIX epoch: \n\n" + "Device Id: " + device.device_id + "\nTimestamp: " + device.timestamp + "\nTemperature: " + device.temperature);
   });
})

app.get('/temp/highest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var highest = table.device1.temperature;
       var index = 1;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var highCheck = table['reading'+i].temperature
			if (highCheck > highest) {
				index = i;
				highest = highCheck;
			}	
	   }
	   var reading = table['reading'+index];
	   res.end("Highest temperature: \n\n" + "Device Id: " + device.device_id + "\nTimestamp: " + device.timestamp + "\nTemperature: " + device.temperature);
   });
})

app.get('/temp/lowest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var lowest = table.device1.temperature;
       var index = 1;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var lowCheck = table['reading'+i].temperature
			if (lowCheck < lowest) {
				index = i;
				lowest = lowCheck;
			}	
	   }
	   var reading = table['reading'+index];
	   res.end("Lowest temperature: \n\n" + "Device Id: " + device.device_id + "\nTimestamp: " + device.timestamp + "\nTemperature: " + device.temperature);
   });
})

app.get('/temp/average', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var average = table.device1.temperature;
	   var tableLength = Object.keys(table).length
	   for (var i = 1; i <= tableLength; i++) {
			average = average + table['reading'+i].temperature;	
	   }
	   res.end("Average temperature: " + (average / tableLength));
   });
})

app.get('/temp/:id', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
	   var deviceName = req.params.id;
	   var string = "";
	   for (var i = 1; i <= Object.keys(table).length; i++) {
	   		var obj = table['reading'+i];
	   		console.log(obj.device_id);
	   		if (obj.device_id == deviceName) {
	   			console.log("asf");
	   			string += 'Temperature: ' + obj.temperature + "\n";
	   			string += 'Timestamp: ' + obj.timestamp + "\n\n";
	   		}
	   }
	   res.end(string);
	});
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
