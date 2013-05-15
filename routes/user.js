
/*
 * GET users listing.
 */
var mdu=require('./util/MondbUtil');
var cons=require('./util/Constant');

exports.add=function(req,res){

    var username=req.body.username;
    var head_img=req.body.headImg;


    //定义插入数据库的方法
    var insertTable=function(id){

        var sql={
            user_id:id,
            user_name:username,
            userHead_Imgs:head_img

        };
         var callback=function(){
             console.log("插入成功");
         };
        mdu.tableAdd("room_user",sql,callback);

    };
    mdu.getNextSequence("room_user",insertTable);
};
//查询用户名重复
exports.checkUsername=function(req,res){

    var username=req.body.username;

    var sql={
        user_name:username
    };
    var callback=function(doc){
            if(doc.length==0){
                res.send("200");
            }else{
                res.send("400");
            }
    };
    mdu.queryTable("room_user",sql,callback);

};
//修改用户头像-----????
//谈话内容插入数据库
exports.contentAdd=function(req,res){

    var username=req.body.username;

    var imgHead=req.body.userImg;

    var creatime=cons.currentDate();

    var content=req.body.content;

    var chatRoomid=req.body.roomId;

    var tablename="room_talkContent";

    var sql={
           user:{
                 HeadUrl:imgHead,
                 username:username
           },
           content:content,
           create_time:creatime,
           room_id:chatRoomid
      };
     var callback=function(){
         console.log("信息插入成功");
     }

    mdu.tableAdd(tablename,sql,callback);

}
//从聊天数据库中查询数据
exports.getContent=function(req,res){

    var rowcount=req.params[2];

    var ipage=req.params[1];

    var roomid=req.params[0];

    var callback=function(data){

        res.send(data);
    }
    var row=0;
    if(rowcount==null){
        row=20;
    }else{
        row=parseInt(rowcount);
    }
    var ip=0;
    if(ipage==null){
        ip=1;
    }else{
        ip=parseInt(ipage);
    }
    var options={
        "limit": row,
        "skip": (ip-1)*row,
        "sort":[['create_time','asc']]
    }
    mdu.queryTabelByPage("room_talkContent",{room_id:roomid},callback,options);

}