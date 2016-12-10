'use strict'

// based on: https://gist.github.com/ryanflorence/701407

var http = require('http')
var path = require('path')
var url  = require('url')
var fs   = require('fs')
var mimes = require('./mimes')

var port = process.argv[2] || 8080

/**
 * @param {http.ServerResponse} res
 * @param {Number} code
 * @param {String} type
 * @param {String|Buffer} body
 */
function respond(res, code, contentType, body) {
    res.writeHead(code, { 'Content-Type': contentType })
    res.write(body, code == 200 ? 'binary' : 'utf8')
    res.end()
}

http.createServer(function(req, res) {

    var uri = url.parse(req.url).pathname
    var filename = path.join(process.cwd(), uri)

    fs.access(filename, fs.F_OK, function(err) {

        if (err) return respond(res, 404, 'text/plain', '404 Not Found\n')
        if (fs.statSync(filename).isDirectory()) filename += '/index.html'

        fs.readFile(filename, 'binary', function(err, contents) {

            if (err) return respond(res, 500, 'text/plain', err + '\n')

            var ext = path.parse(filename)['ext'].substr(1)
            var mime = mimes[ext] ? mimes[ext] : 'text/plain'

            respond(res, 200, mime, contents)
        })
    })
}).listen(parseInt(port, 10))

console.log('Static file server running at\n => http://localhost:' + port + '/\nCTRL + C to shutdown')
