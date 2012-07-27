var conString = "tcp://postgres:5432@localhost/fitnesse_metrics_db";

var dgram = require("dgram");
var pg = require('pg');

var server = dgram.createSocket("udp4");

server.on("message", function (msg, rinfo) {
    logMessage(msg, rinfo);
    pg.connect(conString, function (err, client) {
        client.query(insert(msg), function (err, result) {
            console.log("error: " + err);
        });
    });
});

server.on("listening", function () {
    var address = server.address();
    console.log("server listening " + address.address + ":" + address.port);
});

server.bind(43280);

function insert(msg) {
    return "insert into message values ('" + msg + "')";
}

function logMessage(msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
}

