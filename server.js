'use strict'

// based on: https://gist.github.com/ryanflorence/701407

const http  = require('http'),
      path  = require('path'),
      url   = require('url'),
      fs    = require('fs'),
      mimes = require('./mimes')

var port = process.argv[2] || 8080

/**
 * @param {http.ServerResponse} res
 * @param {Number} code
 * @param {String} contentType
 * @param {String|Buffer} body
 */
const respond = (res, code, contentType, body) => {
    res.writeHead(code, { 'Content-Type': contentType })
    res.write(body, code == 200 ? 'binary' : 'utf8')
    res.end()
}

http.createServer((req, res) => {

    const uri = url.parse(req.url).pathname
    let filename = path.join(process.cwd(), uri)

    fs.access(filename, fs.F_OK, err => {

        if (err) return respond(res, 404, 'text/plain', '404 Not Found\n')
        if (fs.statSync(filename).isDirectory()) filename += '/index.html'

        fs.readFile(filename, 'binary', function(err, contents) {

            if (err) return respond(res, 500, 'text/plain', err + '\n')

            const ext = path.parse(filename)['ext'].substr(1)
            const mime = mimes[ext] ? mimes[ext] : 'text/plain'

            respond(res, 200, mime, contents)
        })
    })
}).listen(parseInt(port, 10))

console.log('Static file server running at\n => http://localhost:' + port + '/\nCTRL + C to shutdown')
