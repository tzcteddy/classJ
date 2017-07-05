//->导入需要的内置模块
var http = require('http'),
    url = require('url'),
    fs = require('fs');

//->创建服务监听端口
var server = http.createServer(function (req, res) {
    //->解析客户端请求的地址和传递的内容
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->如果客户端想要的是INDEX.HTML,我们需要获取到页面中的代码,并且返回给客户端
    if (pathname === '/index.html') {
        var conFile = fs.readFileSync('./index.html');

        res.end(conFile);//->如果只需要返回一次内容,可以合并在一起来写,返回的同时也告诉客户端返回结束了
    }

    if (pathname === '/css/index.css') {
        conFile = fs.readFileSync('./css/index.css');
        res.end(conFile);
    }

});
server.listen(8080, function () {
    console.log('server is success,listening on 8080 port!');
});