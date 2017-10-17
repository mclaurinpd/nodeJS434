var express = require('express');
var app = express();
var fs = require("fs");

app.get('/data', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.get('/temp/latest', function (req, res) {
   fs.readFile( __dirname + "/" + "deviceData.json", 'utf8', function (err, data) {
	   var table = JSON.parse(data);
       res.end( " " + table.device1.temperature );
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
