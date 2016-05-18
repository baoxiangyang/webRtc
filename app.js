var http = require('http'),
fs = require('fs'),
getRoute = require('./common/getRoute'),
postRoute = require('./common/postRoute'),
cookies = require('./common/cookies'),
getPublic = require('./common/getPublic'),
myws = require('./common/myws'),
dataBody = require('./common/dataBody'),
options = {
    key: fs.readFileSync('key.pem'),
    cert:fs.readFileSync('key-cert.pem')
};
var server = http.createServer(function(req,res){
		if(getPublic(req, res)){
			return false;
		}
		cookies(req);
		dataBody(req).then(function(){
			if(getRoute(req, res)){
				return false
			}
			postRoute(req, res);
		})
		
}).listen(3000);

myws(server);


