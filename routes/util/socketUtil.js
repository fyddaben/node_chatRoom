
var mond=require('./MondbUtil');
var socketIO = function (server) {
    var io = require('socket.io').listen(server);
    var onlinePer=new Array();

            io.on('connection', function (socket) {
                        var up= "contentUp";
                        socket.on(up, function (data) {

                            var idd=data[3];
                            socket.broadcast.emit("contentDown"+idd,data);
                        });
                        //房间连接，并穿过来用户名

                        socket.emit('initConnect',onlinePer);

                         socket.on("ServerConnect",function(data){
                              //链接上一个用户，+1

                             socket.userName=data;


                             for(var i in onlinePer){
                                 if(data==onlinePer[i]){
                                     return ;
                                 }
                             }
                             onlinePer.push(data);

                             socket.emit('initConnect',onlinePer);
                             socket.broadcast.emit('initConnect',onlinePer);

                         });

                         socket.on('disconnect', function()
                         {
                             var username= socket.userName;
                             for(var i in onlinePer){
                                 if(username==onlinePer[i]){
                                     onlinePer.splice(i,1);
                                 }
                             }

                             socket.broadcast.emit('initConnect',onlinePer);
                         });

            });

};

socketIO.prototype = {
    //定义触发事件
    trigger: function (Eventname1,Eventname2) {


    }
};

var util = {
    init: function (io) {
        this.fn = new socketIO(io);

    }
};
module.exports = util;
