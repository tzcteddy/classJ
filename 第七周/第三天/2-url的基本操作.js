var url = require('url');
var str = "http://www.zhufengpeixun.cn:80/school/login.html?a=12&b=13#c";
//console.log(url.parse(str));
/*
 Url {
 protocol: 'http:', //->传输协议
 slashes: true, //->是否有斜线
 auth: null,
 host: 'www.zhufengpeixun.cn:80', //->域名+端口号
 port: '80', //->端口号
 hostname: 'www.zhufengpeixun.cn', //->域名
 hash: '#c', //->哈希值
 search: '?a=12&b=13', //->问号传参(string)带着问号
 query: 'a=12&b=13', //->问号传参(string)不带着问号
 pathname: '/school/login.html', //->资源文件的路径和名称
 path: '/school/login.html?a=12&b=13', //->pathname+search
 href: 'http://www.zhufengpeixun.cn:80/school/login.html?a=12&b=13#c' //->原始解析的URL地址
 }
 */

console.log(url.parse(str, true));
/*
 Url {
 ...
 query: { a: '12', b: '13' }, //->第二个参数传递TRUE,会把问号传递参数的值进行解析,以对象的方式来存储
 pathname: '/school/login.html',
 ...
 }
 */
