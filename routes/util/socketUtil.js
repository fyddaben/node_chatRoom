
var mond=require('./MondbUtil');
var socketIO = function (server) {
    var io = require('socket.io').listen(server);
        var callback=function(doc){
            io.on('connection', function (socket) {

                if(doc!=null){
                     for(var i in doc){
                        var obj=doc[i];
                        var id=obj.room_id;
                        var up= "contentUp"+id;
                         console.log(id);
                        socket.on(up, function (data) {

                            var idd=data[4];

                            socket.broadcast.emit("contentDown"+idd,data);
                        });
                    }
                }


            });


        };


    mond.queryTable("room_talk",{},callback);

    /*
    */
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
