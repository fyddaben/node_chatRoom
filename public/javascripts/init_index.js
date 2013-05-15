//判断屏幕尺寸,如果，尺寸大于620，加载第一个css。如果，尺寸小于620,加载第二个css

$(function(){
    var width= document.body.clientWidth;
	//console.log(width);
	//if(width>=620){
	      
	   // var d=document.getElementById('mobile_version');
	  //  d.style.display="none";
	    loadjscssfile('/stylesheets/index_pc.css','css');


            var array=[];
            array.push("pc");
            array.push(room_list);
            ChatRoom.trigger("Domload",array);



 
	/*}else{

	    var d=document.getElementById('pc_version');
	    d.style.display="none";
		loadjscssfile('http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css','css');
		loadjscssfile('http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.js','js');
	    loadjscssfile('/stylesheets/index_mobile.css','css');
	    ChatRoom.trigger("Domload","mobile");

	}*/
});

