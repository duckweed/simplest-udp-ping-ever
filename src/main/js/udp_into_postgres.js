var conString = "tcp://postgres:5432@localhost/fitnesse_metrics_db";
var helpHttpPort = 8080;
var metricsUdpPort = 42830;

var http = require('http');
var pg = require('pg');
var markdown = require( "markdown" );

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

    var input = "# Fitnesse Metrics\n\nParagraph";
    var output = "<html>" + markdown.markdown.toHTML( input ) + '</html>';
    res.write( output );
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

