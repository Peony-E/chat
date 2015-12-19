/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2015-12-18 09:06:52
 * @version $Id$
 */

/*var http = require('http'),
	server = http.createServer(function(req,res){
		res.writeHead(200,{
			'Content-Type' : 'text/html'
		});
		res.write('<h1>hello!</h1>');
		res.end();
	});
server.listen(80);
console.log('Server started')*/

var express = require('express'),//引入express模块
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = [];
app.use('/',express.static(__dirname+'/'));//指定静态HTML文件的位置
server.listen(80);
console.log('Server started')

// socket部分
io.sockets.on('connection',function(socket){
	socket.on('login',function(nickname){
		if(users.indexOf(nickname)>-1){
			socket.emit('nickExisted')
		}else{
			socket.userIndex=users.length;
			socket.nickname=nickname;
			users.push(nickname);
			socket.emit('loginSuccess');
			io.sockets.emit('system',nickname,users.length,'login');
		}
	});

	socket.on('disconnect',function(){
		users.splice(socket.userIndex,1);
		socket.broadcast.emit('system',socket.nickname,users.length,'logout');
	});

	socket.on('postMsg',function(msg){
		socket.broadcast.emit('newMsg',socket.nickname,msg);
	});

	socket.on('img',function(imgData){
		socket.broadcast.emit('newImg',socket.nickname,imgData);
	})
});