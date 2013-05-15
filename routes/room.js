
/*
 * GET home page.
 */
var assert= require('assert');

var mdu=require('./util/MondbUtil');
exports.add = function(req, res){

  	var roomname=req.body.room_name;

    var head_imgs=req.body.head_imgs;

    var back_img=req.body.back_img;

    var Str_head=[];
    if(head_imgs instanceof  Array){
        Str_head=head_imgs;
    }else{
        Str_head.push(head_imgs);
    }


    var callback=function(){
        res.send("插入成功");
    }
    //定义插入数据库的方法
    var insertTable=function(id){

        var sql={
                 room_id:id,
                 room_name:roomname,
                 roomhead_imgs:Str_head,
                 roombackimg:back_img
                   };

        mdu.tableAdd("room_talk",sql,callback);

    };
     mdu.getNextSequence("room_talk",insertTable);
};
var soc=require('./util/socketUtil');
exports.get=function(req,res){
     var sql={};
     var callback=function(doc){
        // soc.fn.trigger('news',doc);
         var str=JSON.stringify(doc);
         res.render("index",{data:str});
     };
      mdu.queryTable('room_talk',sql,callback);

};
//通过聊天室ID，获得聊天室的信息
exports.getById=function(req,res){

      var id=req.params.id;

      var idd=parseInt(id);

      var sql={"room_id":idd};

      var callback=function(doc){
          var str=JSON.stringify(doc);

          res.render("chatRoom",{data:str});
      }
      mdu.queryTable("room_talk",sql,callback);

}
exports.tableupate=function(req,res){
    var roomname=req.body.room_name;

    var head_imgs=req.body.head_imgs;

    var back_img=req.body.back_img;

    var room_id=req.body.room_id;

    var rid=parseInt(room_id);
    var Str_head=[];
    if(head_imgs instanceof  Array){
        Str_head=head_imgs;
    }else{
        Str_head.push(head_imgs);
    }
    var querySql={
        room_id:rid
    };

    var callback=function(){
        res.send("修改成功");
    }
    var updateTable=function(id){

        var sql={
            room_id:id,
            room_name:roomname,
            roomhead_imgs:Str_head,
            roombackimg:back_img
        };



        mdu.tableUpdate("room_talk",querySql,sql,callback);

    };
    mdu.getNextSequence("room_talk",updateTable);
}