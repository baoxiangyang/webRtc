var fs = require('fs'),
		path = require('path'),
		mainPath = require('process').cwd(),
		mime = require('./mime');
module.exports = function(req, res){
	var paths= decodeURIComponent(req.url),
			type = path.extname(paths);
	if(req.method == 'GET' && (paths.indexOf('/public') != -1 || paths == '/favicon.ico')){
		if(paths == '/favicon.ico'){
				paths = '/public'+paths;
		}
		fs.readFile(mainPath + paths, 'base64', function(err,data){
			if(err) console.log(err);
			res.writeHead(200,{'Content-type':mime(type)});
			res.end(data,'base64');
		});
		return true;
	}else {
		return false;
	}
}