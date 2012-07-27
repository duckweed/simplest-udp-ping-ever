var conString = "tcp://postgres:5432@localhost/fitnesse_metrics_db";
var helpHttpPort = 8088;
var metricsUdpPort = 42830;

var http = require('http');
var pg = require('pg');
var markdown = require( "markdown" );

var fs = require("fs");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

/**
 * when you receive a message, save it to database
 */
server.on("message", function (msg, rinfo) {
    logMessage(msg, rinfo);
    pg.connect(conString, function (err, client) {
        client.query(insert(msg), function (err, result) {
            console.log("error: " + err);
        });
    });
});

/**
 * show that you're running
 */
server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

/**
 * output help page
 */

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    res.write('hello');

    fs.readFile('./hello.md', 'utf8', function(err, markdownFile){
        var html = markdown.markdown.toHTML(markdownFile);
        console.log(html);
        res.write(html);
    });

    res.write('good bye');
    res.end();
}).listen(helpHttpPort, '127.0.0.1');

console.log('Server running at http://127.0.0.1:' + helpHttpPort);
server.bind(metricsUdpPort);

function insert(msg) {
    return "insert into message values ('" + msg + "')";
}


function logMessage(msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
}

