// 获取元素
var table = document.getElementById('tab');
var thead = table.tHead; // 获取表格的表头 js对表格的特殊的获取方式 document.body
var theadTr = thead.rows[0]; //获取表头下所有行中的第一行
var theadThs = theadTr.cells; // 表头第一行中的所有列 cells => 单元格
var tbody = table.tBodies[0]; // 所有body中的第一个
var tbodyTrs = tbody.rows; // tbody下所有的行

//通过ajax来获取数据  async... javascript   and   xml  ajax: 是异步的

var xhr = new XMLHttpRequest(); // xhr就是负责到后台获取数据的载体
xhr.open("get","data.txt",false); // post方式  'data.txt'获取数据的接口  同步/异步
xhr.onreadystatechange = function () {
    if(xhr.readyState == 4 && xhr.status == 200){
        // 200 成功
        // 404 页面不存在
        // 502 服务端错误
        // 304 本地缓存
        // 成功返回并且带着数据
        window.data = JSON.parse(xhr.responseText); // 响应文本就是data.txt的内容 =>
    }
}
xhr.send(null); // 出发

//////////////////////////////////////////////////////////////////////////////
console.log(window.data);
if(window.data){
    // data : [{},{},{},{},{country,GDP...}]
    // 查看数组中有多少个对象，只要有一个对象就需要创建一个tr。
    var frg = document.createDocumentFragment();

    for(var i = 0; i < data.length; i++){
        var dataObj = data[i]; // {country : '中国', capital : '北京'...}
        var tr = document.createElement('tr');
        // 向行中添加列
        for(var key in dataObj){
            // key : country, capital ...
            var td = document.createElement('td');
            td.innerHTML = dataObj[key];
            tr.appendChild(td);
        }
        frg.appendChild(tr);
    }
    tbody.appendChild(frg);
    frg = null;
}
// 隔行变色

for(var i=0;i<tbodyTrs.length;i++){
    tbodyTrs[i].className = 'bg' + i%2;
tbodyTrs[i].className = i%2 ? 'bg0' : 'bg1';
    //i%2==0?tbodyTrs[i].className="bg0":tbodyTrs[i].className="bg1";
}






