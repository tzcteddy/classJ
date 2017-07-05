/**
 * Created by Administrator on 2017/3/5.
 */
/*项目中的loading区域是在页面内容展示之前给用户一个等待加载的时间，主要处理图片（音视频）的加载*/
var loadingRender = (function () {

    var ary = ["icon.png", "zf_concatAddress.png", "zf_concatInfo.png", "zf_concatPhone.png", "zf_course.png", "zf_course1.png", "zf_course2.png", "zf_course3.png", "zf_course4.png", "zf_course5.png", "zf_course6.png", "zf_cube1.png", "zf_cube2.png", "zf_cube3.png", "zf_cube4.png", "zf_cube5.png", "zf_cube6.png", "zf_cubeBg.jpg", "zf_cubeTip.png", "zf_emploment.png", "zf_messageArrow1.png", "zf_messageArrow2.png", "zf_messageChat.png", "zf_messageKeyboard.png", "zf_messageLogo.png", "zf_messageStudent.png", "zf_outline.png", "zf_phoneBg.jpg", "zf_phoneDetail.png", "zf_phoneListen.png", "zf_phoneLogo.png", "zf_return.png", "zf_style1.jpg", "zf_style2.jpg", "zf_style3.jpg", "zf_styleTip1.png", "zf_styleTip2.png", "zf_teacher1.png", "zf_teacher2.png", "zf_teacher3.jpg", "zf_teacher4.png", "zf_teacher5.png", "zf_teacher6.png", "zf_teacherTip.png"];
    var curNum = 0,
        total = ary.length;
    var $loading = $(".loading"),
        $progress = $loading.children(".progress"),
        $progressSpan = $progress.children("span");


    return {
        init: function () {
            $.each(ary, function (index, item) {
                var oImg = new Image();
                oImg.src = "img/" + item;
                oImg.onload = function () {
                    oImg = null;
                    /*curNum++;*/
                    $progressSpan.css("width", ((++curNum) / total) * 100 + "%");
                    /*当所有图片都加载完成后我们让loading层消失（设置1秒的延迟，）*/
                    if (curNum === total) {
                        window.setTimeout(function () {
                            phoneRender.init();
                            $loading.css("opacity", 0).on("webkitTransitionEnd", function () {
                                $(this).remove();

                            })
                        }, 1500)
                    }
                }
            })
        }
    }
})();


/*--phone-*/
var phoneRender = (function () {
    var $phone = $(".phone"),
        $time = $phone.find(".time"),
        $listen = $phone.find(".listen"),
        $listenTouch = $listen.find(".touch"),
        $detail = $phone.find(".detail"),
        $detailTouch = $detail.find("span");
    var phoneBell = $("#phoneBell")[0],
        phoneSay = $("#phoneSay")[0];

    function listenTouchFn() {
        //
        $listen.remove();
        //
        $detail.css("transform", "translateY(0)");//$detail[0].style.webkitTransform="translateY(0)"
        //
        phoneBell.pause();
        $(phoneBell).remove();
        //
        phoneSay.play();
        phoneSay.oncanplay = bindTime;


    }

    //实现倒计时
    function bindTime() {
        $time.css("display", "block");
        var duration = phoneSay.duration;
        var timer = window.setInterval(function () {
            var curTime = phoneSay.currentTime;
            var minute = Math.floor(curTime / 60),
                second = Math.floor(curTime - minute * 60);
            minute = minute < 10 ? "0" + minute : minute;
            second = second < 10 ? "0" + second : second;
            $time.html(minute + ":" + second);
            if (curTime >= duration) {
                closePhone();
                window.clearInterval(timer);
            }
        }, 1000);

    }

    function closePhone() {
        phoneSay.pause();
        $(phoneSay).remove();
        $phone
            .css("transform", "translateY(" + document.documentElement.clientHeight + "px)")
            .on("webkitTransitionEnd", function () {
                console.log("s");
                $(this).remove();
            });
        messageRender.init();
    }

    return {
        init: function () {
            $(".phone").css("display", "block");
            /*电话接听音频播放*/
            phoneBell.play();
            /*listen区域绑定事件*/
            $listenTouch.tap(listenTouchFn);//zepto专用方法（JQ中没有）。

            $detailTouch.tap(closePhone);
        }
    }
})();


/*--message--*/
var messageRender = (function () {
    var $message = $(".message"),
        $messageItem = $message.find(".list"),
        $messageList = $messageItem.find("li"),
        $messageKeyBoard = $message.find(".keyBoard"),
        $messageText = $messageKeyBoard.find(".text"),
        $messageSubmit = $messageKeyBoard.find(".submit"),
        messageMusic = $("#messageMusic")[0];

    var step = -1,
        autoTimer = null,
        isTrigger = false,
        historyH = 0;
    //消息列表的运动
    function autoMessage() {
        autoTimer = window.setInterval(function () {
            var $cur = $messageList.eq(++step);
            $cur.css({
                opacity: 1,
                transform: "translateY(0)"
            });
            //move three
            if (step === 2) {
                $cur.on("webkitTransitionEnd", function () {//当前的样式属性两个opacity/transform发生了改变，所事件被触发两次
                    //显示键盘
                    if (isTrigger) return;
                    isTrigger = true;
                    $messageKeyBoard
                        .css("transform", "translateY(0)")
                        .on("webkitTransitionEnd", textPrint);
                });
                window.clearInterval(autoTimer);
                return
            }
            //move four
            if (step >= 3) {
                historyH += -$cur.height();
                $messageItem.css("transform", "translateY( " + historyH + "px)");
            }

            //move end
            if (step === $messageList.length - 1) {
                messageMusic.pause();
                $(messageMusic).remove();
                window.clearInterval(autoTimer);
                window.setTimeout(function () {
                    $message.remove();
                    cubeRender.init();
                }, 1500)
            }

        }, 1500)
    }

    function textPrint() {

        var text = "感觉现在啥也不会啊?",
            n = -1,
            textTimer = null;
        textTimer = window.setInterval(function () {
            $messageText.html($messageText.html() + text[++n]);
            if (n >= text.length - 1) {
                $messageText.html(text);
                $messageSubmit.css("display", "block").tap(bindSubmit);
                window.clearInterval(textTimer);
            }

        }, 100)
    }

    function bindSubmit() {
        $messageText.html("");
        $messageKeyBoard.off("webkitTransitionEnd", textPrint);
        $messageKeyBoard.css("transform", "translateY(3.7rem)");
        autoMessage();
    }

    return {
        init: function () {

            $message.css("display", "block");
            messageMusic.play();
            autoMessage();

        }
    }
})();

/*--cube--*/
/*如果移动端需要实现滑动效果的操作，我们需要阻止IMG和DOCUMENT的默认行为，IMG的默认行为：滑动的时候会拖拽图片产生的虚拟图不是当前元素；DOCUMENT的默认行为：移动端浏览器左右滑动大部分是页卡的切换，我们要阻止这件事情*/
$(document).add($("img")).on("touchmove",function (e) {
    e.preventDefault();
});
var cubeRender = (function () {
    var $cube = $(".cube"),
        $cubeBox = $cube.find(".cubeBox"),
        $cubeList = $cubeBox.find("li");

    function startFn(e) {
        var point = e.changedTouches[0];
        $(this).attr({
            strX: point.pageX,
            strY: point.pageY,
            changeX: 0,
            changeY: 0,
            isMove: false
        });//使用JQ或者ZP存储的自定义属性值都是字符串，及时你写的不是，他也会当做字符串去存储，以后通过Attr方法获取到的结果是字符串。
    }

    function moveFn(e) {
        var point = e.changedTouches[0];
        var changeX = point.pageX - parseFloat($(this).attr("strX")),
            changeY = point.pageY - parseFloat($(this).attr("strY"));
        $(this).attr({
            changeX: changeX,
            changeY: changeY,
            isMove: (Math.abs(changeX) > 10 || Math.abs(changeY) > 10)
        });

    }

    function endFn(e) {
        var isMove = $(this).attr("isMove");
        if (isMove === "false") return;
        var changeX = parseFloat($(this).attr("changeX")),
            changeY = parseFloat($(this).attr("changeY"));
        var rotateX = parseFloat($(this).attr("rotateX")),
            rotateY = parseFloat($(this).attr("rotateY"));
        rotateY+=(changeX/3);
        rotateX-=(changeY/3);

        $(this).css("transform","scale(0.6) rotateY("+rotateY+"deg) rotateX("+rotateX+"deg)").attr({
            rotateX: rotateX,
            rotateY: rotateY, /*随时更新自定义属性，保证下一次滑动基于上一次角度*/
            strX: null,
            strY: null,
            changeX: null,
            changeY: null,
            isMove: null
        })
    }


    return {
        init: function () {
            $cube.css("display", "block");
            //存储当前的旋转角度，下一次基于这个角度再次旋转
            $cubeBox.attr({
                rotateX: 35,
                rotateY: 45
            }).on("touchstart", startFn).on("touchmove", moveFn).on("touchend", endFn);
             //给内一个页面绑定点击事件
            $cubeList.tap(function () {
                $cube.css("display","none");
                $(".swiper-container").css("display","block");
                swiperRender.init($(this).index());
            })

        }
    }

})();
/*--swiper--*/
var swiperRender=(function () {
var $swiperContainer=$(".swiper-container"),
    $return=$swiperContainer.find(".return");


var swiperExcample=null,
    $coursr=$(".course");
    function moveFn(example) {
        console.log("qqqq");
        /*example:回调函数中传递的参数值，代表当前SWIPER的实例*/
        var slideAry=example.slides,/*获取所有活动块*/
            index=example.activeIndex;/*获取当前活动块*/
            if(index===0){
                $coursr.makisu({
                    selector:"dd",
                    overlap:0.6,
                    speed:0.8
                });
                $coursr.makisu("open");
            }else {
                $coursr.makisu({
                    selector:"dd",
                    overlap:0.6,
                    speed:0
                });
                $coursr.makisu("close");
            }
console.log(index);
            $.each(slideAry,function (n,item) {
                    item.id=index===n?"page"+(index+1):null;
            })
    }
    return {
        init:function (index) {
            index=index||0;
            //实现页面切换
            swiperExcample=new Swiper(".swiper-container",{
            effect:"coverflow",
                onInit:moveFn,   /*swiper初始化完成*/
               /*onSlideChangeEnd:moveFn*/ /*切换结束*/
              onTransitionEnd:moveFn
        });
            swiperExcample.slideTo(index,0);/*直接滚到某一个切换卡区域，第一个参数是索引，第二个参数是运动时间*/
            $return.tap(function () {
                $swiperContainer.css("display","none");
                $(".cube").css("display","block");
            })

        }
    }
})();
/*swiperRender.init();*/
/*cubeRender.init();*/
loadingRender.init();


















