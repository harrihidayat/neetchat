var express = require('express');
var app  = express();
var http = require('http').Server(app);
var io   = require('socket.io')(http);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');	
});

var users 	  = {};
var usernames = [];

io.on('connection', function(socket){

	

	//ketika ada user yang daftar
	socket.on('registerUser', function(username){
		if(usernames.indexOf(username) != -1){
			socket.emit('registerRespond', false);
		} else {
			users[socket.id] = username;
			//respon ketika ada  user
			socket.broadcast.emit('newMessage', 'BROADCAST: ada orang baru masuk!');
			usernames.push(username);
			socket.emit('registerRespond', true);
			io.emit('addOnlineUsers', usernames);

			
		}
	});

	//kalo ada message baru
	socket.on('newMessage', function(msg){
		io.emit('newMessage', msg);
		console.log('chat baru: ' + msg);
	});

	//kalo ada yang mengetik pesan
	socket.on('newTyping', function(msg){
		io.emit('newTyping', msg);
	});

	//kalo ada user disconnect
	socket.on('disconnect', function(msg){
		socket.broadcast.emit('newMessage', 'BROADCAST: ada orang yang keluar!');

		var index = usernames.indexOf(users[socket.id]);
		usernames.splice(index, 1);

		delete users[socket.id];

		io.emit('addOnlineUsers', usernames);
	});

});

http.listen(app.get('port'), function(){
	console.log('Node app is running on port', app.get('port'));
});