/**
 * Created by Administrator on 2017/3/6.
 */
String.prototype.change=function () {
    var reg=/([^#&?=]+)=([^#&?=]+)/g;
    var obj={};
    this.replace(reg,function () {
        obj[arguments[1]]=arguments[2];
    });
    return obj;
};
var submit=document.getElementById("submit"),
    userName=document.getElementById("userName"),
    userAge=document.getElementById("userAge");
var urlObj=window.location.href.change();
var customId=urlObj["id"];
if(typeof customId!=="undefined"){
    ajax({
        url:"/getInfo",
        method:"get",
        cache:false,
        data:{id:customId},
        success:function (result) {
            if(result&&result.code===0){
                var resultData=result.data;
                userName.value=resultData.name;
                userAge.value=resultData.age;
            }
        }
    })
}


submit.onclick=function () {
    if(typeof customId!=="undefined"){
        ajax({
            url:"/updataInfo",
            method:"post",
            data:{id:customId,name:userName.value,age:userAge.value},
            success:function (result) {
                if(result&&result.code===0){
                    alert("修改成功");
                    window.location.href="index.html";
                }else {alert("修改失败");}
            }
        });
        return;
    }
    ajax({
        url:"/addInfo",
        method:"post",
        data:{name:userName.value,age:userAge.value},
        success:function (result) {
            if(result&&result.code===0){
                alert("添加成功");
                window.location.href="index.html";
            }else {alert("添加失败");}
        }
    })
}