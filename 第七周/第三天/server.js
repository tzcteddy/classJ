var http = require('http'),
    url = require('url'),
    fs = require('fs');
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true),
        pathname = urlObj.pathname,
        query = urlObj.query;

    //->客户端静态资源文件请求的处理
    var reg = /\.([0-9a-zA-Z]+)/i;
    if (reg.test(pathname)) {
        var conFile = null,
            status = 200;
        try {
            conFile = fs.readFileSync('.' + pathname);
        } catch (e) {
            conFile = 'not found~';
            status = 404;
        }
        var suffix = reg.exec(pathname)[1].toUpperCase(),
            suffixMIME = 'text/plain';
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
        res.writeHead(status, {
            'content-type': suffixMIME + ';charset=utf-8;'
        });
        res.end(conFile);
    }
});
server.listen(8080);