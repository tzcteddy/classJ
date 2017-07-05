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

//->格式化时间字符串
String.prototype.myFormatTime = function (template) {
    template = template || '{0}年{1}月{2}日 {3}时{4}分{5}秒';
    let ary = this.match(/\d+/g);
    template = template.replace(/\{(\d)\}/g, function () {
        let index = arguments[1],
            num = ary[index] || '00';
        num.length < 2 ? num = '0' + num : null;
        return num;
    });
    return template;
};

/*--MAIN RENDER--*/
let mainRender = (()=> {
    let $header = $('.header'),
        $main = $('.main'),
        $menu = $main.find('.menu'),
        $calendar = $main.find('.calendar'),
        $match = $main.find('.match');

    let computedHeight = ()=> {
        let winH = $(window).height(),
            headerH = $header.outerHeight(),
            calendarH = $calendar.outerHeight();

        let mainH = winH - headerH - 40;
        $main.height(mainH);
        $menu.height(mainH - 2);
        $match.height(mainH - calendarH - 20);
    };

    return {
        init(){
            computedHeight();
            $(window).on('resize', computedHeight);
        }
    }
})();
mainRender.init();

/*--MENU RENDER--*/
let menuRender = (()=> {
    let $menuPlan = $.Callbacks();

    let example = null,
        HASH = null;

    let $menu = $('.menu'),
        $link = $menu.find('a');

    //->ISCROLL局部滚动
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
        let $cur = $link.filter('[href="#' + HASH + '"]');
        $cur.length === 0 ? $cur = $link.eq(0) : null;
        $cur.addClass('bg');
        example.scrollToElement($cur[0], 0);

        //->控制日历
        calendarRender.init($cur.attr('data-cid'));
    });

    //->点击操作
    $menuPlan.add(()=> {
        $link.filter(':not(.link)').on('click', function () {
            $(this).addClass('bg').parent().siblings().find('a').removeClass('bg');

            //->控制日历
            calendarRender.init($(this).attr('data-cid'));
        });
    });

    return {
        init(){
            $menuPlan.fire();
        }
    }
})();

/*--CALENDAR RENDER--*/
/*
 * 1、从腾讯的服务器上获取数据,然后把数据展示在页面中(ES6模板字符串)
 * 2、定位到今天日期的位置
 * 3、左右切换的时候,控制日期区域切换(每一次切换走7个)
 * 4、点击每一个日期定位到今天赛事区域
 */
let calendarRender = (()=> {
    let $calendarPlan = $.Callbacks(),
        $calendar = $('.calendar'),
        $calendarItem = $calendar.find('ul'),
        $link = null,
        $btn = $calendar.find('.btn');

    let maxL = 0,
        minL = 0;

    //->绑定数据
    $calendarPlan.add((today, data)=> {
        let str = ``;
        $.each(data, function (index, item) {
            str += `<li data-time="${item.date}"><a href="javascript:;">
                <span class="week">${item.weekday}</span>
                <span class="date">${item.date.myFormatTime('{1}-{2}')}</span>
            </a></li>`;
        });
        $calendarItem.html(str)
            .css('width', data.length * 110);

        $link = $calendarItem.find('li');
        minL = -((data.length - 7) * 110);
    });

    //->定位日期
    /*
     * 1、在所有的LI中找到当前日期对应项(如果今天没有比赛,LI中没有这个日期,我们是无法找到的:找不到的话,找后面最靠近的那个日期,如果后面都没有比当前日期大的,我们默认找到最后一项即可)
     * 2、滚动到当前项目这个位置:需要做边界判断
     */
    $calendarPlan.add((today, data, columnId)=> {
        let $cur = $link.filter('[data-time="' + today + '"]');
        if ($cur.length === 0) {
            let todayNum = today.replace(/-/g, '');
            $link.each(function (index, item) {
                let itemTime = $(item).attr('data-time'),
                    itemNum = itemTime.replace(/-/g, '');
                if (itemNum > todayNum) {
                    $cur = $(item);
                    return false;//->结束JQ的EACH循环
                }
            });
        }
        $cur.length === 0 ? $cur = $link.eq($link.length - 1) : null;

        $cur.find('a').addClass('bg');
        let curIndex = $cur.index(),
            curL = -curIndex * 110 + 330;
        curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
        $calendarItem.css('left', curL);

        //->控制比赛列表
        let strIn = Math.abs(curL / 110),
            endIn = strIn + 6,
            $strItem = $link.eq(strIn),
            $endItem = $link.eq(endIn);
        matchRender.init(columnId, $strItem.attr('data-time'), $endItem.attr('data-time'));
    });

    //->左右切换
    $calendarPlan.add((today, data, columnId)=> {
        $btn.on('click', function () {
            let curL = parseFloat($calendarItem.css('left'));//->JQ通过CSS获取的样式值带单位
            curL = curL % 110 !== 0 ? Math.round(curL / 110) * 110 : curL;//->为了防止快速点击的时候出现"半拉"LI,我们保证每一次起始LEFT值是110的倍数

            $(this).hasClass('btnLeft') ? curL += 770 : curL -= 770;
            curL = curL > maxL ? maxL : (curL < minL ? minL : curL);

            $calendarItem.stop().animate({
                left: curL
            }, 500, function () {
                //->当前展示七个中的第一个被选中
                let strIn = Math.abs(curL / 110),
                    endIn = strIn + 6,
                    $strItem = $link.eq(strIn),
                    $endItem = $link.eq(endIn);
                $strItem.find('a')
                    .addClass('bg')
                    .parent()
                    .siblings()
                    .find('a')
                    .removeClass('bg');

                //->控制比赛列表
                matchRender.init(columnId, $strItem.attr('data-time'), $endItem.attr('data-time'));
            });
        });
    });

    //->定位比赛
    $calendarPlan.add((today, data)=> {

    });

    return {
        init(columnId){
            columnId = columnId || 100000;//->NBA

            //->获取数据JSONP跨域请求:columnId赛事类型ID
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/calendar?columnId=' + columnId,
                method: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result['code'] == 0) {
                        result = result['data'];
                        let today = result['today'],
                            data = result['data'];
                        $calendarPlan.fire(today, data, columnId);
                    }
                }
            });
        }
    }
})();

/*--MATCH RENDER--*/
let matchRender = (()=> {
    return {
        init(columnId, startTime, endTime){
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/list?columnId=' + columnId + '&startTime=' + startTime + '&endTime=' + endTime,
                method: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    $('.match').html(JSON.stringify(result));
                }
            });
        }
    }
})();


menuRender.init();







