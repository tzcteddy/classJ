


var utils = (function (){
    function toArray(likeAry){

        try{
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary = [];
            for(var i = 0 ; i < likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    }
    function jsonParse(jsonStr){

            return "JSON" in window ? JSON.parse(jsonStr) : eval('('+jsonStr+')');
        }
    function getRandom(n,m){

            if(isNaN(n)||isNaN(m)){
                return Math.random();
            }
            return Math.round(Math.random()*(m-n)+n);
        }
    function prev(ele){

            var prev = ele.previousSibling; // comment text  element
            while ( prev && prev.nodeType != 1){
                prev = prev.previousSibling;
            }
            return prev;
        }
    function next(ele){
            if("nextElementSibling" in ele){
                return ele.nextElementSibling;
            }
            var next = ele.nextSibling;
            while (next && next.nodeType != 1){
                next = next.nextSibling;
            }
            return next;
        }
    function children(ele,tagName){
            var childs = ele.childNodes;
            var ary = [];
            for(var i = 0; i < childs.length; i++){
                if(childs[i].nodeType == 1){
                    ary.push(childs[i]);
                }
            }

            if(typeof tagName == "string"){
                for( i = 0; i < ary.length; i++ ){
                    // 'SPAN'  'DIV'
                    if(ary[i].nodeName !== tagName.toUpperCase()){
                        ary.splice(i,1);
                        i--;
                    }
                }
            }
            return ary;
        }
    function win(attr,val){
        if(typeof val !== 'undefined'){
            document.documentElement[attr] = val;
            document.body[attr] = val;
            return;
        }
        return document.documentElement[attr] || document.body[attr];
    }
    function offset(ele){
        var l = 0,t = 0;
        l += ele.offsetLeft;
        t += ele.offsetTop;
        var par = ele.offsetParent;
        while (par){
            if(window.navigator.userAgent.indexOf('MSIE 8') === -1){
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left : l, top : t};
    }

    function getElesByClass(className,context){
        context = context || document;
        if(context.getElementsByClassName){
            return context.getElementsByClassName(className);
        }
        // for IE8-
        var classNameAry = className.replace(/(^ +| +$)/g,'').split(/ +/);
        // [c1,c2]
        var tags = context.getElementsByTagName('*');
        var ary = [];
        for(var i = 0; i < tags.length; i++){
            var curTag = tags[i];
            var tagIsOk = true;
            for(var j = 0; j < classNameAry.length; j++){
                var reg = new RegExp("(^| +)" + classNameAry[j] + "( +|$)");
                if(!reg.test(curTag.className)){
                    tagIsOk = false;
                    break;
                }
            }
            if(tagIsOk){
                ary.push(curTag);
            }
        }
        return ary;

    }
    function hasClass(ele,className){
        var reg = new RegExp('(^| +)'+className+'( +|$)');
        return reg.test(ele.className);
    }
    function addClass(ele,className){
        var classNameAry = className.replace(/(^ +| +$)/g,'').split(/ +/);
        for(var i = 0; i < classNameAry.length; i++){
            var curClass = classNameAry[i];
            if(!hasClass(ele,curClass)){
                ele.className += ' ' + curClass;
            }
        }
    }
    function removeClass(ele,className){
        var classNameAry = className.replace(/(^ +| +$)/g,'').split(/ +/);
        for(var i = 0; i < classNameAry.length; i++){
            var curClass = classNameAry[i];
            var reg = new RegExp("(^| +)" + curClass + "( +|$)","g");
            ele.className = ele.className.replace(reg,' ');
        }
    }
    function toggleClass(ele,className){
        if(hasClass(ele,className)){
            removeClass(ele,className)
        }else{
            addClass(ele,className)
        }
    }
    function prevAll(ele){
        var ary = [];
        var pre = prev(ele);
        while (pre){
            ary.unshift(pre);
            pre = prev(pre);
        }
        return ary;
    }
    function nextAll(ele){
        var ary = [];
        var nex = next(ele);
        while (nex){
            ary.push(nex);
            nex = next(nex);
        }
        return ary;
    }
    function siblings(ele){
        return prevAll(ele).concat(nextAll(ele));
    }
    function sibling(ele){
        var ary = [];
        var pre = prev(ele);
        var nex = next(ele);
        pre && ary.push(pre);
        nex && ary.push(nex);
        return ary;
    }
    function index(ele){
        return prevAll(ele).length;
    }



    function getCss(ele,attr){
        var val = null;
        if(window.getComputedStyle){
            val = window.getComputedStyle(ele)[attr];
        }else{
            if(attr == 'opacity'){
                val = ele.currentStyle.filter;
                var reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = ele.currentStyle[attr];
            }
        }
        // -5.5px
        var reg = /^-?\d+(\.\d+)?(px|pt|em|rem|deg)?$/;
        return reg.test(val) ? parseFloat(val) : val;
    }
    function setCss(ele,attr,val){
        if(attr == 'opacity'){
            ele.style.opacity = val;
            ele.style.filter = 'alpha(opacity='+ val*100 + ')';
            return;
        }
        if(attr == 'float'){
            ele.style.cssFloat = val;
            ele.style.styleFloat = val;
            return;
        }
        var reg = /^(width|height|left|top|right|bottom|(margin|padding)(Left|Top|Right|Bottom)?)$/;
        if(reg.test(attr)){
            if(!isNaN(val)){
                val += 'px';
            }
        }
        ele.style[attr] = val;
    }
    function setGroupCss(ele,obj){
        for(var key in obj){
            setCss(ele,key,obj[key]);
        }
    }
    function css(ele){
        // 根据参数的不同来处理不同的逻辑
        var secondParam = arguments[1];
        var thirdParam = arguments[2];
        if(typeof secondParam == 'string'){
            if(typeof thirdParam == 'undefined'){
                return getCss.call(ele,secondParam);
            }
            setCss(ele,secondParam,thirdParam);
        }
        // 只有{}对象返回[object Object]的字符串
        if(Object.prototype.toString.call(secondParam) == '[object Object]'){
            setGroupCss(ele,secondParam);
        }
    }

    return {

        hasClass : hasClass,
        addClass : addClass,
        removeClass : removeClass,
        toggleClass : toggleClass,
        prevAll : prevAll,
        nextAll : nextAll,
        sibling : sibling,
        siblings : siblings,
        index : index,

        getCss : getCss,
        setCss : setCss,
        setGroupCss : setGroupCss,
        css : css,

        offset : offset,
        win : win,
        toArray : toArray,
        jsonParse : jsonParse,
        getRandom : getRandom,
        prev : prev,
        next : next,
        children : children,
        getElesByClass : getElesByClass
    };

})();

// utils.getCss(div1,'width');
// utils.setCss(div1,'width',100);
// utils.setGroupCss(div1,{width : 100,height : 100});
// // 如果第二个参数是一个字符串要么是获取/设置 => 如果存在第三个就是设置
// // 如果第二个参数是一个对象 => 设置一组属性
// utils.css(ele);
// function setCss(/*ele,*/attr,val){
//     this.style[attr] = val;
// }
// //HTMLDivElement => HTMLElement => Element => Node;
// //HTMLParagraphElement;
// Element.prototype.setCss = setCss;
// p.setCss('width',100);
// div1.setCss('width',100);
// span.setCss();




