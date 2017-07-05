// 获取元素
var table = document.getElementById('tab');
var ths = table.tHead.rows[0].cells;
var tbody = table.tBodies[0];

var tbodytrs = tbody.rows;

// 获取数据
//var data = null;
;(function (){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','data.txt',false);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200){
            data = JSON.parse(xhr.responseText);
        }
    }
    xhr.send();
})();

console.log(data);


// 绑定
;(function (){
    if(data){
        var frg = document.createDocumentFragment();
        for(var i = 0; i < data.length; i++){
            var dataObj = data[i]; // {gdp : 5,develoted : 0}
            var tr = document.createElement('tr');
            for(var key in dataObj){
                // gdp...
                var td = document.createElement('td');
                td.innerHTML = key === 'developed' ? dataObj[key] == 0 ? "发展中" : "发达" : dataObj[key];
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tbody.appendChild(frg);
        frg = null;
    }
})();
// 验证页面中是否已经出现tr



//隔行变色
changeBg();
function changeBg(){
    for(var i = 0; i < tbodytrs.length; i++){
        tbodytrs[i].className = 'bg' + i%2;
    }
}

// 给表头列绑定事件
;(function bindEventForThs(){
    for(var i = 0; i < ths.length; i++){
        ths[i].index = i;
        ths[i].sortFlag = -1;
        if(ths[i].className == 'pointer'){
            ths[i].onclick = function (){
                // 点击事件触发的时刻 => 排序
                sort.call(this,this.index);
                changeBg();
            }
        }
    }
})();

// 排序方法  1 获取要排序的dom元素  2 转化成数组  3 排序  4 回填
function sort(n){
    for(var i = 0; i < ths.length; i++){
        if(ths[i] !== this){
            ths[i].sortFlag = -1;
        }
    }
    // 1
    // 2
    var tbodytrsAry = Array.prototype.slice.call(tbodytrs);
    // [tr,tr,tr,tr]
    // 3
    var that = this;
    that.sortFlag *= -1;
    tbodytrsAry.sort(function (tr1,tr2){
        var a = tr1.cells[/*2*/n].innerHTML;
        var b = tr2.cells[/*2*/n].innerHTML;
        if(isNaN(a) || isNaN(b)){
            return (a.localeCompare(b))*that.sortFlag;
        }
        return  (a - b)*that.sortFlag;
    });
    // 4
    var frg = document.createDocumentFragment();
    for(var i = 0; i < tbodytrsAry.length; i++){
        frg.appendChild(tbodytrsAry[i]);
    }
    tbody.appendChild(frg);
    frg = null;
}



function toArray(){
    //....
}
function jsonParse(){
    //...

}


