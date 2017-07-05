/*解析URL地址中问号后面的参数值(***************....)*/
String.prototype.myQueryURLParameter = function () {
    //this->我们要处理的这个字符串
    var reg = /([^?&=#]+)=([^?&=#]+)/g,
        obj = {};
    this.replace(reg, function () {
        obj[arguments[1]] = arguments[2];
    });
    return obj;
};

var userName = document.getElementById('userName'),
    submit = document.getElementById('submit');

/*
 * 点击修改的时候也会跳转到详情DETAIL页面,增加也是这个页面,我们需要区分是增加还是修改?而且我们还需要知道修改的是谁? =>跳转到详情页面使用URL问号传参,如果是修改,把需要修改的客户ID传递过来，这样在加载页面的时候，我们只需要获取这个ID
 * - 如果获取到了就是修改，如果没有获取到就是增加
 * - 通过获取的ID区分展示对应的客户信息，点击提交的时候也知道了要修改的是谁了
 */
//->window.location.href:在不设置值的情况下属于获取当前页面的URL地址
var urlObj = window.location.href.myQueryURLParameter(),
    customId = urlObj['id'];
if (typeof customId !== 'undefined') {
    //->修改：从服务器获取当前客户的信息,把用户名展示在文本框中
    ajax({
        url: '/getInfo',
        data: {
            id: customId
        },
        cache: false,
        success: function (result) {
            if (result && result.code == 0) {
                result = result['data'];
                userName.value = result['name'];
            }
        }
    });
}


/*
 * 给提交按钮绑定点击事件，当点击按钮的时候，完成以下的事情：
 * [增加]
 * 1、获取文本框中的内容
 * 2、按照API接口文档的要求,向服务器发送请求
 * 3、接收服务器返回的结果，给予客户相关的提示即可
 */
submit.onclick = function () {
    var value = userName.value;//->获取INPUT文本框中的内容

    //->UPDATE
    if (typeof customId !== 'undefined') {
        ajax({
            url: '/updateInfo',
            method: 'POST',
            data: {
                id: customId,
                name: value
            },
            success: function (result) {
                if (result && result.code == 0) {
                    alert('亲，恭喜修改成功啦！');
                    window.location.href = 'index.html';
                } else {
                    alert('亲，很遗憾修改失败！');
                }
            }
        });
        return;
    }

    //->ADD
    ajax({
        url: '/addInfo',
        method: 'POST',
        dataType: 'JSON',
        data: {
            name: value //->我们自己的AJAX库,如果DATA是个对象,会默认转换为字符串‘xxx=xxx&xxx=xxx...’
        },
        success: function (result) {
            if (result && result.code == 0) {
                alert('亲，增加成功了哦!');
                //->跳转回到首页面:JS页面跳转 window.location.href='xxx/xxx.html' 这样就跳转到了指定路径下的某一个页面
                window.location.href = 'index.html';
            } else {
                alert('亲，很遗憾失败了!');
            }
        }
    });
};
