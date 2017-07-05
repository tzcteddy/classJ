/**
 * Created by Administrator on 2017/3/6.
 */
var List = document.getElementById("list");
ajax({
    url: "/getAllList",
    method: "get",
    cache: false,
    success: function (result) {
        if (result && result.code === 0) {
            var str = ``;
            var resultData = result.data;
            for (var i = 0; i < resultData.length; i++) {
                var cur=resultData[i];
                str += `<li>
        <span>${cur.id}</span>
        <span>${cur.name}</span>
        <span>${cur.age}</span>
        <span><a href="detail.html?id=${cur.id}">修改</a>|<a href="" data-id="${cur.id}">删除</a></span></li>`

            }
            List.innerHTML=str;
        }
    }
});
List.onclick=function (e) {
    var e=e||window.event,
        tag=e.target||e.srcElement;
    customId=tag.getAttribute("data-id");
    if(tag.tagName.toUpperCase()==="A"&&tag.innerHTML==="删除"){
        var flag=window.confirm("您确定要删除【编号为"+customId+"】的用户吗？");
        if(flag){
            ajax({
                url:"/removeInfo",
                method:"get",
                cache:false,
                data:{id:customId},
                success:function (result) {
                    if(result&&result.code===0){
                        alert("删除成功");
                        List.removeChild(tag.parentNode.parentNode);

                    }else {alert("删除失败");}
                }
            })
        }
    }
}