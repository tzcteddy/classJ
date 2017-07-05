// 获取元素
var newsList = document.getElementById('newsList');
var imgs = newsList.getElementsByTagName('img'); // 此刻获取不到 []
var data = null;
// 获取数据
;(function getData(){
    var xhr = new XMLHttpRequest();
    // http://www.baidu.com/his?_=0.1223412413241534 时间戳
    xhr.open('get','data.txt?_='+Math.random(),false);
    // 在url后添加一个随机数就是为了不能读取缓存。浏览器的缓存机制就是比较地址
    xhr.onreadystatechange = function (){
        if(xhr.readyState  == 4 && xhr.status == 200){
            // 404, 304, 502 ...
            data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send(null);
})();

console.log(data); //
// 绑定数据
;(function bindData(){
    if(data && data.length){
        // data存在并且data里还存在数据
        var str = '';
        // [{src: images/1.jpg, title : aa, desc : bb},...]
        // 只要data中存在一个对象就拼接一个li
        for(var i = 0; i < data.length; i++){
            str += '<li>';
                str += '<div><img src="" real="'+ data[i]['src'] +'"></div>';
                str += '<div><h3>'+ data[i].title +'</h3><p>'+ data[i].desc +'</p></div>';
            str += '</li>';
        }
        newsList.innerHTML = str;
    }
})();

// 多张图片延迟加载 => 循环判断每一张图片是否完全进入到窗口中。
// imgs : [img,img,img...] => 对应页面中每一张真实图片
function imgsDelayLoad(){
    for(var i = 0; i < imgs.length; i++){
        // 循环判断每一张是否完全进入\
        if(imgs[i].isLoaded){
            continue;
        }
        var winHeight = utils.win('clientHeight');
        var winScrollTop = utils.win('scrollTop');
        var imgHeight = imgs[i].parentNode.offsetHeight;
        var imgOffsetTop = utils.offset(imgs[i].parentNode).top;
        if(winHeight + winScrollTop > imgHeight + imgOffsetTop){
            // 当前正在循环的这张图片完全进入到窗口
            // 代码从这个位置开始就是单张图片延迟加载的逻辑
            singleDelayLoad(imgs[i]); // 把每一张符合完全进入窗口内条件的图片都传给单张图片延迟加载的函数  invo...d
        }
    }
}
function singleDelayLoad(img){ // img : 真正要做图片延迟加载的
    //if(img.isLoaded){ return;}
    var tempImg = document.createElement('img');
    //var tempImg = new Image(); // 为什么把这个拦截的操作，放到上面那个for循环的第一行
    tempImg.src = img.getAttribute('real');
    tempImg.onload = function (){
        // 只要事件触发说明img的图片资源有效。有效就可以img.src属性就可以赋值了
        img.src = this.src; // img.getAttribute('real');
        // 此刻透明度还是0
        fadeIn(img);
    }
    img.isLoaded = true; //只要加载过就添加一个自定义属性来记录这张图片已经加载过了。就没有必要加载第二次
}

function fadeIn(img){
    window.clearInterval(img.timer);
    img.timer = window.setInterval(function (){
        var opacity = utils.getCss(img,'opacity');
        //var opacity = window.getComputedStyle(img).opacity/1;
        if(opacity >= 1){
            window.clearInterval(img.timer);
            return;
        }
        opacity += 0.01;
        utils.setCss(img,'opacity',opacity);
        //img.style.opacity = opacity;
    },10);
}

// getCss setCss win


imgsDelayLoad(); // 刷新页面直接执行，有符合条件的图片
window.onscroll = imgsDelayLoad; // 滚动条滚动还需要执行






