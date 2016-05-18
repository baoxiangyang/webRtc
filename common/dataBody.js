var url = require('url'),
		querystring = require('querystring');
module.exports = function(req){
	return new Promise(function(resolve, reject){
		if(req.method == 'GET'){
			var parse = url.parse(req.url,true).query;
			req['bodys'] = parse;
			resolve();
		}else if(req.method == 'POST'){
			var data = "";
			req.on('data',function(chunk){
				data += chunk;
			})
			req.on('end',function(){
				req['bodys'] = querystring.parse(querystring.unescape(data));
				resolve();
			})
		}
	})
}