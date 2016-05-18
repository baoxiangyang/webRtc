var WebSocketServer = require('ws').Server,
		querystring = require('querystring'),
		parUrl = require('url'),
		wsJson = {} ,newWs, name = 0;
module.exports = function(server){
	var WebSocket = new WebSocketServer({server: server});
	WebSocket.on('connection', function(ws){
		var data = urlData(ws);
			ws.name = data.name;
			if(!roomJson[data.room]){
				ws.send(JSON.stringify({'type':'error','mes':'该房间不存在'}));
				return false;
			}
			if(!roomJson[data.room].wsJson){
				roomJson[data.room].wsJson = {}	
			}
			roomJson[data.room].newWs = ws;
			roomJson[data.room].wsJson[data.name] = ws;
	    for(var i in roomJson[data.room].wsJson){
	        if(roomJson[data.room].wsJson[i] != ws){
	            roomJson[data.room].wsJson[i].send(JSON.stringify({
	                type:'name',
	                name:ws.name
	            }));
	        }
	    }
	    ws.on('message', function(data){
	        var json = JSON.parse(data),
	       			data = urlData(ws),
	        		newWs = roomJson[data.room].newWs,
	        		wsJson = roomJson[data.room].wsJson;
	        switch (json.type){
	            case 'peer':
	                if(json.data.sdp.type == 'offer'){
	                    console.log('offer')
	                    json.name = ws.name;
	                    newWs.send(JSON.stringify(json))
	                }else if(json.data.sdp.type == 'answer'){
	                    console.log('answer')
	                    var tempWs = wsJson[json.name];
	                    json.name = ws.name;
	                    tempWs.send(JSON.stringify(json));
	                }
	                break;
	            case 'ice':
	                console.log('ice')
	                var tempWs = wsJson[json.name];
	                json.name = ws.name;
	                tempWs.send(JSON.stringify(json));
	                break;
	            default:
	                
	        }
	    })
	    ws.on('error',function(error){
	        console.log('error',error)
	    })
	    ws.on('close', function(){
	        delete wsJson[ws.name];
	        for(var i in wsJson){
	            if(wsJson[i] != ws){
	                wsJson[i].send(JSON.stringify({
	                    type:'close',
	                    name:ws.name
	                }));
	            }
	        }
	        console.log('close: '+ws.name);
	    })
	})
}
function urlData(ws){
	var urlData = parUrl.parse(ws.upgradeReq.url,true),
	data = {
		pathName: urlData.pathname,
		room: urlData.query.room,
		name: querystring.parse(ws.upgradeReq.headers.cookie,'; ','=').name
	}
	return data;
}