$(function(){
  $('.mian').height($(document).height());
  var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
      RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription, stdout = null; window.pcJson = {}; window.dataChannelJson = {};
      navigator.getUserMedia = navigator.getUserMedia ||  navigator.webkitGetUserMedia|| navigator.mozGetUserMedia;
  var iceServer = {
      "iceServers": [{
          "url": "stun:stun.l.google.com:19302"
      }, {
          "url": "turn:numb.viagenie.ca",
          "username": "webrtc@live.com",
          "credential": "muazkh"
      }]
  },
  socket = new WebSocket("ws://"+window.location.host+'/chat.html?room='+window.location.hash.slice(1));
  /*getMedias = new Promise(function(resolve, reject){
      navigator.getUserMedia({
          audio: true,
          video: true
      }, function(stream){
          stdout = stream;
          resolve();
      }, function(error){
          alert('获取摄像头失败');
          reject(error);
          console.log('getUserMedia error: ' + error);
      });
  });*/
  socket.onmessage = function(event){
      var json = JSON.parse(event.data);
      switch (json.type){
          case 'name':
              window.nameJson[json.name] = json.nick; 
              $('#names').append('<option value="'+json.name+'">'+json.nick+'</option>');
              var peer = peerOffer(json);
              pcJson[json.name] = peer; 
              break;
          case 'ice':
              pcJson[json.name].addIceCandidate(new RTCIceCandidate(json.data.candidate));
              break;
          case 'peer':
              if(json.data.sdp.type == 'answer'){
                pcJson[json.name].setRemoteDescription(new RTCSessionDescription(json.data.sdp));
              }else if(json.data.sdp.type == "offer") {
                  var peer = peerAnswer(json);
                  peer.name = json.name;
                  pcJson[json.name] = peer; 
              }
              break;
          case 'close':
              pcJson[json.name].close();
              delete pcJson[json.name];
              //document.getElementById(json.name).style.display = 'none';
              break;
          case 'nameJson':
            window.nameJson = json.namejson;
            var options= $(document.createDocumentFragment());
            for(var i in nameJson){
              options.append('<option value="'+i+'">'+nameJson[i]+'</option>');
            }
            $('#names').append(options);
            break
          default:
            console.log(event.data);
      }
  };
  function socSend(json){
      socket.send(JSON.stringify(json));
  }
  socket.onerror = function(error){
      console.log(error)
  }
  function peerOffer(json){
    var pc = new RTCPeerConnection(iceServer,null);
    if(stdout){
        pc.addStream(stdout); 
    }
    createDataChannel(pc,json)
    pc.createOffer(function(desc){
        pc.setLocalDescription(desc);
        socSend({ 
            "type": "peer",
            "data": {
                "sdp": desc
            },

        })
    },function(err){
        console.log(err)
    })
    pc.ondatachannel = function(event){
      console.log('333')
    }
    pc.onaddstream = function(event){
        /*var body = document.getElementsByTagName('body')[0],
        video  = document.createElement('video');
        video.id = json.name
        video.src = URL.createObjectURL(event.stream);
        video.play();
        body.appendChild(video)*/
        console.log(event)
    };
    return pc;
  }
  function peerAnswer(json){
  var pc = new RTCPeerConnection(iceServer,null);
	  if(stdout){
	      pc.addStream(stdout); 
	  }
    createDataChannel(pc,json)
	  pc.onaddstream = function(event){
	      /*var body = document.getElementsByTagName('body')[0],
	      video  = document.createElement('video');
	      video.id = json.name;
	      video.src = URL.createObjectURL(event.stream);
	      video.play();
	      body.appendChild(video);*/
        console.log(event)
	  };
	  pc.setRemoteDescription(new RTCSessionDescription(json.data.sdp));
	  pc.onicecandidate = function(event){
	      if (event.candidate !== null) {
	         socSend({
	              "type": "ice",
	              "data": {
	                  "candidate": event.candidate
	              },
	              name:json.name
	          })
	      }
	  };
	  pc.createAnswer(function(desc){
	      pc.setLocalDescription(desc);
	      socSend({
	          "type": "peer",
	          "data": {
	              "sdp": desc
	          },
	          name:json.name
	      })
	  },function(error){
	      console.log(error)
	  });
    pc.ondatachannel = function(event){
      console.log('333',event);
      var dataChannel = event.channel;
      
      dataChannel.onmessage = function(event){
        console.log(event)
      }
      dataChannel.onclose = function(event){
        console.log('close')
      }
      dataChannel.onopen = function(event){
        dataChannel.send('123');
        console.log('onopen')
      }
    }
	  return pc;
	}
  function createDataChannel(pc,json){
    var dataChannel =  pc.createDataChannel(json.name,{reliable: false});
    dataChannel.onerror = function (error) {
      console.log("Data Channel Error:", error);
    };
    dataChannel.onopen = function (event) {
      dataChannel.send('11111');
      console.log('hello world');
    };
    dataChannel.onclose = function(){
      delete dataChannelJson[this.label]
      console.log('close');
    };
    dataChannel.onbufferedamountlow = function(){
      console.log('onbufferedamountlow');
    };
    dataChannel.ordered = function(){
      console.log('ordered');
    }
    dataChannel.onmessage = function(event){
      console.log(event,2222);
    }
    dataChannelJson[json.name] = dataChannel;
  }
})