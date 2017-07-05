var utils = {
    toArray : function (likeAry){
        try{
            return [1]/*.__proto__*/.slice.call(likeAry);
            return Array.prototype.slice.call(likeAry,0);
        }catch(e){
            var ary = [];
            for(var i = 0 ;i < likeAry.length; i++){
                ary.push(likeAry[i]);
            }
            return ary;
        }
    },
    jsonParse : function (jsonstr){
        return "JSON" in window ? JSON.parse(jsonstr): eval("("+jsonstr+')');
    }
};