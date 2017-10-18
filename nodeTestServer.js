var express = require('express');
var app = express();
var fs = require("fs");

app.get('/temp/latest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var latest = table.device1.timestamp;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var timeCheck = table['device'+i].timestamp
			if (timeCheck > latest) {
				latest = timeCheck;
			}	
	   }
	   res.end("Most recent submission since UNIX epoch: " + latest);
   });
})

app.get('/temp/highest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var highest = table.device1.temperature;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var highCheck = table['device'+i].temperature
			if (highCheck > highest) {
				highest = highCheck;
			}	
	   }
	   res.end("Highest temperature: " + highest);
   });
})

app.get('/temp/lowest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var lowest = table.device1.temperature;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
			var lowCheck = table['device'+i].temperature
			if (lowCheck < lowest) {
				lowest = lowCheck;
			}	
	   }
	   res.end("Lowest temperature: " + lowest);
   });
})

app.get('/temp/average', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       var average = table.device1.temperature;
	   var tableLength = Object.keys(table).length
	   for (var i = 1; i <= tableLength; i++) {
			average = average + table['device'+i].temperature;	
	   }
	   res.end("Average temperature: " + (average / tableLength));
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
