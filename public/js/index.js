$(function(){
	$(document).on('keypress','input[type="text"]',function(event) {
	  if(event.keyCode == 13){
	  	event.preventDefault();
	  	if($(event.target).parents('.createName')){
	  		$('#subName').click();
	  	}else{
	  		$('#subRoom').click();
	  	}
	  
	  }
	});
	$('#subName').click(function(event){
		event.preventDefault();
		var createName = $(this).parents('.createName'),
		name = createName.find('input[name="name"]').val(),
		nick = createName.find('input[name="nick"]').val();
		createName.modal('hide');
		$.ajax({
			type:'post',
			url:'/',
			dataType:'json',
			data:{
				name:name,
				nick:nick
			},
			success:function(data){
				if(data.state == -1){
					modalAlert(data.msg);
				}else{
					$('.username').text(nick);
					$('.username').parent('a').removeAttr('data-target').removeAttr('data-toggle');
				}
			}
		}) 
	})
	$('#subRoom').click(function(event){
		event.preventDefault();
		var createRoom = $(this).parents('.createRoom'),
				roomName = createRoom.find('input[name="roomName"]').val(),
				roomNubmer = createRoom.find('input[name="roomNubmer"]').val(),
				roomType =  createRoom.find('select[name="roomType"]').val();
		createRoom.modal('hide');
		$.ajax({
			type:'post',
			url:'/createRoom',
			dataType:'json',
			data:{
				roomName: roomName,
				roomNubmer: roomNubmer,
				roomType: roomType
			},
			success:function(data){
				if(data.state == -1){
					modalAlert(data.msg);
				}else {
					if(roomType == "1"){
						window.location.href = '/chat.html#'+roomNubmer;
					}else{
						window.location.href = '/live.html#'+roomNubmer;
					}
				}
			}
		}) 
	})
	$('.panel-default').click(function(event){
		var room = $(this).find('.roomId').text(),
				roomType = $(this).find('[roomType]').attr('roomType');
		if(roomType == 1){
			window.location.href = '/chat.html#'+room;
		}else{
			window.location.href = '/live.html#'+room;
		}
	})
})