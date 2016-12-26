define(require => {
    "use strict"

    const config = require('../config')

    let exports = {}
    let languagesCbs = []

    let languages = null
    $.getJSON("https://raw.githubusercontent.com/JumpLink/country-list/master/all_languages.json", res => {
        languages = res.en_GB
        languagesCbs.forEach(cb => cb())
    })

    let videos = []

    function getVideos(videos, nextPageToken, cb) {
        let data = {
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
        }).done(data => {
            videos = videos.concat(data.items);
            /*if (data.nextPageToken) getVideos(videos, data.nextPageToken, cb)
            else */cb(videos)
            //UNCOMMENT THE ABOVE TWO LINES AND CHANGE MAXRESULTS TO 50 TO LIST ALL FREECODECAMP VIDEO'S
        });
    }

    getVideos([], null, videos => {
        exports.videos = videos
        videos.forEach(video => {
            exports.getCaptionsFromVideo(video.id.videoId, captions => {
                captions = captions.map(caption => {
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

    gapi.load('client', () => {
        gapi.client.init({
            'clientId': config.apis.youtube.clientId,
            'scope': 'profile'
        })
    })

    exports.login = () => {
        gapi.auth2.getAuthInstance().signIn()
    }

    exports.logout = () => {
        gapi.auth2.getAuthInstance().signOut()
    }

    exports.loggedIn = () => {
        return gapi.auth2.getAuthInstance().isSignedIn.get()
    }

    exports.getCaptionsFromVideo = (videoId, cb) => {
        let data = {
            part: "snippet",
            videoId: videoId,
            key: config.apis.youtube.key,
        }
        $.ajax({
            method: "GET",
            url: "https://www.googleapis.com/youtube/v3/captions",
            data: data
        }).done(data => {
            if (!languages) languagesCbs.push(() => {
                prettyify()
            })
            else prettyify()
            function prettyify() {
                cb(data.items.map(caption => {
                    caption.snippet.language = caption.snippet.language.replace("-", "_")
                    let language = languages[caption.snippet.language]
                    language = (language) ? language : "Unknown"
                    let type = (caption.snippet.trackKind === "ASR") ? "Automatically generated" : ""
                    return language + ((type) ? (" - " + type) : "") + ((caption.snippet.isDraft) ? " - draft" : "")
                }))
            }
        })
    }

    exports.getVideoById = videoId => {
        return exports.videos.forEach(video => {
            if (videoId === video.id.videoId) return video;
        })
    }

    return exports
})
