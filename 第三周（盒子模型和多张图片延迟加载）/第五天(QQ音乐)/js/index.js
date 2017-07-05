/**
 * Created by Administrator on 2017/1/15.
 */
//先求出main的高度
var header=document.getElementsByClassName("header")[0];
var footer=document.getElementsByClassName("footer")[0];
var main=document.getElementsByClassName("main")[0];

;(function () {
    var winH=document.documentElement.clientHeight||document.body.clientHeight;
   var val=winH-header.offsetHeight-footer.offsetHeight-(0.4*2)*window.htmlFontSize+"px";
    main.style.height=val+"px"
})();

//
var music=(function () {
   var data=null;
    var lyric=document.getElementsByClassName("lyric")[0];
    var audio=document.getElementsByClassName("audio")[0];
    var play=document.getElementsByClassName("play")[0];
    var pause=document.getElementsByClassName("pause")[0];
    var totalTime=document.getElementsByClassName("totalTime")[0];
    var currentTime=document.getElementsByClassName("currentTime")[0];
    var progressBarSpan=document.getElementsByClassName("progressBar")[0].getElementsByTagName("span")[0];
    var lyricPs=lyric.getElementsByTagName("p");
    function getData() {
        var xhr=new XMLHttpRequest();
        xhr.open("get","lyric1.json?_="+Math.random(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&/^2\d{2}$/.test(xhr.status)){
             data=JSON.parse(xhr.responseText);
            }
        };
        xhr.send(null);
    }
    function bindData() {
        if(data&&data.lyric){
            data=data.lyric;//从这行开始data代表数组
            var str="";
            for(var i=0;i<data.length;i++){
                var curData=data[i];
                str+="<p id='"+curData.id+"'  data-min='"+curData.minute+"' data-sec='"+curData.second+"'>"+curData.content+"</p>";
            }
            lyric.innerHTML=str;
        }
    }
    function autoPlay() {
        audio.play();//audio这种媒体标签独有的方法=>播放
        audio.oncanplay=function () {
           //audio.duration属性就是audio的时长
            //把时长转为分钟和秒赋给总时长
            totalTime.innerHTML=formatTime(audio.duration);
            play.style.display="none";
            pause.style.display="block";
        };

    }
    function btnEvent() {
        play.onclick=pause.onclick=function () {
            if(audio.paused){//如果是暂停
                audio.play();
                pause.style.display="block";
                play.style.display="none";
            }else {
                audio.pause();
                pause.style.display="none";
                play.style.display="block";
            }
        }
    }
    function formatTime(s) {
    var min=Math.floor(s/60);//向下取整
    var sec=Math.floor(s-min*60);
    min<10?min="0"+min:void 0;
    sec<10?sec="0"+sec:void 0;
    return min+":"+sec;
}
    function playStatus() {
    //当前播放时间要更新  进度条  歌词
        //audio.currentTime 这个属性就是当前audio播放时常
    var timer=window.setInterval(function () {
        if(audio.currentTime>audio.duration){
            window.clearInterval(timer);
            return;
        }
        currentTime.innerHTML= formatTime(audio.currentTime);//每一秒更换当前播放时间
        progressBarSpan.style.width=audio.currentTime/audio.duration*100+"%";//进度条
      //对应歌词添加选中样式
       var min=formatTime(audio.currentTime).split(":")[0];//当前播放的分
       var sec=formatTime(audio.currentTime).split(":")[1];//当前播放的秒
        for(var i=0;i<lyricPs.length;i++){
            var curP=lyricPs[i];
            if(curP.getAttribute("data-min")==min&&curP.getAttribute("data-sec")==sec){
                for(var j=0;j<lyricPs.length;j++){//把以前已经存在bg的样式清空
                   // lyricPs[j].className="";
                    lyricPs[j].className=i==j?"bg":"";
                }
               // curP.className="bg";
                if(curP.id>=4){
                    lyric.style.top=-(curP.id-4)*0.84*htmlFontSize+"px"
                }
                break;
            }
        }


    },1000)

}




    return {
        init:function () {
            //获取歌词数据 并且添加到页面中
            getData();
            //绑定数据
            bindData();
            //自动播放
            autoPlay();
            //给按钮绑定事件
            btnEvent();
            //播放中的状态
            playStatus();
        }
    }
})();
music.init();