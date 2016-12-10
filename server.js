"use strict"

var http = require("http")
var path = require("path")
var url  = require("url")
var fs   = require("fs")

var port = process.argv[2] || 8080

/**
 * @param {http.ServerResponse} res
 * @param {Number} code
 * @param {String} type
 * @param {String|Buffer} body
 */
function respond(res, code, type, body) {
    res.writeHead(code, code == 200 ? undefined : { "Content-Type": type })
    res.write(body, code == 200 ? "binary" : "utf8")
    res.end()
}

http.createServer(function(req, res) {
    var uri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), uri)
    fs.access(filename, fs.F_OK, function(err) {
        if (err) return respond(res, 404, "text/plain", "404 Not Found\n")
        if (fs.statSync(filename).isDirectory()) filename += '/index.html'
        fs.readFile(filename, "binary", function(err, contents) {
            if (err) return respond(res, 500, "text/plain", err + "\n")
            respond(res, 200, "text/plain", contents)
        })
    })
}).listen(parseInt(port, 10))

console.log("Static file server running at\n => http://localhost:" + port + "/\nCTRL + C to shutdown")
