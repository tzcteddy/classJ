var content = document.getElementById('content');

//->刚开始加载页面的时候,我们使用AJAX技术向服务器发送请求,获取所有的客户信息；获取到信息后，使用ES6中的模板字符串，把所有的客户信息绑定在页面上。
ajax({
    url: '/getAllList',
    method: 'get',
    dataType: 'json',
    cache: false,
    success: function (result) {
        if (result && result.code == 0) {
            //->成功后,把获取的数据展示在页面中(ES6中的字符串模板)
            result = result.data;

            var str = ``;//->反引号而不是单引号
            for (var i = 0, len = result.length; i < len; i++) {
                var cur = result[i];
                str += `<li>
                    <span>${cur.id}</span>
                    <span>${cur.name}</span>
                    <span>
                        <a href="detail.html?id=${cur.id}">修改</a>
                        <a href="javascript:;" data-id="${cur.id}">删除</a>
                    </span>
                </li>`;
            }
            content.innerHTML = str;
        }
    }
});

//->采用事件委托实现删除按钮的点击操作
content.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement;
    //->删除
    if (tar.tagName.toUpperCase() === 'A' && tar.innerHTML === '删除') {
        /*
         * JS中浏览器常用的弹出框:
         * - alert([content])：提示框,只有确定按钮
         * - confirm([content])：确认提示框，里面既有确定按钮也有取消按钮，我们可以定义一个变量来接收它的返回值，返回值为TRUE说明点击的是确定
         * - prompt([content])：在confirm基础上可以填写原因，填写的内容可以用变量接收
         */
        var customId = tar.getAttribute('data-id'),
            flag = window.confirm('确定要删除客户编号为 [ ' + customId + ' ] 的信息吗?');
        if (flag) {
            ajax({
                url: '/removeInfo',
                data: {
                    id: customId
                },
                cache: false,
                success: function (result) {
                    if (result && result.code == 0) {
                        alert('亲，恭喜删除成功了！');
                        //->此时只是后台把服务器上存储的数据删除了,我们还需要自己把容器中的元素也移除掉才可以(移除当前事件源的爷爷->LI一行信息)
                        content.removeChild(tar.parentNode.parentNode);
                    } else {
                        alert('亲，很遗憾删除失败！');
                    }
                }
            });
        }
    }
};

/*
 * 自定义属性：它是整个JS编程中最伟大的思想，只要是后续的某一个操作需要用到之前的一个值，我们就在之前把这个值用自定义属性存储起来，后期需要直接的获取即可
 * 自定义属性约定俗称的起名规范：data-xxx
 */