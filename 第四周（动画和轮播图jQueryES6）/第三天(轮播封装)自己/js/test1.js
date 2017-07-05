/**
 * Created by Administrator on 2017/1/19.
 */
//获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner",banner)[0];
var focusUl=utils.getElesByClass("focusUl",banner)[0];
var left=utils.getElesByClass("left",banner)[0];
var right=utils.getElesByClass("right",banner)[0];
var imgs=bannerInner.getElementsByTagName("img");
var lis=focusUl.getElementsByTagName("li");

//获取数据
;(function () {
    var xhr=new XMLHttpRequest();
    xhr.open("get","data.txt?_="+Math.random(),false);
    xhr.onreadystatechange=function () {
        if(xhr.readyState==4&&xhr.status==200){
            window.data=JSON.parse(xhr.responseText);
        }
    };
    xhr.send();
})();

//绑定数据
;(function () {
    if(data&&data.length){
        var str="";
        var strLi="";
        for(var i=0;i<data.length;i++){
            str+="<div><img src='' real='"+data[i].src+"'></div>";
            strLi+=i==0?"<li class='cur'></li>":"<li></li>";
        }
        bannerInner.innerHTML=str;
        focusUl.innerHTML=strLi;
    }
})();


//加载图片
;(function () {
    for(var i=0;i<imgs.length;i++){
        var tempImg=document.createElement("img");
        tempImg.index=i;
        tempImg.src=imgs[i].getAttribute("real");
        tempImg.onload=function () {
            imgs[this.index].src=this.src;
            if(this.index==0){
                utils.setCss(imgs[0].parentNode,"zIndex",1);
                animate({
                    ele:imgs[0].parentNode,
                    target:{
                        opacity:1
                    },
                    duration:500
                })
            }

        }

    }
})();

var timer=window.setInterval(autoPlay,2000);
var index=0;
function autoPlay() {
    index++;
    if(index>=data.length){
        index=0;
    };
    s();
}
function s() {
    for(var i=0;i<imgs.length;i++){
        if(i==index){
            utils.setCss(imgs[i].parentNode,"zIndex",1);
            animate({
                ele:imgs[i].parentNode,
                target:{
                    opacity:1
                },
                duration:500,
                callback:function () {
                    var siblings=utils.siblings(this);
                    for(var i=0;i<siblings.length;i++){
                        utils.setCss(siblings[i],"opacity",0);
                    }

                }
            })
        }else {
            utils.setCss(imgs[i].parentNode,"zIndex",0);
        }
    }
    for(var i=0;i<lis.length;i++){
        i==index?lis[i].className="cur":lis[i].className="";
    }
}

//鼠标滑入滑出
banner.onmouseover=function () {
    window.clearInterval(timer);
    utils.setCss(left,"display","block");
    utils.setCss(right,"display","block");
};
banner.onmouseout=function () {
    timer = window.setInterval(autoPlay, 2000);
    utils.setCss(left, "display", "none");
    utils.setCss(right, "display", "none");
};
left.onclick=function () {
    index--;
    if(index==-1){
        index=data.length-1;
    }
    s();
};
right.onclick=autoPlay;

;(function () {
    for(var i=0;i<lis.length;i++){
        lis[i].index=i;
        lis[i].onclick=function () {
            index=this.index;
            s();
        }
    }
})();
