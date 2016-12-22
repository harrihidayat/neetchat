var socket = io();
var username = '';

$('#nama_user').focus();

$('#kirim').on('click', function(){
	socket.emit('newMessage', username + ': ' +$('#text_box').val());
	$('#text_box').val('');
	isTyping = false;
	return false;
	$('#kirim').focus();
});

$('#text_box').bind("enterKey",function(e){
   socket.emit('newMessage', username + ': ' +$('#text_box').val());
	$('#text_box').val('');
	isTyping = false;
	return false;
	$('#kirim').focus();
});


//daftar user
socket.on('addOnlineUsers', function(usernames){
	$('#user_lists').empty();

	for(var i=0; i<usernames.length; i++){
		$('#user_lists').prepend($('<li class="media" id="user_' + usernames[i] + '">')
						.append($('<div class="media-body">')
							.append($('<div class="media">')
								.append($('<img class="media-object img-circle pull-left" style="max-height:40px;" src="img/user.png" />'))
								.append($('<h5>').text(usernames[i])
								.append($('<h5><small class="text-muted"> Online Sejak'+ $.format.date(new Date(), ' d-MMMM-yyyy') +'</small>'))))));
	}
});

//untuk nampilin di frontend
socket.on('newMessage', function(msg){
	$('#messages').prepend($('<li class="media">')
				  .append($('<div class="media-body">')
				  .append($('<img class="pull-left" class="media-object img-circle " src="img/user.png" />'))
				  .append($('<div class="media-body" >')
				  .text(msg)
				  .append($('<br /><br />'))
				  .append($('<small class="text-muted">'+ $.format.date(new Date(), ' d-MMMM-yyyy ~ h:mm:ss - a') +'</small>')
				  .append($('<hr />'))))));
	$('.tempchat').remove();
});

//ketika user daftar nama -> masuk ke chatroom
$('#submit_name').click(function(){
	//validasi apakah nama sudah ada apa belum
	if($('#nama_user') != ''){
		//menguji nama exist atau belum
		username = $('#nama_user').val();
		socket.emit('registerUser', username);
	}
});

$('#nama_user').keyup(function(e){
    if(e.keyCode == 13)
    {
        $(this).trigger("masuk");
    }
});

$('#nama_user').bind("masuk",function(e){
   //validasi apakah nama sudah ada apa belum
	if($('#nama_user') != ''){
		//menguji nama exist atau belum
		username = $('#nama_user').val();
		socket.emit('registerUser', username);
	}
});



//menerima respon dari server saat register
socket.on('registerRespond', function(status) {
	if (status == false) {
		swal(
		  'Wadoh...',
		  'Nama itu udah kepake cok, ganti aja!',
		  'error'
		)
		$('#nama_user').focus();
	} else {
		$('#chatroom').removeClass('hidden');
		$('#homepage').addClass('hidden');
		$('#text_box').focus();
	}
});

//ketika user mengetik
var isTyping = false;
$('#text_box').keyup(function(e){
	if(isTyping == false) {
		socket.emit('newTyping', username + ' sedang mengetik..');
	}
	isTyping = true;

	if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});

socket.on('newTyping', function(msg){
	$('#messages').prepend($('<li class="tempchat">').text(msg));
});

//ketika user daftar nama -> masuk ke chatroom
$('#keluar').click(function(){
		socket.emit('disconnect', msg);
});
