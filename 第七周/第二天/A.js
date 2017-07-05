// function fn() {
//     console.log('my name is A');
// }
//
// //->把A模块中可以供其它模块调取使用的方法导出，只有这样其它的模块才可以调用
// module.exports = {
//     fn: fn
// };

/*
 A -> sum：任意数求和
 B -> avg：求任意几个数的平均数 (先求和在除以个数) ->调取A中的SUM
 C -> 调取B中的AVG实现获取 12,23,34,45,56,67,78,89 这几个数的平均数
 */

function sum() {
    var total = null;
    //->arguments.forEach 不能直接调取数组的方法
    // Array.prototype.forEach.call(arguments, function (item, index) {
    //     item = Number(item);
    //     !isNaN(item) ? total += item : null;
    // });

    //->周氏继承法,让ARG指向Array.prototype,这样ARG就可以调取数组中的方法了(__proto__在IE下不兼容,但是在NODE环境下可以放心使用)
    arguments.__proto__ = Array.prototype;
    arguments.forEach(function (item, index) {
        item = Number(item);
        !isNaN(item) ? total += item : null;
    });
    return total;
}
module.exports = {
    sum: sum
};










