define(function(require) {
    "use strict"

    var youtube = require("./apis/youtube")
    var github = require("./apis/github")

    console.log(youtube)
    console.log(github)

    gapi.load('client')
})
