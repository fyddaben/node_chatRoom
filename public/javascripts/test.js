var tval="buy";
var DataCache=function(List){
         
         this.list=List;

         this.conObject=Model.create();
 
};

DataCache.prototype={
          init:function(){
               
               for(var i in this.list){

                  var obj=this.conObject.init(this.list[i]); 
                  obj.save();

               }
               
               this.records=[];

               this.records=this.conObject.records;

          },
          //遍历得到所有对象的最小值
          getSmallestVal:function(){
               var smallest=0;
               var flag=0;
               for(var i in this.records){
                   var obj=this.records[i][tval];
                     if(flag==0){
                         smallest= obj;
                     }
                    if(obj<smallest){
                        smallest=obj;
                    }
                   flag++;
               }
              return smallest;
          },
         //遍历得到所有对象的最大值
         getBiggestVal:function(){
              var bigest=0;
              var flag=0;
              for(var i in this.records){

                  var obj=this.records[i][tval];
                  if(flag==0){
                      bigest= obj;
                  }
                  if(obj>bigest){
                      bigest=obj;
                  }
                  flag++;
              }
             return bigest;
         },  //绑定事件
         bind:function(ev,callback){
                  //  console.log("bind");
             this.conObject.bind(ev,callback);

         },  //触发事件
         trigger:function(ev,args){
              this.conObject.trigger(ev,args);
         }


}

var drawTool=function(){
       this.dTool=document.getElementById("myCanvas").getContext("2d");
       //设定是画的图是买入价

}
drawTool.prototype={
          //画背景表格
         drawBackForm:function(){
             this.dTool.beginPath();
             //先画外面的正方形
              this.dTool.lineWidth=0.5;
             this.dTool.strokeStyle="#ccc";
             this.dTool.strokeRect(0,0,720,290);
             //然后画表格
             this.dTool.lineWidth=1;
             this.dTool.strokeStyle="rgb(218, 0, 233)";
             
             //画x方向的线
             for(var i=1;i<=9;i++){

                 this.dTool.moveTo(0,20+30*(i-1));
                 this.dTool.lineTo(720,20+30*(i-1));
               
             }
             //画y方向的线 
             for(var i=1;i<=11;i++){
                 this.dTool.moveTo(60*i,20);
                 this.dTool.lineTo(60*i,290);
             }


             this.dTool.stroke();

             this.dTool.closePath();

         },
         //画x轴方向刻度
         drawXk:function(){
             
               this.dTool.beginPath();

               this.dTool.font="5px Arial bold";
               
               for(var i=1;i<=11;i++){
                     
                     var sl=i*2;
                     var text=null;

                     if(sl<12){
                        text=sl+":00 AM";
                     }else
                     if(sl==12){
                         text=sl+":00 PM";
                     }else 
                     if(sl>12){

                        text=(sl-12)+":00 PM";
                     }
                    
                     
                     this.dTool.fillText(text,60*i-10,300);     
               }
               //数据每分钟的，所以最小单位的长度为
              this.unitX=720/24/60;

               this.dTool.closePath();
         },
         //写左上角的当前时间和标题
         drawTitle:function(val){
                this.dTool.beginPath();

                this.dTool.clearRect(0,0,100,20);
                this.dTool.font="5px Arial bold ";
                this.dTool.fillStyle="#000";
                var text=val+"    :";

               
                this.dTool.fillText(text,0,15); 

                this.dTool.closePath();
         },
         //写行情报价数据
         drawDataHq:function(val){
                this.dTool.beginPath();

                this.dTool.font="5px Arial bold";
                
                var text="USD/CHF=X "+val;

                this.dTool.clearRect(100,0,220,20);
                this.dTool.font="5px Arial bold ";
                this.dTool.fillStyle="#000";
                this.dTool.fillText(text,100,15); 

                this.dTool.closePath(); 
         },
        //画数据之前，首先要初始化数据存储空间
        initDataCache:function(list){
            var dc=new DataCache(list);
            this.dataCache=dc;
            this.dataCache.init();
            this.records=this.dataCache.records;

        },
         //画y轴的刻度，假设小数点后5位
        drawYk:function(){
            var n=5;
            var bigest=this.dataCache.getBiggestVal();
            var smallest=this.dataCache.getSmallestVal();
            var bg=parseFloat(bigest);
            var sm=parseFloat(smallest);
            var bs=bg-sm;
            var unitB=(bs/7).toFixed(n+1);
            this.dTool.beginPath();

            this.dTool.font="5px Arial bold";
            for(var i =0;i<8;i++){
                var text=(sm+i*unitB).toFixed(n);
                var x=720;
                var y=290-(i+1)*30;
                this.dTool.fillText(text,x,y);
            }
            this.dTool.closePath();


        },
         //输入分钟数，得到x轴的点的值
        getXbymin:function(min){
             return min*this.unitX;
        },
        //输入最高点的值，得到y轴的实际值
        getYbyVal:function(val){
            var bigest=this.dataCache.getBiggestVal();
            var smallest=this.dataCache.getSmallestVal();
            var bg=parseFloat(bigest);
            var sm=parseFloat(smallest);
            var bs=bg-sm;
            var ks=val-sm;
            var spce=Math.round(210*ks/bs);//占用的y轴的长度
            var y=290-30-spce;
            return y;
        },
         //输入x轴的数据，得到实际的分钟数
        getMinbyX:function(x){
            return x/this.unitX;
        },
        //输入标准时间例如,1990-09-09 09:09:09返回，距离0点有多少分钟
        getMinsUtilZero:function(time){
            var hour=parseInt(time.substring(11,13));

            var min=parseInt(time.substring(14,16));

            var unitXCm=hour*60+min;

            return unitXCm;
        },
        //把所有的点连接起来
        drawPic:function(){
            this.dTool.beginPath();
            this.dTool.lineWidth=0.5;

            this.dTool.strokeStyle="#000";
            var flag=0;


            var lastx=0;
            var lasty=0;
            var firsty=0;
            for(var i in this.records){
                     var time=this.records[i].dataTime;

                     var timeval=this.getMinsUtilZero(time);

                     var x=this.getXbymin(timeval);

                     var val=this.records[i][tval];

                     var y=this.getYbyVal(val);



                     if(flag==0){
                         this.dTool.moveTo(x,y);
                         lastx=x;
                         lasty=y;
                     }else{
                         this.dTool.lineTo(x,y);
                     }
                     flag++;

            }
            var length=flag;
             console.log(length);
            var index=0;
              for(var i in this.records){
                  var time=this.records[i].dataTime;

                  var timeval=this.getMinsUtilZero(time);

                  var x=this.getXbymin(timeval);

                  var val=this.records[i][tval];

                  var y=this.getYbyVal(val);
                      index++;
                   if(index==length){

                       firsty=y;
                   }
              }

            this.dTool.stroke();
            this.dTool.fillStyle="rgb(164,209,228)";
            this.dTool.strokeStyle="rgb(164,209,228)";
            console.log(lastx+":"+lasty);
            this.dTool.moveTo(lastx,lasty);
            this.dTool.lineTo(lastx,290);
            this.dTool.lineTo(0,290);
            this.dTool.lineTo(0,firsty);
             this.dTool.fill();




            this.dTool.closePath();
        }
}

var main=function(){
    var da=new drawTool();
    this.draw=da;
    this.draw.drawBackForm();

    this.draw.drawTitle("12:02 PM");
    this.draw.drawDataHq("1.0526");





};
main.prototype={
       init:function(){
           var d=new Date();
           var years = d.getYear()+1900;
           var month = add_zero(d.getMonth()+1);
           var days = add_zero(d.getDate())
           var daytime=years+"-"+month+"-"+days;
           var filename="http://pc.169gold.com/ajax/queryData!queryFailyWh?piecename=USD/CHF&starttime="+daytime+"%2000:00:00&endtime="+daytime+"%2023:59:59&rowCount=5000";
           var das=this.draw;
           $.getScript(filename,function(){
               das.initDataCache(data.list);
               das.drawXk();
               das.drawYk();
               das.drawPic();
                       das.drawBackForm();
               das.dataCache.bind("mouseStar",mouseStar);
           });
           //定义鼠标触发画十字星的事件,x为x轴的距离，y为y轴的距离
           var mouseStar=function(x){

               var Xmin=das.getMinbyX(x);
               var yVal=0;
               for(var i in das.records){
                   var time=das.records[i].dataTime;

                   var timeval=das.getMinsUtilZero(time);

                   if(timeval==Xmin){
                       yVal=das.records[i][tval];

                   }
               }
               var y=das.getYbyVal(yVal);

               var hour=parseInt(Xmin/60);//得到几个小时

               var min=Xmin-60*hour;

               var hourStr=hour;
               var Am=false;
               if(hour>12){
                   hour=hour-12;
                   Am=true;
               }else{
                   Am=false;
               }
               if(hour<10){
                   hourStr="0"+hour;
               }
                var mins=''+min;
               if(min<10){
                     mins="0"+min;
               }
               var times="";
               if(Am){
                   times=hourStr+":"+mins+" PM";
               }else{
                   times=hourStr+":"+mins+" AM";
               }

               das.drawTitle(times);

               das.drawDataHq(yVal);
               $(".xline").css("margin-top",y);
               $(".yline").css("margin-left",x);

           }

       },
       loadData:function(data){
           this.draw.initDataCache(data.list);
           this.draw.drawYk();
           this.draw.drawPic();
       }

};
function add_zero(temp)
{
    if(temp<10) return "0"+temp;
    else return temp;
}

$(function(){
        var mai=new main();
        mai.init();
      $("#myCanvas").mousemove(function(e) {

          var xCan=event.pageX;

          var yCan=event.pageY;
          if(xCan>0&&xCan<720&&yCan>0&&yCan<290){


                mai.draw.dataCache.trigger("mouseStar",xCan);

          }

      });

});
