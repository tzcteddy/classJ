var http = require('http'),
    url = require('url'),
    fs = require('fs');

//->默认遵循的是HTTP传输协议
var server = http.createServer(function (req, res) {
    //->此处的回调函数不是当服务创建成功就会被执行的,而是需要等到客户端向当前的服务(8080)发送请求的时候，回调函数才会被触发执行，而且发送一次请求就会被触发执行一次，在这个回调函数中我们需要完成每一次请求的：接收解析、资源查找、源代码返回等操作
    /*
     * 客户端(浏览器)如何的向当前的服务发送请求?
     * - http://localhost:8080/
     *   向本地8080端口对应的服务发送请求(localhost:本地服务)
     *
     * - http://本机的IP地址:8080/
     *   通过服务器的IP地址(外网IP、局域网IP)向当前这台主机的8080服务发送请求，真实项目中肯定是通过域名访问的
     */

    /*
     * 不仅仅触发回调函数执行,而且默认还传递了两个参数值进来
     * - req：request 请求对象,里面有很多的属性和方法,存储了客户端的全部请求信息
     *  + req.url：存储的是客户端请求的资源文件的路径名称以及问号传递参数的值,例如：/css/index.css?name=zxt&age=27 (字符串)
     *
     * - res：response 响应对象,里面提供了很多的方法,可以供服务器端把源代码返回给客户端
     *  + res.write([content])：向客户端响应内容(响应的内容是字符串格式的)
     *  + res.end()：结束向客户端的响应
     *  + res.writeHead：重写响应头
     */

    //->通过REQ.URL获取到客户端请求的地址,在使用URL.PARSE进行解析,最后得到我们想要的内容
    //- pathname:客户端请求资源文件的路径和名称
    //- query:存储的是客户端通过问号传参的方式传递给服务器的内容
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    if (pathname === '/index.html') {
        //->客户端想要请求的是index.html,我们需要获取这个文件中的源代码(I/O),并且把源代码返回
        var conFile = fs.readFileSync('./index.html');

        //->基于参数RES中提供的方法,把内容返回给客户端
        res.write(conFile);
        res.end();//->END必须加
    }

});

//->给当前服务监听端口(0~65535),需要保持端口的唯一性
server.listen(8080, function () {
    //->当服务创建成功并且端口号监听成功后，就会执行这个回调函数，我们一般会在这里面输出一句话，提示开发者创建成功!
    console.log('server is success,listening on 8080 port!');
});

