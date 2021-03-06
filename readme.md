## Install & Use
```cmd
npm i vv-http
```
```js
let http = require('vv-http')

let server = http.create({url: 'http://127.0.0.1:3000/subpath'})

// or https with internal self signed cert
// let server = http.create({url: 'https://127.0.0.1:3000/subpath'})
// or https with your cert
// let server = http.create({url: 'https://127.0.0.1:3000/subpath', ssl: {key: fs.readFileSync('key.pem'), cert: fs.readFileSync('cert.pem')}})

server.on_error(error => {
    console.log(error)
})

server.on_request(request => {
    console.log(request)
    request.reply(200, 'hi')
})

server.start(error => {
    if (error) {
        console.log(error)
    } else {
        console.log('START')
    }

    //send GET message to started server
    http.get('http://127.0.0.1:3000/subpath?a=5&b=7', undefined, (error, buffer)  => {
        if (error) {
            console.log(error)
        } else {
            console.log(buffer.toString('utf8'))
        }
    })
})
```## Functions

<dl>
<dt><a href="#create">create([options])</a></dt>
<dd></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#app">app</a> : <code>lib_app</code></dt>
<dd></dd>
<dt><a href="#constructor_options">constructor_options</a> : <code>type.constructor_options</code></dt>
<dd></dd>
<dt><a href="#request">request</a> : <code>type.request</code></dt>
<dd></dd>
<dt><a href="#request_method">request_method</a> : <code>type.request_method</code></dt>
<dd></dd>
<dt><a href="#function_reply">function_reply</a> : <code>type.function_reply</code></dt>
<dd></dd>
</dl>

<a name="create"></a>

## create([options])
**Kind**: global function  

| Param | Type |
| --- | --- |
| [options] | [<code>constructor\_options</code>](#constructor_options) | 

<a name="app"></a>

## app : <code>lib\_app</code>
**Kind**: global typedef  
<a name="constructor_options"></a>

## constructor\_options : <code>type.constructor\_options</code>
**Kind**: global typedef  
<a name="request"></a>

## request : <code>type.request</code>
**Kind**: global typedef  
<a name="request_method"></a>

## request\_method : <code>type.request\_method</code>
**Kind**: global typedef  
<a name="function_reply"></a>

## function\_reply : <code>type.function\_reply</code>
**Kind**: global typedef  
