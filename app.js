var fs = require("fs");
var http = require("http");
var log = require("sklog");
var express = require("express");
var autotask = require("./autotask")("https://webservices5.autotask.net/ATServices/1.5/atws.asmx");

var app = express();
var server = http.createServer(app);

server.listen(4001);
var io = require("socket.io").listen(server,{"log level":0});

app.configure(function(){
	app.use(express.static(__dirname + "/static"));
	app.use(express.errorHandler());
	app.use(express.cookieParser());
	app.use(express.session({"secret":"rainmanCanC0uN7","userid":-1}));
	app.use(express.bodyParser());
	app.set("view options", {layout:0});	
});

app.get("/",function(r,q){q.redirect("/home.htm");});

io.sockets.on("connection",function(sock){
	sock._attkdata = {};

	sock.on("checkcreds",function(data){
		log(autotask.getEntityInfo.resource("tonyod@paccoast.com"));
	});
});
