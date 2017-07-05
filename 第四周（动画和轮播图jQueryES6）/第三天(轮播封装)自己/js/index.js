/**
 * Created by Administrator on 2017/1/18.
 */
//获取元素
var banner=document.getElementById("banner");
var bannerInner=utils.getElesByClass("bannerInner")[0];
var focusUl=utils.getElesByClass("focusUl")[0];
var left=utils.getElesByClass("left")[0];
var right=utils.getElesByClass("right")[0];
var imgs=bannerInner.getElementsByTagName("img");
var lis=focusUl.getElementsByTagName("li");
console.log(focusUl);
//获取数据
;(function () {
   var xhr=new XMLHttpRequest();
        xhr.open("get","data.txt?_="+Math.random(),false);
        xhr.onreadystatechange=function () {
            if(xhr.readyState==4&&xhr.status==200){
                window.data=JSON.parse(xhr.responseText)
            }
        };
        xhr.send();

    })();
console.log(data);
//绑定数据
;(function () {
    if(data){
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
//图片延迟加载
;(function () {
    for(var i=0;i<imgs.length;i++){
        var tempImg=document.createElement("img");
        tempImg.index=i;
        tempImg.src=imgs[i].getAttribute("real");
        tempImg.onload=function () {
            imgs[this.index].src=this.src;
            if(this.index==0){
                utils.setCss(imgs[this.index],"zIndex",1);
                animate({
                    ele:imgs[this.index].parentNode,
                    target:{
                        opacity:1
                    },
                    duration:500
                })
            }
        }
    }
})();
//轮播
var timer=window.setInterval(autoPlay,1000);

var index=0;
function autoPlay() {
    index++;
    if(index>=data.length){
        index=0;
    }
    setImgShow();
}
//更换层级
function setImgShow() {
    //循环所有的img，只有索引和全局index相同的那一张提高层级，除了当前的把其余的z-index 恢复为0
    for(var i=0;i<imgs.length;i++){
        if(i==index){
            utils.setCss(imgs[i].parentNode,"zIndex",1);
            animate({
                ele:imgs[i].parentNode,
                target:{
                    opacity:1
                },
                duration:500,
                callback:function () {//当前这个提高层级关系的图片透明度从0到1之后才要把刚刚恢复zindex为0 的那一张透明度设置为0
                   var divsBesides=utils.siblings(this);
                    for(var i=0;i<divsBesides.length;i++){
                        utils.setCss(divsBesides[i],"opacity",0);
                    }
                }
            })
        }else {
            utils.setCss(imgs[i].parentNode,"zIndex",0)
        }
    }
    //焦点对齐 图片更换完毕
    for(var i=0;i<lis.length;i++){
        lis[i].className=    i==index?"cur":"";
    }
};


banner.onmouseover=function () {
    window.clearInterval(timer);
    utils.setCss(left,"display","block");
    utils.setCss(right,"display","block");
};

banner.onmouseout=function () {
    timer=window.setInterval(autoPlay,2000);
    utils.setCss(left,"display","none");
    utils.setCss(right,"display","none")
};

left.onclick=function () {
    index--;
    if(index==-1){
        index=data.length-1;
    }
    setImgShow();
};

right.onclick=autoPlay;
//点击焦点
;(function () {
    for(var i=0;i<lis.length;i++){
        lis[i].index=i;
        lis[i].onclick=function () {
            index=this.index;
            setImgShow();
        }
    }
})();
