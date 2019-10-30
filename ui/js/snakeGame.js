//获取map这个对象
var map=document.querySelector(".map");
//由于要在外部调用函数，所以使用自调用使局部变为全局
//自调用函数——食物的构造函数
(function (){
   var elements=[];//用于存储小方块
   //自定义构造函数，创建food这个对象——
   function Food(width,height,color){
       this.width=width||20;
       this.height=height||20;
       this.color=color;
       this.x=0;
       this.y=0;
   }
    window.Food=Food;
   //为原型对象添加方法——初始化食物的位置及显示效果
   Food.prototype.init=function (map){
       //先清除小方块
       remove();
        //创建并添加小方块对象
       var div=document.createElement("div");
       div.style.position="absolute";
       div.style.width=this.width+"px";
       div.style.height=this.height+"px";
       div.style.backgroundColor=this.color;
       //x  y为随机数
       this.x=parseInt(Math.random()*(map.offsetWidth/this.width))*this.width;
       this.y=parseInt(Math.random()*(map.offsetHeight/this.height))*this.height;
       div.style.left=this.x+"px";
       div.style.top=this.y+"px";
       //把这个小方块添加到map中
       map.appendChild(div);
       elements.push(div);
   };
   //私有函数——写一个用于删除小方块的函数——既删除map中的也删除数组中的
   function remove(){
       for(var i=0;i<elements.length;i++){
           //一个小方块对象
           var ele=elements[i];
           //根据小方块对象找到map,并删除map中的小方块
           ele.parentNode.removeChild(ele);
           //再删除数组中的小方块对象
               elements.splice(i,1);
           }
       }
   })();
   //自调用函数——蛇的构造函数
(function (){
    //数组用于存储蛇的信息
    var elements=[];
    function Snake(width,height,direction){
        this.width=width||20;
        this.height=height||20;
        //蛇的初始位置
        this.body=[
        {x:3,y:2,color:"red"},
        {x:2,y:2,color:"orange"},
        {x:1,y:2,color:"orange"}
        ];
        //蛇的方向
        this.direction=direction||"right";
    }
    //设置初始化的位置及状态
    Snake.prototype.init=function (map){
        //清除之前的蛇
        remove();
      //循环遍历数组
      for(var i=0;i<this.body.length;i++){
          var obj=this.body[i];
          //创建一个蛇的部分的对象
          var div=document.createElement("div");
          div.style.position="absolute";
          div.style.width=this.width+"px";
          div.style.height=this.height+"px";
          div.style.backgroundColor=obj.color;
          div.style.left=obj.x*this.width+"px";
          div.style.top=obj.y*this.height+"px";
          map.appendChild(div);
          //把这个对象加入到数组中——为了后面用于删除
          elements.push(div);
      }
    };
    //为原型添加方法——小蛇动起来
    Snake.prototype.move=function (food,map){
      //倒循环——一次从头开始，把头的坐标给它后面的一个
        //改变蛇身体的坐标
      var i=this.body.length-1;
      for(;i>0;i--){
          this.body[i].x=this.body[i-1].x;
          this.body[i].y=this.body[i-1].y;
      }
      //判断方向，改变蛇头的位置
        switch(this.direction){
            case "right":this.body[0].x+=1;break;
            case "left":this.body[0].x-=1;break;
            case "top":this.body[0].y-=1;break;
            case "bottom":this.body[0].y+=1;break;
        }
        //判断小蛇的头部坐标是否与食物一样
        var headX=this.body[0].x*this.width;
        var headY=this.body[0].y*this.height;
        if(headX==food.x&&headY==food.y){
            //第一步——食物消失，重新出现一个新的食物
            food.init(map);
            //第二步——小蛇的尾巴加长——即复制了一份尾巴加到小蛇上
                var snakeLast=this.body[this.body.length-1];
                this.body.push({
                    x:snakeLast.x,
                    y:snakeLast.y,
                    color:snakeLast.color,
                })
            }
 
        };
        function remove(){
            //获取数组
        var i=elements.length-1;
        for(;i>=0;i--){
            var ele=elements[i];
            ele.parentNode.removeChild(ele);
            elements.splice(i,1);
        }
    }
    window.Snake=Snake;
})();
//自调用函数——游戏对象的构造函数
(function (){
    var that=null;
    //游戏对象的构造函数
    function Game(map){
        this.food=new Food(20,20,"red");
        this.snake=new Snake();
        this.map=map;
        that=this;
    }
    //原型添加方法
    //游戏初始化
    Game.prototype.init=function (){
        //食物初始化
      this.food.init(this.map);
      //小蛇初始化
      this.snake.init(this.map);
      //调用小蛇移动的方法
          this.gameRun(this.food,this.map);
          this.bindKey();
 
        };
        //添加原型方法——设置小蛇可以跑起来
    Game.prototype.gameRun=function (food,map){
        var timeId=setInterval(function (){
            //小蛇移动
            this.snake.move(food,map);
            //小蛇初始化
            this.snake.init(map);
            //最大横纵坐标
            var maxX=map.offsetWidth/this.snake.width;
            var maxY=map.offsetHeight/this.snake.height;
            //小蛇头的坐标
            var headX=this.snake.body[0].x;
            var headY=this.snake.body[0].y;
            if(headX<0||headX>=maxX){
                clearInterval(timeId);
                alert("game over");
            }
            if(headY<0||headY>=maxY){
                clearInterval(timeId);
                alert("game over");
                }
 
            }.bind(that),150)
        };
        //添加原型方法——注册按键点击事件
    Game.prototype.bindKey=function (){
        addEventListener("keydown", function (e){
           switch(e.keyCode){
               case 37:this.snake.direction="left";break;
               case 38:this.snake.direction="top";break;
               case 39:this.snake.direction="right";break;
               case 40:this.snake.direction="bottom";break;
           }
        }.bind(that),false);
    };
    window.Game=Game;
}());
var game=new Game(map);
game.init();