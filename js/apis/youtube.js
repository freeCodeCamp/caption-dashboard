define(function (require) {
    "use strict"

    var config = require('../config')

    var exports = {}
    var languagesCbs = []

    var languages = null
    $.getJSON("https://raw.githubusercontent.com/JumpLink/country-list/master/all_languages.json", function(res) {
        languages = res.en_GB
        languagesCbs.forEach(function(cb) {
            cb()
        })
    })

    var videos = []

    function getVideos(videos, nextPageToken, cb) {
        var data = {
            part: "snippet",
            channelId: config.apis.youtube.channelId,
            key: config.apis.youtube.key,
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
            /*if (data.nextPageToken) getVideos(videos, data.nextPageToken, cb)
            else */cb(videos)
            //UNCOMMENT THE ABOVE TWO LINES AND CHANGE MAXRESULTS TO 50 TO LIST ALL FREECODECAMP VIDEO'S
        });
    }

    getVideos([], null, function(videos) {
        exports.videos = videos
        videos.forEach(function(video) {
            exports.getCaptionsFromVideo(video.id.videoId, function(captions) {
                captions = captions.map(function(caption) {
                    return '<li><a href="https://www.youtube.com/timedtext_video?v=' + video.id.videoId + '">' + caption + '</a></li>'
                })
                $("#videos-list").append(
                    '<div class="mdl-list__item video-item">' +
                        '<span class="mdl-list__item-primary-content">' +
                            '<img src="' + video.snippet.thumbnails.medium.url + '" class="thumbnail">' +
                            '<ul class="video-item-strings">' +
                                '<li><a href="https://youtube.com/watch?v=' + video.id.videoId + '">' + video.snippet.title + '</a></li>' +
                                captions.join("") +
                            '</ul>' +
                        '</span>' +
                        /*'<span class="mdl-list__item-secondary-content">' +
                            '<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect edit-video-' + video.id.videoId + '">' +
                                'Edit' +
                            '</button>' +
                        '</span>' +*/
                    '</div>'
                )
            })
        })
    })

    gapi.load('client', function() {
        gapi.client.init({
            'clientId': config.apis.youtube.clientId,
            'scope': 'profile'
        })
    })

    exports.login = function() {
        gapi.auth2.getAuthInstance().signIn()
    }

    exports.logout = function() {
        gapi.auth2.getAuthInstance().signOut()
    }

    exports.loggedIn = function() {
        return gapi.auth2.getAuthInstance().isSignedIn.get()
    }

    exports.getCaptionsFromVideo = function(videoId, cb) {
        var data = {
            part: "snippet",
            videoId: videoId,
            key: config.apis.youtube.key,
        }
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/captions",
            data: data
        }).done(function(data) {
            if (!languages) languagesCbs.push(function() {
                prettyify()
            })
            else prettyify()
            function prettyify() {
                cb(data.items.map(function (caption) {
                    caption.snippet.language = caption.snippet.language.replace("-", "_")
                    var language = languages[caption.snippet.language]
                    language = (language) ? language : "Unknown"
                    var type = (caption.snippet.trackKind === "ASR") ? "Automatically generated" : ""
                    return language + ((type) ? (" - " + type) : "") + ((caption.snippet.isDraft) ? " - draft" : "")
                }))
            }
        })
    }

    exports.getVideoById = function(videoId) {
        var returnVideo
        exports.videos.forEach(function(video) {
            if (videoId === video.id.videoId) {
                returnVideo = video
            }
        })
        return returnVideo
    }

    return exports
})
