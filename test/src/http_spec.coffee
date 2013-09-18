root=process.cwd()
#httpSend=require "#{root}/lib/utils/httpSend"
Http=require("#{root}/lib").Http
logger=require("#{root}/test/lib/consoleLogger")
	
http = require "http"
url = require "url"
SERVER_PORT=10086
resFun=(req,res)->
    path = url.parse(req.url).pathname

    #post
    if req.method=='POST'
        postData = ''
        req.setEncoding('utf8')

        req.addListener 'data', (postDataChunk)->
            postData += postDataChunk

        req.addListener 'end', ()->
            res.write postData
            res.end()

    else if req.method=='GET'
        #data
        url_parts = url.parse(req.url, true)
        query = url_parts.query
        res.write JSON.stringify query
        res.end()


server=http.createServer(resFun).listen(SERVER_PORT,"localhost")

describe 'http post', ->
	it 'post not exist host', (done)->
        options=
            host:"10.2.126.215"
            port:5678
            path:"/quoteStock"
            logger:logger
            timeout:4000
        Http.post options,(err,res,data)->
            expect(err!=false).toEqual(true)
            done()
        
    it 'post no data', (done)->
        options=
            host:"localhost"
            port:SERVER_PORT
            path:"/"
            logger:logger
        Http.post options,(err,res,data)->
            expect(res.statusCode).toEqual(200)
            done()
   	
    it 'post with data,a data', (done)->
        options=
            host:"localhost"
            port:SERVER_PORT
            path:"/data"
            logger:logger
            data:
                pLe:300
        Http.post options,(err,res,data)->
            ret=JSON.parse data
            expect(res.statusCode).toEqual(200)
            expect(ret.pLe).toEqual(300)
            done()

describe 'http get', ->
	it 'get not exist host', (done)->
        options=
            host:"10.2.126.215"
            port:5678
            path:"/quoteStock"
            logger:logger
            timeout:4000
        Http.get options,(err,res,data)->
            done()
        
    it 'get exist host', (done)->
        options=
            host:"localhost"
            port:SERVER_PORT
            path:"/get"
            logger:logger
            timeout:4000
        Http.get options,(err,res,data)->
            expect(res.statusCode).toEqual(200)
            done()
   	
    it 'get with param', (done)->
        options=
            host:"localhost"
            port:SERVER_PORT
            path:"/get"
            logger:logger
            timeout:4000
            data:
                name:"abc"
        Http.get options,(err,res,data)->
            ret=JSON.parse data
            expect(err).toEqual(false)
            expect(res.statusCode).toEqual(200)
            expect(ret.name).toEqual("abc")
            server.close()
            done()


