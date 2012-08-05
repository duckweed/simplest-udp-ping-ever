var conString = "tcp://postgres:5432@localhost/fitnesse_metrics_db";
var helpHttpPort = 8088;
var metricsUdpPort = 42830;

var http = require('http');
var pg = require('pg');
var markdown = require("markdown");

var fs = require("fs");
var dgram = require("dgram");
var server = dgram.createSocket("udp4");

/**
 * when you receive a message, save it to database
 */
server.on("message", function (msg, rinfo) {
    logMessage(msg, rinfo);
    pg.connect(conString, function (err, client) {
        var query = client.query({
                    name:'insert test',
                    text:'insert into fitnesse_test ('
                            + 'id, test_name, run_time_in_millis, '
                            + 'run_date, status, host, '
                            + 'ip_address, branch, '
                            + 'sha, run) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)' },
                function (err, result) {
                });

        console.log(msg);

        var parse = JSON.parse(msg);
        console.log(parse.msg);

        client.query({
            name:'insert test',
            values:[parse.id, parse.test_name, parse.run_time_in_millis, parse.run_date, parse.status, parse.host, parse.ip_address, parse.branch, parse.sha,
                parse.run]
        })
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
    var mdFile = fs.readFileSync('./hello.md', 'utf8');
    var html = markdown.markdown.toHTML(mdFile);

    res.writeHead(200, {'Content-Type':'text/html'});
    res.write(html);
    res.end();

}).listen(helpHttpPort, '127.0.0.1');

console.log('Server running at http://127.0.0.1:' + helpHttpPort);
server.bind(metricsUdpPort);

function logMessage(msg, rinfo) {
    console.log("server got: " + msg + " from " + rinfo.address + ":" + rinfo.port);
}