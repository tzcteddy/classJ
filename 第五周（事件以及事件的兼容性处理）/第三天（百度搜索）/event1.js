/*
*   1 this 2 顺序 3 重复
* */

// div1.addEventListener('click',fn,false);
// div1.attachEvent('onclick',fn);

function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn);
    }else{
        if(!ele['AAA'+type]){
            ele['AAA'+type] = [];
            ele.attachEvent('on'+type,function (){
                this; // window
                run.call(ele);
            }); // 如何把这个run方法中的this从window处理成ele
        }
        var a = ele['AAA'+type]; // a : [fn1,fn2,fn3,fn4,fn5...]

        for(var i = 0; i < a.length; i++){
            // 这个循环处理的就是重复绑定的问题,如果自定义属性(AAAclick)数组中存在这个即将要绑定的fn,那么就不能把fn添加进去
            if(a[i] === fn){
                return;
            }
        }
        a.push(fn);
    }
}

function run(e){
    e = window.event;
    e.target = e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function (){
        e.returnValue = false;
    }
    e.stopPropagation = function (){
        e.cancelBubble = true;
    }
    //e.type; ele['AAA'+type];
    // 由于这个e.target不够准确，那么我们能不能使用this => 保证这个run方法中的this是ele就可以。所有的函数都在ele的AAA+type自定义属性里
    var a = /*e.target*/this['AAA'+e.type];
    if(a && a.length){
        for(var i = 0; i < a.length; i++){ // a : [fn1,fn2,fn3,fn4..]
            if(typeof a[i] == 'function'){
                a[i].call(/*e.target*/this,e); // 第二个参数e是传给fn1，fn2等函数。这个e是已经处理好兼容问题的
            }else{ // null
                a.splice(i,1); // 如果是null就把当前的这个null删掉,此刻是函数的执行，必须保证每一项都执行过
                i--; // 保证每一项都执行
            }
        }
    }
}


function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn);
    }else{
        // 先获取到AAAclick这个自定义属性数组，然后把数组中的fn函数删除
        var a = ele['AAA'+type]; // AAAclick : [fn1,fn2,fn3,fn4,fn5]
        if(a && a.length){
            for(var i = 0; i < a.length; i++){
                if(a[i] === fn){
                    // 条件符合就是要移除那个函数
                    //a.splice(i,1);
                    a[i] = null; //保证数组不塌陷问题，只要在run按照顺序执行函数的过程中如果调用off方法那么就会导致漏掉函数执行的问题。
                    break;
                }
            }
        }
    }
}


// off(div1,'click',fn5);
//
// on(div1,'click',fn1);  // div1.AAAclick = [fn1]
// on(div1,'click',fn2);  //
// on(div1,'click',fn3);
// on(div1,'click',fn4);
// on(div1,'click',fn5);



function fn1(e){
   e.preventDefault();
}
function fn2(e){
    e = e || window.event;
}

