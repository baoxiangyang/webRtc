global.nameJson = {};
global.roomJson = {};
module.exports = function(req,res){
	if(req.method != 'POST'){
		return false;
	}
	var paths= decodeURIComponent(req.url);
	switch (paths){
		case '/':
			if(req.bodys.name in nameJson){
				resEnd({state:-1, msg:'该用户名已存在请重新输入'})
			}else{
				nameJson[req.bodys.name] = req.bodys.nick;
				resEnd({state:1}, null, {'Content-type':'text/plain','Set-Cookie':['name='+req.bodys.name+';HttpOnly=true','aa=cc']});
			}		
			break;
		case '/createRoom':
			var name =  req.cookies.name,
					data = req.bodys;
			if(!name){
				resEnd({state:-1, msg:'请先设置您的昵称'});
				return false;
			}
			if(data.roomNubmer in roomJson){
				resEnd({state:-1, msg:'该房间号已存在，请重新输入'});
				return false;
			}
			roomJson[data.roomNubmer] = {
				roomName: data.roomName,
				roomType: data.roomType,
				roomCreate: nameJson[name]
			}
			resEnd({state:1, meg:'房间创建成功'});
			break;
		default:
			resEnd({state:-1, meg:'该接口不存在'}, 404);
	}
	function resEnd(json, statue, type){
		var json = json ? JSON.stringify(json) : {},
				statue = statue || 200,
				type = type || {'Content-type':'text/plain'};
				res.writeHead(statue, type);
				res.end(json);
	}
}

