/**
 * Created by Administrator on 2017/3/6.
 */

;(function () {
    function check(url) {
        return url.indexOf("?")>-1?"&":"?";
    }
    function change(obj) {
        var str="";
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                str+=key+"="+obj[key]+"&";
            }
        }
        return str=str.substring(0, str.length-1);
    }




    function ajax(options) {
        var _default={
            url:null,
            method:"get",
            async:true,
            cache:true,
            data:null,
            dataType:"json",
            success:null,
            error:null
        };
        for(var key in options){
            if(options.hasOwnProperty(key)){
                if(key==="type"){
                    _default["method"]=options["type"];
                    continue;
                }
                _default[key]=options[key]
            }
        }


        var reg=/^(get|head|delete)$/i;
        if(_default.data&&typeof _default.data==="object"){
            _default.data=change(_default.data);
            if(reg.test(_default.method)){
                _default.url+=check(_default.url)+_default.data;
                console.log(_default.url);
                _default.data=null;
            }
            if(reg.test(_default.method)&&_default.cache===false){
                _default.url+=check(_default.url)+"_="+Math.random();
                console.log(_default.url);
            }
        }


        var xhr=new XMLHttpRequest();
        xhr.open(_default.method,_default.url,_default.async);
        xhr.onreadystatechange=function () {
            if(/^(2|3)\d{2}$/.test(xhr.status)){
                if(xhr.readyState===4){
                    var result=xhr.responseText;
                    switch (_default.dataType.toUpperCase()){
                        case "JSON":
                            result="JSON" in window?JSON.parse(result):eval("("+result+")");
                            break;
                        case "XML":
                            result=xhr.responseXML;
                    }
                    _default.success&&_default.success.call(xhr,result);
                }
            }_default.error&&_default.error.call(xhr,xhr.responseText);
        };
        xhr.send(_default.data);








    }



    window.ajax=ajax;
})();