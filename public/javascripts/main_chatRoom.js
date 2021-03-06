//内容数据列
var yell_list=null;
 /*ar yell_list=[
   {
   	"user":
           {
           	"HeadUrl":"http://127.0.0.1:3001/images/psv_assassin.png",
            "username":"fyddaben"
          },
    "content":"用户你好",
    "create_time":"2013-05-05 12:00:00",
    "chatRoom":{
    	       "name":"308",
    	       "id":"1"
           }
    }
 ];*/

var  main_chatRoom={
        init:function(contList){
             //首先把内容赋值到指定对象中
             this.contList=contList;
             //创建操作类，并初始化存储空间
             this.confObj=Model.create();
             //属性值
             this.confObj.attributes=["user","content","create_time","room_id"];
            
             //这里假设当前用户名为
             this.curUser="robot2";
             this.curUserImg="http://127.0.0.1:3001/images/mgs.png";
             //定义当前聊天室的信息
             this.roomName="308";
             this.roomNum="1";
             //定义数据存储空间

             this.records=[];
             
             for(var i in this.contList){
                 
                 var newConf=this.confObj.init(this.contList[i]);
                
                 newConf.save();

             }

           var allrec=this.confObj.records;
           
           for(var i  in allrec){
               //这里要判断是否为当前用户所发的内容
               var attr=allrec[i].attributes();
               var uname=attr.user.username;
               if(uname==this.curUser){
                    attr.isCurUser=true;
               }else{
                    attr.isCurUser=false;
               }
               this.records.push(attr);
           }

        },
        save:function(Obj){

               this.records.push(Obj);

        },
        updateData:function(conlist){
            for(var i in conlist){

                var newConf=this.confObj.init(conlist[i]);

                newConf.save();

            }

            var allrec=this.confObj.records;

            this.records=[];

            for(var i  in allrec){
                //这里要判断是否为当前用户所发的内容
                var attr=allrec[i].attributes();
                var uname=attr.user.username;

                if(uname==this.curUser){
                    attr.isCurUser=true;
                }else{
                    attr.isCurUser=false;
                }
                this.records.push(attr);
            }



        },
        updateUserFlag:function(){
            for(var i in this.records){
                var obj=this.records[i];
                var uname=obj.user.username;
                if(uname==this.curUser){
                    this.records[i].isCurUser=true;
                }else{
                    this.records[i].isCurUser=false;
                }
            }
        },
        getRecords:function(){
        	return this.records;
        },
        bind:function(name,fun){
        	this.confObj.bind(name,fun);
        },
        trigger:function(name,arg){

        	this.confObj.trigger(name,arg);

        }
};


//执行主函数
(function(){

         main_chatRoom.init(yell_list);



         var records=main_chatRoom.getRecords();



         //定义DOMLOAD完成后，执行的函数内容
         var domloadfun=function(loadList){

              //首先要检查是否含有用户名,否则，要先登录
              //通过local.storage中查询是否含有用户名和头像数据.没有则要求登录
               var username=localStorage.getItem("username");
               var headimg=localStorage.getItem("headImg");
                 if(loadList){
                     main_chatRoom.updateData(loadList);
                 }
               if(username!=null&&headimg!=null){

                   $("#login_frame").fadeOut(100,function(){
                       $("#login_frame").attr("display","none");
                   });
                   $("#ChangeHead_frame").hide();

                   $("#user_headImg").attr("src",headimg);
                   $("#user_headImg").attr("title",username);
                   main_chatRoom.curUserImg=headimg;
                   main_chatRoom.curUser=username;

                   main_chatRoom.updateUserFlag();
                  socket.emit("ServerConnect",username);
               }else{
                   main_chatRoom.trigger("loadHead_login",ImgList);
                   $("#login_frame").show();
                   $("#ChangeHead_frame").hide();

                   return false;
               }


              var rec=main_chatRoom;

              var source = $("#pc-template").html();	
              //把模板解析
              var template = Handlebars.compile(source);

              var html   = template(rec);
              
              
             $("#pc_showPanel").append(html);
             window.scrollTo(0,document.body.scrollHeight);
             $("#fixed").show();

         };
         //定义信息添加的时候，执行的函数内容
         var  infoAddfun=function(contents){
         	 
            var str= {
                       user:
                           {
                            HeadUrl:main_chatRoom.curUserImg,
                            username:main_chatRoom.curUser
                           },
                    content:contents,
                    create_time:"2013-05-05 09:00:00",//随便写，服务端进行改变
                    chatRoom:{
                             name:main_chatRoom.roomName,
                             id:main_chatRoom.roomNum
                           },
                    isCurUser:true

                    };
          //放入存储空间
          main_chatRoom.save(str);
          
          var recordsFak={
              records:[
                 str
              ]
          }
          //利用模板得到html代码
              var source = $("#pc-template").html(); 
              //把模板解析
              var template = Handlebars.compile(source);

              var html   = template(recordsFak);
             
              $("#pc_showPanel").append(html);
         	    
              
         };
    //定义信息添加的时候，执行的函数内容
    var  OtherinfoAddfun=function(array){
        var userImg=  array[0];

        var username=  array[1];

        var contents=  array[2];

        var str= {
            user:
            {
                HeadUrl:userImg,
                username:username
            },
            content:contents,
            create_time:"2013-05-05 09:00:00",//随便写，服务端进行改变
            chatRoom:{
                name:main_chatRoom.roomName,
                id:main_chatRoom.roomNum
            },
            isCurUser:false

        };
        //放入存储空间
        main_chatRoom.save(str);

        var recordsFak={
            records:[
                str
            ]
        }
        //利用模板得到html代码
        var source = $("#pc-template").html();
        //把模板解析
        var template = Handlebars.compile(source);

        var html   = template(recordsFak);

        $("#pc_showPanel").append(html);


    };

      //加载登陆框的选择头像信息
       var   loadHead_flag=0;
       var loadHead_login=function(imglist){
           loadHead_flag++;
           if(loadHead_flag==1){
               var source = $("#HeadImg-template").html();
               //把模板解析
               var template = Handlebars.compile(source);

               var html   = template(imglist);

               $("#head_pos").append(html);
               main_chatRoom.trigger("clickCpic");
           }

       };
    //加载选择头像的信息
       var   loadHead_choose_flag=0;
       var loadHead_choose=function(imglist){
           loadHead_choose_flag++;
           if(loadHead_choose_flag==1){
               var source2 = $("#ChangeHeadImg-template").html();
               //把模板解析
               var template2 = Handlebars.compile(source2);

               var html2   = template2(imglist);


               $("#ChangeHead_pos").append(html2);
               main_chatRoom.trigger("clickCpic");
           }

       }
    // 记录一个点击图片切换焦点的事件

      var clickCpic=function(){
          $(".img_sel").click(function(){

              var val=$(this).attr("val");

              var doc=document.getElementById(val);
              $("input[type='radio']").removeAttr("checked");

              doc.checked='true';
          });
      }

     //在线人数改变的时候
      var onlineDom=function(data){

          var onlineer={
              count:data.length,
              username:data

          }
          var source2 = $("#online-template").html();
          //把模板解析
          var template2 = Handlebars.compile(source2);

          var html2   = template2(onlineer);

          $("#online_userDom").html(html2);

      }
         main_chatRoom.bind("DomLoad",domloadfun);

         main_chatRoom.bind("InfoAdd",infoAddfun);

         main_chatRoom.bind("OtherInfoAdd",OtherinfoAddfun);

         main_chatRoom.bind("loadHead_login",loadHead_login);

         main_chatRoom.bind("loadHead_choose",loadHead_choose);

         main_chatRoom.bind("clickCpic",clickCpic);

         main_chatRoom.bind("onlineDom",onlineDom) ;
})();
         
        
       
