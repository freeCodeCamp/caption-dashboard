define(function (require) {
    "use strict"

    var config = require('../config')

    var exports = {}

    var videos = []

    function getVideos(videos, nextPageToken, cb) {
        var data = {
            part: "snippet",
            channelId: "UC8butISFwT-Wl7EV0hUK0BQ",
            key: "AIzaSyAdc33J85V6rs-VI6COLgzIwe4s5vhWY0Q",
            maxResults: 10
        }
        if (nextPageToken) {
            data.pageToken = nextPageToken
        }
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/search",
            data: data
        }).done(function(data) {
            videos = videos.concat(data.items);
            if (data.nextPageToken) getVideos(videos, data.nextPageToken, cb)
            else cb(videos)
        });
    }

    /*getVideos([], null, function(videos) {
        exports.videos = videos;
        videos.forEach(function(video) {
            console.log(video);
            $("#videos-list").append(
                '<div class="mdl-list__item video-item">' +
                    '<span class="mdl-list__item-primary-content">' +
                        '<img src="' + video.snippet.thumbnails.medium.url + '" class="thumbnail">' +
                        '<span>' + video.snippet.title + '</span>' +
                    '</span>' +
                    '<span class="mdl-list__item-secondary-content">' +
                        '<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect">' +
                            'Edit' +
                        '</button>' +
                    '</span>' +
                '</div>'
            );
        });
    })*/

    gapi.load('client', function() {
        gapi.client.init({
            'clientId': config.apis.youtube.clientId,
            'scope': 'profile'
        })
    })

    /**
     * @param {String} videoId
     * @param {Function} cb
     */
    exports.listCaptionsFromVideo = function(videoId, cb) {
        /*gapi.client.youtube.captions.list({ videoId: videoId, part: 'id' })
            .then(
                function(response) {
                    cb(undefined, response)
                },
                function(err) {
                    cb(err, undefined)
                }
            )*/
    }

    exports.login = function() {
        gapi.auth2.getAuthInstance().signIn()
    }

    exports.logout = function() {
        gapi.auth2.getAuthInstance().signOut()
    }

    exports.loggedIn = function() {
        return gapi.auth2.getAuthInstance().isSignedIn.get()
    }

    /*exports.listVideosFromChannel = function(channelId, cb) {
        gapi.client.youtube.captions.list({ videoId: videoId, part: 'id' })
            .then(
                function(response) {
                    cb(undefined, response)
                },
                function(err) {
                    cb(err, undefined)
                }
            )
    }*/

    return exports
})
