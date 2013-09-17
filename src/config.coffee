path=require "path"
fs=require "fs"

#把c2的配置配置入c1中
merge_config = (c1,c2,env) ->
    for own k,v of c2
        if typeof(v) == 'object' && not (v instanceof RegExp) && c1[k]
            merge_config(c1[k],v)
        else
            c1[k] = v
    return c1

#从文件读入配置到config
merge=(config,configFileName,env)->
    configName=path.basename configFileName
    try
        youConfig=require configFileName 
        if youConfig['environment']?
            config_env = youConfig.environment[env]
            delete  youConfig.environment
            merge_config(youConfig,config_env)
    catch e
        console.trace "#{e}"
        process.exit(1)
    
    config[configName]=youConfig
    
#获取文件配置
getFileConfig=(configFileName,env)->
    configName=path.basename configFileName
    try
        youConfig=require configFileName 
        if youConfig['environment']?
            config_env = youConfig.environment[env]
            delete  youConfig.environment
            merge_config(youConfig,config_env)
    catch e
        console.trace "#{e}"
        process.exit(1)
    return youConfig

#module.exports.config重新设置配置
configFile=(config,filePath)->
    env=config.__env
    try
        myConfig=getFileConfig filePath,env
        merge_config config,myConfig,env
    catch e
        console.error "error when config file=#{filePath}"
        console.trace "#{e}"
        process.exit(1)


#加载某个目录的配置
INDEX_FILE="index.js"
loadConfig=(dir,env='test')->
    indexFile = path.join dir,INDEX_FILE
    config =getFileConfig indexFile,env

    fileNames=fs.readdirSync dir
    if fileNames
        for name in fileNames
            if INDEX_FILE==name || not /\.js$/.test name
                continue
            
            baseName=path.basename name,'.js'
            file=path.join dir,baseName
            merge config,file,env

    config.__env=env
    return config



module.exports.loadConfig=loadConfig
module.exports.configFile=configFile
