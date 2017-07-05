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

/*--MENU RENDER--*/
let menuRender = (()=> {
    let $menu = $('#menu'),
        $nav = $('#nav');
    let isBlock = false;//->是否为展开的,开始是FALSE是隐藏的

    return {
        init(){
            $menu.tap(function () {
                if (isBlock) {
                    //->当前是展开的我们需要让其隐藏
                    $nav.css({
                        padding: '0',
                        height: '0'
                    });
                    isBlock = false;
                    return;
                }

                //->当前是隐藏的我们需要让其展开
                $nav.css({
                    padding: '.1rem 0',
                    height: '2.22rem'
                });
                isBlock = true;
            });
        }
    }
})();
menuRender.init();

/*--MATCH RENDER--*/
let matchRender = (()=> {
    let $match = $('#match'),
        $mathPlan = $.Callbacks(),
        $progress = null,
        $supportLeft = null,
        $supportRight = null;

    //->数据绑定
    $mathPlan.add(function (matchInfo) {
        let str = `<div class="top">
            <div class="left">
                <img src="${matchInfo.leftBadge}" alt="${matchInfo.leftName}"/>
                <span>${matchInfo.leftGoal}</span>
            </div>
            <div class="center">${matchInfo.startTime.myFormatTime('{1}-{2} {3}:{4}')}</div>
            <div class="right">
                <span>${matchInfo.rightGoal}</span>
                <img src="${matchInfo.rightBadge}" alt="${matchInfo.rightName}"/>
            </div>
        </div>
        <div class="middle">
            <div class="progress" id="progress"></div>
        </div>
        <div class="bottom">
            <div class="left support" id="supportLeft" data-type="1">${matchInfo.leftSupport}</div>
            <div class="center">${matchInfo.matchDesc}</div>
            <div class="right support" id="supportRight" data-type="2">${matchInfo.rightSupport}</div>
        </div>`;

        $match.html(str);

        $progress = $('#progress');
        $supportLeft = $('#supportLeft');
        $supportRight = $('#supportRight');
    });

    //->计算进度条
    $mathPlan.add(function (matchInfo) {
        let lNum = parseFloat(matchInfo.leftSupport),
            rNum = parseFloat(matchInfo.rightSupport);
        $progress.css('width', (lNum / (lNum + rNum)) * 100 + '%');
    });

    //->点击支持
    let isTouch = false;
    $mathPlan.add(function (matchInfo) {
        let supportInfo = localStorage.getItem('supportInfo');
        if (supportInfo) {
            supportInfo = JSON.parse(supportInfo);
            supportInfo.type == 1 ? $supportLeft.addClass('bg') : $supportRight.addClass('bg');
            return;
        }

        //->把左侧和右侧点击按钮和合并在一个集合中,然后绑定相同的点击事件
        $supportLeft.add($supportRight).tap(function () {
            if (isTouch) return;
            isTouch = true;

            let oldNum = parseFloat($(this).html());
            $(this).addClass('bg').html(oldNum + 1);

            //->告诉服务器支持的谁:type=1左边 type=2右边
            let type = $(this).attr('data-type');
            $.ajax({
                url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=8:855375&type=' + type,
                dataType: 'jsonp'
            });

            //->把当前支持的信息记录在本地,下一次刷新页面的时候,首先验证一下本地是否存在这个信息,不存在说明没有支持过,存在说明支持过,不能在支持了
            localStorage.setItem('supportInfo', JSON.stringify({
                type: type,
                time: new Date().getTime()
            }));//->本次存储存储的信息格式只能是字符串格式的,如果存储的是其它类型,也会转成字符串
        });
    });

    return {
        init(){
            //->从腾讯服务器获取数据
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=8:855375',
                method: 'GET',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1];
                        let matchInfo = result['matchInfo'];
                        matchInfo['leftSupport'] = result['leftSupport'];
                        matchInfo['rightSupport'] = result['rightSupport'];
                        $mathPlan.fire(matchInfo);
                    }
                }
            });
        }
    }
})();
matchRender.init();

/*--PLAYER RENDER--*/
let playerRender = (()=> {
    let $playerPlan = $.Callbacks(),
        $player = $('#player'),
        $wrapper = $player.find('.wrapper');

    //->数据绑定
    $playerPlan.add(function (result) {
        let str = ``;
        $.each(result, function (index, item) {
            str += `<li><a href="#">
                <div>
                    <img src="${item.pic}" alt=""/>
                    <span class="time">${item.duration.myFormatTime('{1}:{2}')}</span>
                </div>
                <p>${item.title}</p>
            </a></li>`;
        });
        $wrapper.html(str).css('width', result.length * 2.4 + 0.3 + 'rem');
    });

    //->局部滚动
    $playerPlan.add(function (result) {
        new IScroll('#player', {
            scrollX: true
        });
    });

    return {
        init(){
            $.ajax({
                url: 'http://matchweb.sports.qq.com/html/matchStatV37?mid=8:855375',
                dataType: 'jsonp',
                success: function (result) {
                    if (result && result[0] == 0) {
                        result = result[1]['stats'];
                        $.each(result, function (index, item) {
                            if (item['type'] == 9) {
                                result = item['list'];
                                return false;
                            }
                        });

                        $playerPlan.fire(result);
                    }
                }
            });
        }
    }
})();
playerRender.init();