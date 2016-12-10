console.log('GitHub module successfully started')

const config = {
    githubRepo: 'luveti/caption-dashboard',
    testUrl: 'https://api.github.com/repos/vmg/redcarpet/issues?state=closed'
}

const getJSON = (url, cb) => {
    let req = new XMLHttpRequest()
    req.open("GET", url, false)
    req.send(null)
    let res = req.responseText
    cb(JSON.parse(res))
}


setTimeout(() => {
    getJSON('https://api.github.com/repos/vmg/redcarpet/issues?state=closed', (res) => {
        console.log(res);
    })
}, 500);