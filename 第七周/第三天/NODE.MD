####NODE中的内置模块
> 服务器端需要处理的事情
- 在服务器上创建一个服务(监听一个端口)
- 接收(解析)客户端的请求信息
- 找到客户端需要的资源文件中的源代码
- 把源代码返回给客户端

#####HTTP
> 这个模块主要用于创建服务、监听端口、接收请求、返回内容的管理

http.createServer：创建一个服务

#####URL
> 主要用来解析URL地址的

url.parse：解析一个完整的URL(也可以不完整)中的每一项的

#####FS
> 提供一些方法供开发者进行I/O的操作

fs.readFileSync([pathname])：同步读取指定文件中的内容，读取出来的内容是字符串格式的
fs.readFile([pathname],[callback])：异步读取文件中的内容

fs.writeFileSync([pathname],[content])：同步把内容写入到文件中，写入的内容需要是字符串格式的，而且写入属于覆盖式写入
fs.writeFile...


sync:同步
async:异步



```
    /*
     监听端口
       server.listen([port],[callback]) 给当前服务监听端口
       @parameters:
         [port]:端口号
         [callback]:......
    
       @return:是什么类型的,作用是什么....
       
     例如：
       xxxxx
    */
```








