
var uitls = {
    toArray : function (likeAry){

        try{
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary = [];
            for(var i = 0 ; i < likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    },
    jsonParse : function (jsonStr){

        return "JSON" in window ? JSON.parse(jsonStr) : eval('('+jsonStr+')');
    },
    getRandom : function (n,m){

        if(isNaN(n)||isNaN(m)){
            return Math.random();
        }
        return Math.round(Math.random()*(m-n)+n);
    },
    prev : function (ele){

        var prev = ele.previousSibling; // comment text  element
        while ( prev && prev.nodeType != 1){
            prev = prev.previousSibling;
        }
        return prev;
    },
    next : function (ele){

        if("previousElementSibling" in ele){
            return ele.previousElementSibling;
        }
        var next = ele.nextSibling;
        while (next && next.nodeType != 1){
            next = next.nextSibling;
        }
        return next;
    },
    children : function (ele,tagName){
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
};



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

            if("previousElementSibling" in ele){
                return ele.previousElementSibling;
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

    return {
        setCss : setCss,
        getCss : getCss,
        offset : offset,
        win : win,
        toArray : toArray,
        jsonParse : jsonParse,
        getRandom : getRandom,
        prev : prev,
        next : next,
        children : children
    };

})();








