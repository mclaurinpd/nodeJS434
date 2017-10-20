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
   	   // read the file and then parse it into table
	   var table = JSON.parse(data);
	   // get the device id from the parmeters
	   var deviceName = req.params.id;
	   var string = "";
	   var found = false;
	   for (var i = 1; i <= Object.keys(table).length; i++) {
	   		var obj = table['reading'+i];
	   		// if the device id in the url matches a device id in the array of objects
	   		// add it to string
	   		if (obj.device_id === deviceName) {
				var found = true;
	   			string += "Temperature: " + obj.temperature + "\n";
	   			string += "Timestamp: " + obj.timestamp + "\n\n";
	   		}
	   }
	   if (found === true) {
	   	// send the string
	   	res.end(string);
	   }
	   
	   else {
		res.send("404: Device not found", 404);
	   }
	});
})

app.get('/temp/:id/latest', function(req, res) {
	fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
		// read the file into table
		var table = JSON.parse(data);
		var deviceName = req.params.id;
		var latest = -1;
		var index = -1;

		// loop through all readings and find the one with the newest timestamp
		for(var i = 1; i <= Object.keys(table).length; i++ ) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName && obj.timestamp > latest) {
				latest = obj.timestamp;
				index = i;
			}
		}
		if (index > -1) {
			var obj = table['reading'+index]
			res.end("Temperature: " + obj.temperature + "\nTimestamp: " + obj.timestamp);
		}
	})
});

app.get('/temp/:id/highest', function(req, res) {
	fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
		// read the file into table
		var table = JSON.parse(data);
		var deviceName = req.params.id;
		var index = -1;
		var highTemp;

		// set highTemp and index to the first occurence of a reading from specified device
		for(var i = 1; i < Object.keys(table).length; i++) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName) {
				highTemp = obj.temperature;
				index = i;
				break;
			}
		}

		// loop through all objects and find ones with speicifed device id
		// compare its temperature to the current highest
		for(var i = 1; i <= Object.keys(table).length; i++ ) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName && obj.temperature > highTemp) {
				highTemp = obj.temperature;
				index = i;
			}
		}
		if (index > -1) {
			var obj = table['reading'+index]
			res.end("Temperature: " + obj.temperature + "\nTimestamp: " + obj.timestamp);
		}
	})
});

app.get('/temp/:id/lowest', function(req, res) {
	fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
		// read the file into table
		var table = JSON.parse(data);
		var deviceName = req.params.id;
		var lowTemp;
		var index = -1;

		// set lowTemp and index to the first occurence of a reading from specified device
		for(var i = 1; i < Object.keys(table).length; i++) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName) {
				lowTemp = obj.temperature;
				index = i;
				break;
			}
		}

		// loop through all objects and compare their temperatures with the lowest temperature iff they have the specified device id
		for(var i = 1; i <= Object.keys(table).length; i++ ) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName && obj.temperature < lowTemp) {
				lowTemp = obj.temperature;
				index = i;
			}
		}
		if (index > -1) {
			var obj = table['reading'+index]
			res.end("Temperature: " + obj.temperature + "\nTimestamp: " + obj.timestamp);
		}
	})
});

app.get('/temp/:id/average', function(req, res) {
	fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
		// read the file into table
		var table = JSON.parse(data);
		var deviceName = req.params.id;
		var sumOfTemps = 0;
		var numOfReadings = 0;

		// find all readings with specified device id and add them to a sum
		// increase the number of readings
		for(var i = 1; i <= Object.keys(table).length; i++ ) {
			var obj = table['reading'+i];
			if (obj.device_id === deviceName) {
				sumOfTemps += obj.temperature;
				numOfReadings++;
			}
		}

		// if there was at least one reading, then prince the average
		if (numOfReadings > 0) {
			res.end("Average temperature: " + sumOfTemps/numOfReadings);
		}
	})
});

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
