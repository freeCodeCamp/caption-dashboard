define(function (require) {
    "use strict"

    var config = require('../config')

    var exports = {}

    /**
     * @param {String} videoId
     * @param {Function} cb
     */
    exports.listCaptionsFromVideo = function(videoId, cb) {
        gapi.client.init({
            'apiKey': config.apis.youtube.apiKey,
            'discoveryDocs': config.apis.youtube.endpoint,
            'clientId': config.apis.youtube.clientId,
            'scope': 'profile'
        })
        .then(function() {
            return gapi.client.youtube.captions.list({ videoId: videoId, part: 'id' })
        })
        .then(
            function(response) {
                cb(undefined, response)
            },
            function(err) {
                cb(err, undefined)
            }
        )
    }

    return exports
})


gapi.load('client')
