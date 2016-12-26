define(require => {
    "use strict"

    const youtube = require("./apis/youtube")
    const github = require("./apis/github")

    console.log(youtube)
    console.log(github)

    $(document).ready(() => {
        $("#videos-list").click(e => {
            let classes = e.target.classList
            let isEditButton
            let videoId

            classes.forEach(item => {
                if (item.indexOf("edit-video-") !== -1) {
                    isEditButton = true
                    videoId = item.replace("edit-video-", "")
                }
            })

            if (isEditButton) editVideo(videoId)
        })

        $("#return-button").click(() => {
            $("#videos-container").removeClass("hidden")
            $("#edit-video-container").addClass("hidden")
        })
    })

    function editVideo (videoId) {
        $("#videos-container").addClass("hidden")
        $("#edit-video-container").removeClass("hidden")

        let video = youtube.getVideoById(videoId)

        $("#video-title").text(video.snippet.title)
        $("#video-thumbnail").attr("src", video.snippet.thumbnails.medium.url)

        $("#captions-list").empty()

        youtube.getCaptionsFromVideo(videoId, captions => {
            captions.forEach(caption => {
                $("#captions-list").append(
                    '<div class="mdl-list__item video-item">' +
                        '<span class="mdl-list__item-primary-content">' +
                            caption +
                        '</span>' +
                    '</div>'
                )
            })
        })
    }

    gapi.load('client')
})
