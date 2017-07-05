function on(ele, type, fn) {
    if (ele.addEventListener) {
        ele.addEventListener(type, fn);
    } else { // ie8-
        if (!ele['AAA' + type]) {
            ele['AAA' + type] = [];
            ele.attachEvent('on' + type, run);
        }
        ele['AAA' + type].push(fn);
    }
}
function run(e) {
    e = window.event;
    e.target = e.srcElement;
    e.type;
    var a = e.target['AAA' + e.type];
    if (a && a.length) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] == 'function') {
                a[i].call(e.target);
            }
        }
    }
}

on(div1, 'click', fn1); //
on(div1, 'click', fn2); //
on(div1, 'click', fn3); //