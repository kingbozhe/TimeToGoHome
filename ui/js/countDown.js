$(function (){
	if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
	    $("#phoneOnly").css("display","");
	} else {
		$("#phoneOnly").css("display","none");
	}
	
	setInterval(function(){
		init();
		
	},1000)
	
})

function init(){
	var now = new Date();
	var nowDay = now.getFullYear()+"/"+(now.getMonth()+1)+"/"+now.getDate();
	var four = new Date(nowDay+" 17:00:00");
	var one = new Date(nowDay+" 18:00:00");
	var two = new Date(nowDay+" 20:00:00");
	var three = new Date(nowDay+" 21:30:00");
	calculate(now,one,"#one");
	calculate(now,two,"#two");
	calculate(now,three,"#three");
	calculate(now,four,"#four");
}

function calculate(now,leaveTime,id){
	var nowSecond = now.getTime();
	var leaveSecond = leaveTime.getTime();
	var subtract = (leaveSecond - nowSecond)/1000;
	//小时
	var hours = Math.floor((subtract %= 86400) / 3600);
	if(hours<0){
		hours = hours + 1;
	}
	//分钟
	var minutes = Math.floor((subtract %= 3600) / 60);
	//秒
	var seconds = Math.floor(subtract % 60); 
	$(id).html("");
	$(id).append(hours + "小时" + minutes + "分钟" + seconds + "秒");
	if(hours==0&&minutes<=30&&minutes>=0){
		$(id).css("color","red");
	}else if(hours<0){
		$(id).append("，加班辛苦！");
	}
}