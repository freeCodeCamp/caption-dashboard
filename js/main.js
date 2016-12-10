define(require => {
    "use strict"

    const youtube = require("./apis/youtube")
    const github = require("./apis/github")

    console.log(youtube)
    console.log(github)

    gapi.load('client')
})
