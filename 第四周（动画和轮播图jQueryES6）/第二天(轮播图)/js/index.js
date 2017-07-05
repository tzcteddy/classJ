//获取元素
var banner = document.getElementById('banner');
var bannerInner = utils.getElesByClass('bannerInner', banner)[0];
var focusUl = utils.getElesByClass('focusUl', banner)[0];
var left = utils.getElesByClass('left', banner)[0];
var right = utils.getElesByClass('right', banner)[0];
var imgs = bannerInner.getElementsByTagName('img'); // 图片
var lis = focusUl.getElementsByTagName('li'); // 焦点
var data = null;
//获取数据
;(function () {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'data.txt?_=' + Math.random(), false);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            data = utils.jsonParse(xhr.responseText);
        }
    }
    xhr.send(null);
})();
console.log(data);
// 绑定数据
;(function () {
    if (data) {
        var str = '';
        var strLi = '';
        for (var i = 0; i < data.length; i++) {
            // {src : 'images/1.jpg'}
            str += '<div><img src="" real="' + data[i].src + '"></div>';
            // 第一个li需要单独处理有个cur选中样式
            strLi += i == 0 ? '<li class="cur"></li>' : '<li></li>';
        }
        // 为了保证轮播的时候做无缝连接，需要在最后添加一个第一张图片
        str += '<div><img src="" real="' + data[0].src + '"></div>';
        utils.setCss(bannerInner, 'width', (data.length + 1) * 600); // 动态处理宽度，否则图片就会换行

        bannerInner.innerHTML = str;
        focusUl.innerHTML = strLi;
    }
})();

// 图片有效性验证
;(function () {
    for (var i = 0; i < imgs.length; i++) {
        // imgs[i]; 每一张图片
        //(function (i){
        var tempImg = document.createElement('img');
        tempImg.index = i;
        tempImg.src = imgs[i].getAttribute('real');
        tempImg.onload = function () {
            // 使用自定义属性来处理i的问题
            imgs[/*i*/this.index].src = this.src;
            animate({ // 用淡入的方式
                ele: imgs[this.index],
                target: {
                    opacity: 1
                },
                duration: 500
            });
        }
        tempImg = null;
        //})(i)
        // tempImg.isLoaded = true; 只加载一次没有滚动的时刻去判断然后加载...
    }
})();

// 轮播图开始
var timer = window.setInterval(autoPlay, 2000); // 2s播一张
var index = 0; // index的值就是代表当前播放哪一张图片的索引
function autoPlay() {
    index++; // index++之后的值就是我要运动到的终点
    if (index == /*4*/data.length + 1) { // 目前正在从最后一张往后播放，赶紧切换到第一张（直接切换）
        utils.setCss(bannerInner, 'left', 0);
        index = 1; // 向第二张运动，索引index的值应该是第二张索引
    }
    animate({
        ele: bannerInner,
        target: {
            left: -index * 600
        },
        duration: 500
    });
    focusAlign(); // 更换图片之后焦点重新对齐
}
// 焦点对齐 => 轮播图片就需要重新执行
function focusAlign() {
    // 当播放到最后一张图片(显示的是第一张)但是lis中没有对应的li。所以让第一张显示
    var tempIndex = index == lis.length ? 0 : index;
    for (var i = 0; i < lis.length; i++) {
        // 索引值和index相同的li添加cur样式否则移除
        lis[i].className = i == tempIndex ? 'cur' : '';
    }
}

// 鼠标悬停停止播放
banner.onmouseover = function () {
    window.clearInterval(timer);
    // 左右按钮出现
    left.style.display = 'block';
    right.style.display = 'block';
}
banner.onmouseout = function () {
    timer = window.setInterval(autoPlay, 2000);
    left.style.display = 'none';
    right.style.display = 'none';
};
// 给左右按钮绑定点击事件 => 和自动轮播的逻辑相反
left.onclick = function () {
    index--; //
    if (index == -1) {
        utils.setCss(bannerInner, 'left', -data.length * 600);
        index = data.length - 1;
    }
    animate({
        ele: bannerInner,
        target: {
            left: -index * 600
        },
        duration: 500

    });
    focusAlign();
}
right.onclick = autoPlay;

// 给焦点绑定点击事件
;(function () {
    for (var i = 0; i < lis.length; i++) {
        lis[i].index = i;
        lis[i].onclick = function () {
            index = this.index; // 修改index的值。animate根据index的值动画
            animate({
                ele: bannerInner,
                target: {
                    left: -index * 600
                },
                duration: 500
            });
            focusAlign();
        }
    }
})();

