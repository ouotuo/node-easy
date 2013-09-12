root=process.cwd()
#httpSend=require "#{root}/lib/utils/httpSend"
	
describe 'test', ->
	#简单加载对象
	it 'a test', (done)->
        expect(200).toEqual(200)
        done()
		
	it 'b test', (done)->
        expect(false).toBeFalsy()
        expect(2).toBeGreaterThan(1)
        done()


