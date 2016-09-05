/**
 * Created by dingzhang on 9/1/16.
 */

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    users = [];
app.use('/', express.static(__dirname + '/chatroom'));


server.listen(9000);


var pg = require('pg');
var connectionString = "pg://postgres:postgres@localhost:5432/chatroom";
var pgClient = new pg.Client(connectionString);
pgClient.connect();



io.sockets.on('connection', function(socket) {
    //new user login

    socket.on('login', function(username) {
        if (users.indexOf(username) >= 0) {
            socket.emit('nameused');
        } else {
            socket.userIndex = users.length;
            socket.username = username;
            users.push(username);
            socket.emit('logedin');
            io.sockets.emit('system', username, users, 'login');
        };
    });
    //user leaves
    socket.on('disconnect', function() {
        users.splice(socket.userIndex, 1);
        socket.broadcast.emit('system', socket.username, users, 'logout');
    });
    //new message get
    socket.on('postMsg', function(msg) {
        var date = new Date().toTimeString()
        var query=pgClient.query('insert into message (name,message,ptime) values(\''+socket.username+'\',\''+msg+'\','+'\''+date+'\')');
        socket.broadcast.emit('newMsg', socket.username, msg);
    });

    //clickhistory
    socket.on('clickHis',function(){
        var query=pgClient.query('Select * from message');
        query.on("row", function (row, result) {
            result.addRow(row);
            console.log(row);
            socket.emit('showhistory', row['name'], row['message'],row['ptime']);
        });

    })


});
