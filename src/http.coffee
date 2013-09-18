#http的简单封装工具包
http=require "http"
querystring = require('querystring')

###
Agent = require('agentkeepalive')
keepaliveAgent = new Agent({
  maxSockets:30 
  maxKeepAliveRequests:0  # max requests per keepalive socket, default is 0, no limit.
  maxKeepAliveTime: 10000  # keepalive for 30 seconds
})
###

###
options=
    host:"192.168.1.1"
    port:"3000"
    path:"/home"
    header:
        "content-type":"text/xml"
    data:
        "name":"lin"
        age:30
    isFailNot200:true
    logger:null      #logger.debug  logger.error
    timeOut:10000    #10s
###

DEFAULT_PORT=80
DEFAULT_TIMEOUT=10000

post=(options, cb)->
    beginTime=new Date().getTime()
    myOptions =
        host : options.host
        port : options.port || DEFAULT_PORT
        path : options.path
        method : 'POST'
        headers:{}

    postStr = null
    
    if  options['headers']?
        myOptions.headers = options['headers']

    if options['data']?
        postStr = JSON.stringify options['data']
        myOptions.headers['Content-Type'] = 'application/json;charset=utf-8'
        myOptions.headers['Content-Length'] = Buffer.byteLength(postStr, 'utf8')
        
    #create
    logger=options.logger
    #options.agent=keepaliveAgent
    req = http.request myOptions,(res)->
        res.setEncoding 'utf8'
        data = ''
        res.on 'data', (chunk)->
            data += chunk
            
        res.on 'end',()->
            if logger
                costTime=new Date().getTime()-beginTime
                logger.debug "post #{myOptions.host}:#{myOptions.port} #{myOptions.path} #{res.statusCode},cost #{costTime}ms\ndata=#{postStr}\nretData=#{data}" 
            cb false, res, data

    req.on 'error',(e)->
        if logger
            costTime=new Date().getTime()-beginTime
            logger.error "post #{myOptions.host}:#{myOptions.port} #{myOptions.path},cost #{costTime}ms,error:#{e}\ndata=#{postStr}" 
        cb e

    #write data to request body
    if postStr
        req.write postStr,'utf8'
    timeout=options.timeout || DEFAULT_TIMEOUT
    req.setTimeout timeout
    req.on 'timeout', ()->
        req.abort()
    req.end()


get=(options, cb)->
    beginTime=new Date().getTime()
    myOptions =
        host : options.host
        port : options.port || 80
        path : options.path
        method : 'GET'
        headers:{}

    postStr = null
    
    if  options['headers']?
        myOptions.headers = options['headers']

    if options['data']?
        paramStr=querystring.stringify options.data
        #add to path
        if myOptions.path.indexOf("?")>0
            myOptions.path=myOptions.path+"&"+paramStr
        else
            myOptions.path=myOptions.path+"?"+paramStr
        
    #create
    logger=options.logger
    #options.agent=keepaliveAgent
    req = http.request myOptions,(res)->
        res.setEncoding 'utf8'
        data = ''
        res.on 'data', (chunk)->
            data += chunk
            
        res.on 'end',()->
            if logger
                costTime=new Date().getTime()-beginTime
                logger.debug "get #{myOptions.host}:#{myOptions.port} #{myOptions.path} #{res.statusCode},cost #{costTime}ms\ndata=#{postStr}\nretData=#{data}" 
            cb false, res, data

    req.on 'error',(e)->
        if logger
            costTime=new Date().getTime()-beginTime
            logger.error "get #{myOptions.host}:#{myOptions.port} #{myOptions.path},cost #{costTime}ms,error:#{e}\ndata=#{postStr}" 
        cb e

    #write data to request body
    timeout=options.timeout || DEFAULT_TIMEOUT
    req.setTimeout timeout
    req.on 'timeout', ()->
        req.abort()
    req.end()


module.exports.post=post
module.exports.get=get
