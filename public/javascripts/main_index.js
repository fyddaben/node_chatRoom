
 var ChatRoom=Model.create();

 var chatRoom=function(room_list){
       this.room_list=room_list;
       this.ChatRoom=ChatRoom;
       this.ChatRoom.attributes=["room_id","room_name","roomhead_imgs","roombackimg"];
 }
 chatRoom.prototype.records=function(){

		 for(var i in this.room_list){

		       var room_unit=this.ChatRoom.init(this.room_list[i]);

		 	   room_unit.save();

		 }
         
         var rec={
         	records:[]
         };
         var index=0;
         
         for(var i in this.ChatRoom.records){
         	   var reObj=this.ChatRoom.records[i].attributes();
         	   if(index%3==0){
         	   	   reObj.a='true';
         	   }else if(index%3==1){
                   reObj.b='true';
         	   } else if(index%3==2){
         	   	   reObj.c='true';
         	   }
         	   rec.records.push(reObj);
         	index++;
         }
		 return rec;

   }
 ChatRoom.bind("Domload",function(array){
       var flag=array[0];

       var data=array[1];

       var ch_Room=new chatRoom(data);
       
       var rec=ch_Room.records();

       //handlerbar模板，首先拿到模板
       var source=null;
       if(flag=='pc'){
          source = $("#pc-template").html();	


       }else if(flag=='mobile'){
       	  source = $("#mobile-template").html();	
       }
        
           //把模板解析
       var template = Handlebars.compile(source);

       var html   = template(rec);
       if(flag=='mobile'){

       	$("#pcContent").append(html);
       	$("#pcContent").trigger("create");
       	return;
       }
       $("#pContent").append(html);

 });
 

 