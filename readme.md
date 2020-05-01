## Install & Use
```cmd
npm i vv-http
```
```js
const vvh = require('vv-http')

vvh.server.on_error(error => {
    console.error(error)
})

vvh.server.on_request(request => {
    console.log(request.data)
    request.reply(200, 'ok')
})
```
start http
```js
vvh.server.start({url: vvh.url_beautify('http://127.0.0.1:3000')}, error => {
    if (error) {
        console.log('ERROR ON START')
        console.error(error)
    } else {
        console.log('START')
    }
})
```
start https with internal sefl-signed ssl
```js
vvh.server.start({url: vvh.url_beautify('https://127.0.0.1:3000')}, error => {
    if (error) {
        console.log('ERROR ON START')
        console.error(error)
    } else {
        console.log('START')
    }
})
```
start https with your ssl
```js
const fs = require('fs')
vvh.server.start({url: vvh.url_beautify('https://127.0.0.1:3000'), ssl: {key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem')}}, error => {
    if (error) {
        console.log('ERROR ON START')
        console.error(error)
    } else {
        console.log('START')
    }
})
```
