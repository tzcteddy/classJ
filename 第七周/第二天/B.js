// function fn() {
//     console.log('my name is B');
// }
//
// /*
//  如果代码没有提示，需要在WB中开启NODE的语言提示包
//  File -> Settings -> Languages & Frameworks -> Node.js and Npm -> 点击Enable即可 (需要保证WB是11版本及以上的)
//  */
// var a = require('./A');//->在导入自定义模块的时候需要加上‘ ./ ’才可以
// //var lessc = require('less');
// //var http = require('http');//->在导入已经安装的第三方模块或者NODE的内置模块的时候，不能加./，也不需要指定目录，直接写模块名即可(它自己会先到node_modules中找已经安装的第三方模块，如果没有会到内置中找，如果在没有就报错了)
// a.fn();

var a = require('./A');
function avg() {
    arguments.__proto__ = Array.prototype;
    arguments.sort(function (a, b) {
        return a - b;
    });
    arguments.shift();
    arguments.pop();

    //a.sum(arguments);//->a.sum([...]) 我们想要的把数组中的每一项一个个的传递给SUM
    var total = a.sum.apply(null, arguments);
    return (total / arguments.length).toFixed(2);
}
module.exports = {
    avg: avg
};















