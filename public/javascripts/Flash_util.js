
        var textError=function(index,IdName,className){
	
			$("#"+IdName).attr("class",className);
			
			  setTimeout("textareaOk("+index+",'"+IdName+"','"+className+"')",100);	
			
		}

		var textareaOk=function(index,IdName,className){
		    $("#"+IdName).removeClass(className);
		    index++;
		    if(index<3){
		       setTimeout("textError("+index+",'"+IdName+"','"+className+"')",100);
		    }
		}
		var execute=function(IdName,className){
		    var index=0;
	        textError(index,IdName,className);	
		}

var Flash_util={
	//闪烁特效
	flashRed:function(IdName,className){
	   /*css代码
       -moz-box-shadow: -1px -1px 10px red inset;
       box-shadow: -1px -1px 10px red inset;
       */
       execute(IdName,className);
	},
	//Handlerbars的工具函数
	Handle_equal:function(){
        
        if(Handlebars){
             Handlebars.registerHelper('ifCond', function(v1, v2, options) {
			  if(v1 == v2) {
			    return options.fn(this);
			  }
			  return options.inverse(this);
			});
        }
	}

}