var express = require('express'),
	app = express(),
	http = require('http').Server(app),
    multer  = require('multer'),
	io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));


io.on('connection', function(socket){

	//Add new user
	socket.on('set user', function(usr){
		socket.user = usr;
		socket.broadcast.emit('get new user', socket.user);
	});

	//User disconnected
	socket.on('disconnect', function(){
		socket.broadcast.emit('user disconnect', socket.user);
	});

	//Send message
	socket.on('send message', function(msg){
		io.emit('get message', {
			user : socket.user,
			text : msg
		});
	});

	//Checking is another user type something
	socket.on('typing', function(){
		socket.broadcast.emit('typing', socket.user);
	});

    //check if user download the file and told this for another users
    socket.on('file download', function(file){
        io.emit('file download', {
            user : socket.user,
            file : file
        });
    });

    //get files from client
    app.post('/',[ multer({ dest: './uploads/'}), function(req, res){
        console.log(req.files); // form files
        res.status(204).end();
    }]);

});
http.listen(3000, function(){
	console.log('listening on *:3000');
});

