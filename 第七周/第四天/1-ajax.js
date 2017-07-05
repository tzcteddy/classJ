//->创建AJAX对象
var xhr = new XMLHttpRequest();//->在IE6及更低版本浏览器中不兼容new ActiveXObject

//->打开一个URL地址(配置请求的基本参数信息)
//[请求方式]：get delete head post put...
//[请求的URL地址]
//[同步或者异步]：默认值是true代表异步编程,false同步编程
//设置请求的用户名密码:提供安全权限的验证(一般不用)
xhr.open('get', 'temp.xml?name=zf', true);

xhr.setRequestHeader('key', 'value');//->设置请求头:客户端可以把一些要传递给服务器的内容通过请求头传递过去

//->监听AJAX状态的改变,获取到服务器返回的数据
xhr.onreadystatechange = function () {
    //->xhr.readyState:AJAX的状态 0 1 2 3 4
    //->xhr.status：服务器返回的网络状态码,不同的状态码代表了服务器返回的不同结果 200 301 302 304 400 401 404 500 503...
    if (xhr.readyState === 4 && xhr.status === 200) {
        //xhr.responseText ->获取服务器端响应主体内容,也就是把服务器返回的内容获取到,获取到的结果是一个字符串
        //xhr.responseXML ->和上面一样都是获取响应主体内容,只不过获取的格式是XML格式的数据

        //->获取响应头的两种方式
        //xhr.getResponseHeader('key')
        //xhr.getAllResponseHeaders()
    }
};

//->发送请求：括号中传递的内容就是客户端通过请求主体把内容传递给服务器
xhr.send(null);
