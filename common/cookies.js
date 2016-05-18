var querystring = require('querystring');
module.exports = function(req){
	var cookie = req.headers.cookie;
	req.cookies = querystring.parse(cookie,"; ","=");
}