var express = require('express'),
    app = express(),
    http = require('http').Server(app),
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

});

http.listen(3000, function(){
    console.log('listening on *:3000');
});