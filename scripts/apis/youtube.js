console.log('YouTube module successfully started')

const config = {
    apiKey: 'AIzaSyChV1Rsp9PgfPltS4DAu2GBLsUsgAY3cHc',
    clientId: '101706023134-e3890ujf30bjqqr7vjatmulpq6cr58cn.apps.googleusercontent.com.apps.googleusercontent.com'
}

const listCaptionsFromVideo = (videoId) => {
    gapi.client.init({
        'apiKey': config.apiKey,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        'clientId': config.clientId,
        'scope': 'profile'
    }).then(() => {
        return gapi.client.youtube.captions.list({
            videoId,
            part: 'id'
        })
    }).then(function(response) {
        console.log(response.result)
    }, function(reason) {
        console.log('Error: ' + reason.result.error.message)
    })
}

gapi.load('client')

setTimeout(() => {
    listCaptionsFromVideo('v8kFT4I31es')
    downloadCaptionFromCaptions()
}, 500);