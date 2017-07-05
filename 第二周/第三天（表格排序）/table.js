// 获取元素
var table = document.getElementById('tab');
var ths = table.tHead.rows[0].cells; // 所有的表头列
var tbody = table.tBodies[0];
var tbodytrs = tbody.rows; // tbody下的所有行

// 获取数据

;(function getData(){
    var xhr = new XMLHttpRequest();
    xhr.open('get','data.txt',false);
    xhr.onreadystatechange = function (){
        if(xhr.readyState == 4 && xhr.status == 200){
            window.data = JSON.parse(xhr.responseText);
        }
    };
    xhr.send(null);
})();

console.log(data);
// 数据绑定
;(function dataBind(){
    // [{country}]
    if(window.data){
        var frg = document.createDocumentFragment();
        for(var i = 0; i<data.length; i++){
            var tr = document.createElement('tr');
            for(var key in data[i]){
                var td = document.createElement('td');
                key; // country,capital,population,gdp,developed
                // if(key === 'developed'){
                //     // 先判断是否是develop属性，然后再判断属性值是否是0
                //     if(data[i][key] == 0){
                //         // 发展中
                //         td.innerHTML = '发展中';
                //     }else{
                //         td.innerHTML = '发达';
                //     }
                // }else{
                //     td.innerHTML = data[i][key];
                // }
                td.innerHTML =  key === 'developed' ? data[i][key] == 0 ? '发展中' :  '发达'        :  data[i][key]
                tr.appendChild(td);
            }
            frg.appendChild(tr);
        }
        tbody.appendChild(frg);
        frg = null;
    }
})();

function changeBg(){
    for(var i = 0; i< tbodytrs.length; i++){
        tbodytrs[i].className = i%2 ? 'bg0' : 'bg1';
    }
}
changeBg();

// bindEvent 绑定事件 给所有的表头绑定点击事件
;(function bindEventForThs(){
    for(var i = 0; i < ths.length; i++){
        ths[i].index = i; // 给每一个表头列都添加一个自定义属性，保存自己的索引值
        ths[i].sortFlag = -1; // 每一个表头列都存在一个自定义属性-1
        if(ths[i].className == 'pointer'){
            // 如果存在这个pointer类样式才绑定点击事件
            ths[i].onclick = function (){
                // console.log(this); // 点击的那个表头列
                // 点击那一列就按照哪一列去排序
                //tbodytrsSort(2); // 点击时刻才执行这个排序动作
                tbodytrsSort.call(this,this.index); // 点击时刻才执行这个排序动作

                changeBg(); //隔行变色
                //this; // 点击的那一列，人口 ： index => 2   GDP : index => 3
                //this.index; // 0,1,2,3,4
                this.sortFlag; // 无论点击哪一列都存在这么一个属性
            }
        }
    }
})();
// 1 先获取到要排序的tbody => trs 2 转化成数组  3 数组之后就可以排序了  4 排序之后回填

function tbodytrsSort(n){
    // this ?? window
    // this => th 点击的那一列的表头，表头存在一个sortFlag = -1
    // this 换成事件发生时刻的this
    this; // 正在点击那个。=> 除了this之外的表头列ths的sortFlag恢复成-1

    for(var i = 0; i < ths.length; i++){ // 这是所有的表头列，其中有一个必然是this
        if(ths[i] !== this){
            ths[i].sortFlag = -1;
        }
    }

    console.log(this.sortFlag);
    console.log(this.index); // ??

    this.sortFlag = this.sortFlag * -1; // 默认是-1, 现在是1

    var tbodytrsAry  = toArray(tbodytrs); // 转化成数组
    // 排序
    // [tr,tr,tr,tr...]
    var that = this; //  => 点击列

    tbodytrsAry.sort(function (tr1,tr2){
        var a = tr1.cells[/*3*/n].innerHTML; // 数字 北京..
        var b = tr2.cells[/*3*/n].innerHTML;
        if(isNaN(a)||isNaN(b)){
            // 字符串
            return (a.localeCompare(b))*that.sortFlag;
        }
        return (a - b)*/*this*/that.sortFlag;
    });
    // 排好序在回填
    for(var i = 0; i<tbodytrsAry.length; i++){
        tbody.appendChild(tbodytrsAry[i]);
    }
}











function toArray(likeAry){
    try{
        return Array.prototype.slice.call(likeAry,0);
    }catch (e){
        var a =  [];
        for(var i = 0; i < likeAry.length; i++){
            a.push(likeAry[i]);
        }
        return a;
    }

}












function jsonParse(jsonStr){
    'JSON' in window ? JSON.parse(jsonStr) : eval("("+jsonStr+")");
}