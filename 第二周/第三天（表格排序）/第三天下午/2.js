/**
 * v
 * Created by lucky on 2017/1/5.
 */
var i = 5;
function fn(){
    var i = 0;
    return function (){
        console.log(++i);
    }
}
var f = fn();
f(); // 1
f(); // 2
f(); // 3

