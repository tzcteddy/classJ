var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    /*
     * 静态资源文件请求处理(HTML/CSS/JS/IMG(PNG、JPG、GIF...)/TXT...)
     * - 所有的静态资源文件都有一个共同的特征：都有后缀名,后缀名是由字母和数字组成的
     * - 分析规律得到,服务器端需要查找文件的路径地址只是在pathname前面加一个点即可
     * - 在客户端向我们的服务发送请求的时候,谷歌浏览器会默认请求一个图片"favicon.ico",但是在我们的服务器上是没有这张图片的,所以在使用FS查找内容的时候找不到,导致后台服务报错 =>如果客户端请求的资源文件在服务器上不存在,我们不能终止服务(不能让服务抛异常),只需要返回不存在即可
     * - 在IE浏览器中有问题：服务器端返回给客户端的都是字符串格式的数据(不管是HTML/CSS/JS...)，对于谷歌浏览器来说，它比较的智能，会自动识别当前代码是什么类型的代码，然后进行解析和渲染；但是IE浏览器比较的弱智，不能识别具体的文件类型，都当成字符串了；
     * 解决办法：需要我们在返回数据给客户端的时候，指定当前文件的MIME类型，告诉IE是什么类型的即可
     * MIME
     * HTML -> text/html
     * CSS  -> text/css
     * JS   -> text/javascript
     * PNG  -> image/png
     * ...
     * 每一种资源文件都有自己对应的类型，这些类型统称为MIME
     */
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var conFile = null;
        try {
            conFile = fs.readFileSync('.' + pathname);
        } catch (e) {
            conFile = 'not found~';
        }

        //->根据当前请求资源文件的后缀名,计算出文件的MIME类型
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';//->默认是纯字符串文本的(.txt)
        switch (suffix) {
            case 'HTML':
                suffixMIME = 'text/html';
                break;
            case 'CSS':
                suffixMIME = 'text/css';
                break;
            case 'JS':
                suffixMIME = 'text/javascript';
                break;
        }

        //->在返回数据内容之前指定MIME类型(重写响应头)
        res.writeHead(200, {
            'content-type': suffixMIME + ';charset=utf-8;' //->'text/html;charset=utf-8;'
        });
        res.end(conFile);
    }
});
server.listen(8080, function () {
    console.log('server is success,listening on 8080 port!');
});