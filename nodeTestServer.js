var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser');
var json
var deviceData = {};
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/post', function (req, res) {
	json = JSON.stringify(req.body);
	if (!deviceData[req.body.device_id]) {
		deviceData[req.body.device_id] = new Array();
	}
	deviceData[req.body.device_id].push(new Array(req.body.temperature, req.body.timestamp));
	console.log("Entry added: " + json);
	res.send("");
});

app.get('/temp/latest', function (req, res) {
   var latest = 0;
   Object.keys(deviceData).forEach(function (id) {
	   for (i = 0; i < deviceData[id].length; i++) {
			if (deviceData[id][i][1] > latest) {
				latest = deviceData[id][i][1]
			}
	   }
   })
   res.end("Latest submission: " + latest);
})

app.get('/temp/highest', function (req, res) {
   var highest = 0;
   Object.keys(deviceData).forEach(function (id) {
	   for (i = 0; i < deviceData[id].length; i++) {
			if (deviceData[id][i][0] > highest) {
				highest = deviceData[id][i][0]
			}
	   }
   })
   res.end("Highest temperature: " + highest);
})

app.get('/temp/lowest', function (req, res) {
   var lowest = 10000;
   Object.keys(deviceData).forEach(function (id) {
	   for (i = 0; i < deviceData[id].length; i++) {
			if (deviceData[id][i][0] < lowest) {
				lowest = deviceData[id][i][0]
			}
	   }
   })
   res.end("Lowest temperature: " + lowest);
})

app.get('/temp/average', function (req, res) {
   var avg = 0;
   var count = 0;
   Object.keys(deviceData).forEach(function (id) {
	   for (i = 0; i < deviceData[id].length; i++) {
			avg = avg + deviceData[id][i][0];
			count = count + 1;
	   }
   })
   res.end("Average temperature: " + (avg / count));
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
