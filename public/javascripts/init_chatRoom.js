//判断屏幕尺寸,如果，尺寸大于620，加载第一个css。如果，尺寸小于620,加载第二个css


$(function(){
	  var width=document.body.clientWidth;
   // if(width>=620){
      
   // var d=document.getElementById('mobile_version');
  //  d.style.display="none";
   // loadjscssfile('/stylesheets/chatRoom_pc.css','css');
	  
    //先要隐藏输入框
    $("#fixed").hide();
    //隐藏登录框
    $("#login_frame").hide();

        var id=room_list[0].room_id;

        $.get("/content/"+id+"/1/20",function(data){


            main_chatRoom.trigger("DomLoad",data);

        });



	  


	/*}else{
	    var d=document.getElementById('pc_version');
	    d.style.display="none";
		
	    loadjscssfile('/stylesheets/chatRoom_mobile.css','css');
	    
	}*/
})



