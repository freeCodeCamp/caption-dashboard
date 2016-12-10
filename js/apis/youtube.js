define(require => {
    "use strict"

    const config = require('../config')

    const exports = {}

    /**
     * @param {String} videoId
     * @param {Function} cb
     */
    exports.listCaptionsFromVideo = (videoId, cb) => {
        gapi.client.init({
            'apiKey': config.apis.youtube.apiKey,
            'discoveryDocs': config.apis.youtube.endpoint,
            'clientId': config.apis.youtube.clientId,
            'scope': 'profile'
        })
        .then(() => {
            return gapi.client.youtube.captions.list({ videoId: videoId, part: 'id' })
        })
        .then(response => {
                cb(undefined, response)
            },
            err => {
                cb(err, undefined)
            }
        )
    }

    return exports
})
