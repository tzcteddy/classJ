// 获取元素
var banner = document.getElementById('banner');
var bannerInner = utils.getElesByClass('bannerInner')[0];
var focusUl = utils.getElesByClass('focusUl')[0];
var right = utils.getElesByClass('right')[0];
var left = utils.getElesByClass('left')[0];
var imgs = bannerInner.getElementsByTagName('img');
var lis = focusUl.getElementsByTagName('li');
var data = null;
// 获取数据
;(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt?_='+Math.random(),false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState ==  4 && xhr.status == 200){
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);
// 绑定数据
;(function (){
    if(data){
        var str = '';
        var strLi = '';
        for(var i = 0 ; i < data.length; i++){
            str += '<div><img src="" real="'+ data[i].src +'"></div>';
            strLi += i == 0 ? '<li class="cur"></li>' : '<li></li>';
        }
        bannerInner.innerHTML = str;
        focusUl.innerHTML = strLi;
    }
})();
// 图片延迟加载
;(function (){
    for(var i = 0; i < imgs.length; i++){
        var tempImg = document.createElement('img');
        tempImg.index = i; //保存一个索引值
        tempImg.src = imgs[i].getAttribute('real');
        tempImg.onload = function (){
            imgs[this.index].src = this.src; // 只有这行代码执行结束图片的src才有值
            if(this.index == 0){ // 如果是第一张提高层级，并且淡入
                // 把z-index和opacity都设置给img的父元素div上了
                utils.setCss(imgs[0].parentNode,'zIndex',1);
                animate({
                    ele :  imgs[0].parentNode,
                    target : {
                        opacity : 1
                    },
                    duration : 500
                });
            }
        }
    }
})();

// 轮播
var timer = window.setInterval(autoPlay,2000);
var index = 0; // 默认第一张显示
function autoPlay(){
    index++;
    if(index == /*4*/data.length){
        index = 0;
    }
    setImgShow(); // 专门负责更换图片的函数
}
function setImgShow(){
    // 循环所有的img，只有索引和全局index相同的那一张提高层级，除了这一张的层级全部归0
    for(var i = 0; i < imgs.length; i++){
        if(i == index){ // 和index相等的提高层级
            utils.setCss(imgs[i].parentNode,'zIndex',1); //提高层级
            animate({
                ele : imgs[i].parentNode,
                target : {
                    opacity : 1
                },
                duration : 500,
                callback : function (){
                    // 当前这个提高层级关系的图片的透明度从0运动到1之后，我们才要把刚刚恢复到zIndex为0的那一张的透明度设置成0 => 除了当前这一个其他透明度全部设置成0
                    this; // => 就是指向运动的元素 => 刚刚提高层级上来这一张
                    var divsBesidesThis = utils.siblings(this);
                    for(var i = 0; i < divsBesidesThis.length; i++){
                        utils.setCss(divsBesidesThis[i],'opacity',0);
                    }
                }
            })
        }else{ // 除了和index相等的全部恢复默认的0
            utils.setCss(imgs[i].parentNode,'zIndex',0);
        }
    }
    // 图片更换完毕 => 执行焦点对其 => 索引和index相等添加cur其他的移除cur
    for(var i = 0; i < lis.length; i++ ){
        lis[i].className = i == index ? 'cur' : '';
    }
}
// 鼠标滑过停止播放，并且显示左右按钮
banner.onmouseover = function (){
    window.clearInterval(timer);
    left.style.display = 'block';
    right.style.display = 'block';
}

// 鼠标离开的时候继续播放，左右按钮消失

banner.onmouseout = function (){
    timer = window.setInterval(autoPlay,2000);
    left.style.display = 'none';
    right.style.display = 'none';
}
// 左右按钮点击
left.onclick = function (){
    index--;
    if(index == -1){
        index = data.length-1;
    }
    setImgShow();
}
right.onclick = autoPlay;
// 点击焦点切换到对应的图片上
;(function (){
    for(var i = 0; i < lis.length; i++){
        lis[i].index = i;
        lis[i].onclick = function (){
            index = this.index;
            setImgShow(); // 只要更换index的值就会把对应index的图片更换
        }
    }
})();




