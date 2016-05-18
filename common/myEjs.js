var ejs = require('ejs'),
		fs = require('fs'),
		mainPath = require('process').cwd();
module.exports  = function(str, obj, callback){
	var path  = mainPath+"/views/"+str+".html";
	obj['filename'] = path;
	fs.readFile(path,'utf8',function(err, data){
		if(err) throw err;
		var html = ejs.render(data,obj)
		callback(html)
	});
}
