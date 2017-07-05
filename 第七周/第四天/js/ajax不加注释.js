/*
 * 珠峰培训第一版(基础版本)的AJAX库,参考JQ的AJAX库来封装的
 */
~function () {
    function check(url) {
        return url.indexOf('?') > -1 ? '&' : '?';
    }

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
        var _default = {
            url: null,
            method: 'get',
            data: null,
            dataType: 'json',
            async: true,
            cache: true,
            success: null,
            error: null
        };
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                if (key === 'type') {
                    _default['method'] = options['type'];
                    continue;
                }
                _default[key] = options[key];
            }
        }
        var xhr = new XMLHttpRequest;
        var regGET = /^(get|delete|head)$/i;
        if (_default.data !== null) {
            if (typeof _default.data === 'object') {
                _default.data = formatData(_default.data);
            }
            if (regGET.test(_default.method)) {
                char = check(_default.url);
                _default.url += char + _default.data;
                _default.data = null;
            }
        }
        if (regGET.test(_default.method) && _default.cache === false) {
            var char = check(_default.url);
            _default.url += char + '_=' + Math.random();
        }
        xhr.open(_default.method, _default.url, _default.async);
        xhr.onreadystatechange = function () {
            if (/^(2|3)\d{2}$/.test(xhr.status)) {
                if (xhr.readyState === 4) {
                    var result = xhr.responseText;
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
                return;
            }
            _default.error && _default.error.call(xhr, xhr.responseText);
        };
        xhr.send(_default.data);
    }

    window.ajax = ajax;
}();