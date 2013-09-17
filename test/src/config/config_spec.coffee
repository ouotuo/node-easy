path=require "path"
root=process.cwd()
Config=require("#{root}/lib").Config
	
describe 'config test1', ->
	it 'load from dir with one file', (done)->
        dir=path.join __dirname,"./config1"
        config = Config.loadConfig dir,'test1'

        expect(config.app).toEqual('test')
        expect(config.http.port).toEqual(4001)
        expect(config.logDir).toEqual('test1')

        expect(config.index1.app).toEqual('test')
        expect(config.index1.http.port).toEqual(4001)
        expect(config.index1.logDir).toEqual('test1')

        done()
		
	it 'b test', (done)->
        expect(false).toBeFalsy()
        expect(2).toBeGreaterThan(1)
        done()


