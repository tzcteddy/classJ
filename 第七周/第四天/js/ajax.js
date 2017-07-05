/*
 * 珠峰培训第一版(基础版本)的AJAX库,参考JQ的AJAX库来封装的
 */
~function () {

    //->验证当前的URL中是否包含问号,包含返回&,否则返回?
    function check(url) {
        return url.indexOf('?') > -1 ? '&' : '?';
    }

    //->把对象转换为字符串
    function formatData(obj) {
        var str = '';
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                str += key + '=' + obj[key] + '&';
            }
        }
        str = str.substring(0, str.length - 1);
        return str;
    }

    function ajax(options) {

        //1、设置参数的默认值
        var _default = {
            url: null,
            method: 'get',
            data: null,
            dataType: 'json',//->text、xml...
            async: true,
            cache: true,
            success: null,
            error: null
        };

        //2、使用传递进来的参数配置值把默认值进行替换
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                //->看类的继承视频,找到写这个判断的原因
                if (key === 'type') {
                    _default['method'] = options['type'];
                    continue;
                }
                _default[key] = options[key];
            }
        }

        //3、发送AJAX请求
        var xhr = new XMLHttpRequest;

        var regGET = /^(get|delete|head)$/i;
        //->3.3：处理DATA
        //对象和字符串的区分,如果是对象需要转换为字符串:xxx=xxx&xxx=xxx...
        //GET和POST的区分,GET是把内容放在问号后面
        if (_default.data !== null) {
            if (typeof _default.data === 'object') {
                _default.data = formatData(_default.data);
            }
            if (regGET.test(_default.method)) {
                char = check(_default.url);
                _default.url += char + _default.data;
                _default.data = null;//->在发送的时候GET请求的请求主体是null
            }
        }

        //->3.2：处理CACHE,如果当前的请求是GET系列的,并且CACHE等于FALSE,我们清除缓存
        if (regGET.test(_default.method) && _default.cache === false) {
            var char = check(_default.url);
            _default.url += char + '_=' + Math.random();
        }

        xhr.open(_default.method, _default.url, _default.async);
        xhr.onreadystatechange = function () {
            if (/^(2|3)\d{2}$/.test(xhr.status)) {
                //->成功
                if (xhr.readyState === 4) {
                    var result = xhr.responseText;
                    //->3.1：我们从服务器端获取的数据一般都是字符串格式的,但是我们传递进来的参数值中的dataType预设了最后数据结果的类型，所以我们还需要自己进行数据的二次加工，把从服务器端获取的字符串转换为预设的结果
                    switch (_default.dataType.toUpperCase()) {
                        case 'JSON':
                            result = 'JSON' in window ? JSON.parse(result) : eval('(' + result + ')');
                            break;
                        case 'XML':
                            result = xhr.responseXML;
                            break;
                    }
                    _default.success && _default.success.call(xhr, result);
                }
                //->面试题：JQ中的dataType是否影响了服务器的返回结果? 不影响,服务器端会根据产品需求给我们返回字符串或者XML数据,而JQ会根据我们设置的dataType值,把返回的结果二次解析成需要的类型
                return;
            }
            //->失败:执行ERROR的回调函数,让函数中的THIS指向当前实例XHR,并且把错误信息传递给回调函数
            //typeof _default.error === 'function' ? _default.error.call(xhr, xhr.responseText) : null;
            _default.error && _default.error.call(xhr, xhr.responseText);//->这种写法和上面的相同,都是在判断只有传递了回调函数的情况下才会执行(项目中一般都这么写)
        };
        xhr.send(_default.data);
    }

    window.ajax = ajax;
}();