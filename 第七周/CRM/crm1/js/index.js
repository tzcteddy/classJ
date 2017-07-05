    var List= document.getElementById("list");



ajax({
    url:"/getAllList",
    method:"get",
    cache:false,
    dataType:"json",
    success:function (result) {
        if(result&&result.code===0)
            console.log(result);
            var result=result.data;
            var str=``;
            for(var i=0;i<result.length;i++){
                var cur=result[i];
                str+=`<li>
            <span>${cur.id}</span>
            <span>${cur.name}</span>
            <span>${cur.age}</span>
            <span><a href="detail.html?id=${cur.id}">修改</a>|<a href="javascript:;" data-id="${cur.id}">删除</a></span>
        </li>`
            }
          List .innerHTML=str;
        }

});

List.onclick=function (e) {
    var e=e||window.event;
    var tag=e.target||e.srcElement;
    if(tag.tagName.toUpperCase()=="A"&&tag.innerHTML=="删除"){
        var curId=tag.getAttribute("data-id");
        var flag=window.confirm("确认要删除【编号为"+curId+"】的用户吗？");
        if(flag){
            ajax({
                url:"/removeInfo",
                method:"get",
                data:{id:curId},
                cache:false,
                success:function (result) {
                    if(result&&result.code===0){
                        List.removeChild(tag.parentNode.parentNode);
                        alert("删除成功")
                    }else {alert("删除失败")}

                }
            })
        }
    }

};
