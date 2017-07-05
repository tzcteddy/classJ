/*--String--*/
String.prototype.myQueryURLParameter = function () {
    var reg = /([^?=#&]+)=([^?=#&]+)/g,
        obj = {};
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    //->GET HASH
    reg = /#([^?=#&]+)/;
    this.replace(reg, function () {
        obj['HASH'] = arguments[1];
    });
    return obj;
};

/*--MAIN RENDER--*/
let mainRender = (()=> {
    let $header = $('.header'),
        $main = $('.main'),
        $menu = $main.find('.menu'),
        $calendar = $main.find('.calendar'),
        $match = $main.find('.match');

    let computedHeight = ()=> {
        let winH = $(window).height(),//->获取一屏幕高度(JQ语法)
            headerH = $header.outerHeight(),//->JQ:outerHeight <=> JS:offsetHeight  JQ:innerHeight <=> JS:clientHeight
            calendarH = $calendar.outerHeight();

        let mainH = winH - headerH - 40;
        $main.height(mainH);//->$main.css('height',mainH)
        $menu.height(mainH - 2);
        $match.height(mainH - calendarH - 20);
    };

    return {
        init(){
            computedHeight();
            $(window).on('resize', computedHeight);//->当浏览器的窗口大小发生改变的时候,把所有的高度计算重新执行,让高度随着浏览器的高度一起改变即可
        }
    }
})();
mainRender.init();

/*--MENU RENDER--*/
/*
 * 1、给MENU区域实现局部滚动(ISCROLL.JS)
 * 2、根据URL中的HASH值,让某一个A选中(点击A的时候,需要往URL中加HASH值),并且滚动到这个A的位置
 * 3、点击左侧的每一个A,让右侧展示不同的内容
 * ...
 */
let menuRender = (()=> {
    let $menuPlan = $.Callbacks();//->JQ发布订阅模式中的"发布计划"

    let example = null,
        HASH = null;

    let $menu = $('.menu'),
        $link = $menu.find('a');

    //->ISCROLL局部滚动
    //JQ中的ADD就是向计划表中追加需要执行的方法(REMOVE是从计划表中把方法移除)
    $menuPlan.add(()=> {
        example = new IScroll('.menu', {
            scrollbars: true,
            fadeScrollbars: true,
            mouseWheel: true,
            bounce: false
        });
        $('.iScrollIndicator').css('opacity', 0.3);
    });

    //->HASH定位
    $menuPlan.add(()=> {
        HASH = window.location.href.myQueryURLParameter()['HASH'];
        let $cur = $link.filter('[href="#' + HASH + '"]');//->验证JQ是否获取到想要的内容,不能使用NULL/UNDEFINED验证,因为即使没有获取到,得到的依然是JQ的类数组(伪数组),只是LENGTH为零而已
        $cur.length === 0 ? $cur = $link.eq(0) : null;
        $cur.addClass('bg');

        example.scrollToElement($cur[0], 0);//->ISCROLL:滚动到具体的某一个元素位置([原生的元素对象],[时间])
    });

    //->点击操作
    $menuPlan.add(()=> {
        $link.filter(':not(.link)').on('click', function () {
            $(this).addClass('bg').parent().siblings().find('a').removeClass('bg');//->也可以使用JQ中的循环,循环$link来处理

        });
    });

    return {
        init(){
            $menuPlan.fire();//->JQ:通知计划表中的方法依次执行,还可以给每个方法传递参数,$menuPlan.fire(100)相当于给计划表中的每一个方法都传递了100
        }
    }
})();

menuRender.init();


/*--CALENDAR RENDER--*/
/*
 * 1、从腾讯的服务器上获取数据,然后把数据展示在页面中(ES6模板字符串)
 * 2、定位到今天日期的位置
 * 3、左右切换的时候,控制日期区域切换(每一次切换走7个)
 * 4、点击每一个日期定位到今天赛事区域
 */
let calendarRender = (()=> {
    var $calendarPlan = $.Callbacks();

    //->绑定数据
    $calendarPlan.add((today, data)=> {

    });

    //->定位日期
    $calendarPlan.add((today, data)=> {

    });

    //->左右切换
    $calendarPlan.add((today, data)=> {

    });

    //->定位比赛
    $calendarPlan.add((today, data)=> {

    });

    return {
        init(){
            //->获取数据JSONP跨域请求
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=23',
                method: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result['code'] == 0) {
                        result = result['data'];
                        let today = result['today'],
                            data = result['data'];
                        $calendarPlan.fire(today, data);
                    }
                }
            });
            //->XMLHttpRequest cannot load http://matchweb.sports.qq.com/kbs/calendar?columnId=23. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:63342' is therefore not allowed access.
            //->我们的域：http://localhost:63342
            //->腾讯的域：http://matchweb.sports.qq.com:80
            //只要两个域之间的 协议、域名、端口号 有一个不一样就属于跨域请求，跨域请求下默认不能使用AJAX，我们一般使用JSONP来处理
        }
    }
})();
calendarRender.init();








