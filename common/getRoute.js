var fs = require('fs'),
		path = require('path'),
		mainPath = require('process').cwd(),
		myEjs = require('./myEjs'),
		mime = require('./mime');
module.exports = function(req, res){
	if(req.method == 'GET'){
		var paths= decodeURIComponent(req.url),
				type = path.extname(paths);
		switch (true){
			case (paths =='/'):
				var obj = {};
				obj.name =  req.cookies.name ? nameJson[req.cookies.name] : false; 
				obj.roomList = roomJson;
				myEjs('index', obj ,function(html){
					res.writeHead(200,{'Content-type':'text/html'});
					res.end(html);
				})
				break;
			case (paths == '/chat.html'):
				myEjs('chat', {name: nameJson[req.cookies.name]} ,function(html){
					res.writeHead(200,{'Content-type':'text/html'});
					res.end(html);
				})
				break;
			default:
				res.writeHead(404,{'Content-type':'text/html'});
				res.end('您访问的页面不存在');
		}
		return true;
	}else{
		return false;
	}
}


