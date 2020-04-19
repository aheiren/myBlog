const express=require("express");
const userRouter=require("./router/user/user");
const articleRouter = require("./router/user/article");
const articleAdmin = require("./router/admin/article");
const path = require("path")

var server=express();

//处理跨域请求
const cors = require("cors");
server.use(cors({
  origin:["http://127.0.0.1:8080",  
  "http://localhost:8080",
  "http://172.20.10.3:8080",
  "http://192.168.2.103:8080",
  "http://192.168.2.101:8080",
  "http://192.168.2.104:8080",
  "http://192.168.1.13:8080",
  "http://172.20.10.2:8080"], 
  credentials:true 
}));


//添加session功能
const session = require("express-session");
server.use(session({
  name:"idKey",
  secret:"128位字符串",
  resave:true,//每次请求是否更新数据
  saveUninitialized:true, //是否允许session在使用过程中被修改。
  cookie:{
    maxAge:30*60*1000
 }
}));

// 监听3000端口
server.listen(3000,function(){
    console.log("启动成功，正在监听3000端口")
})

server.use(express.static(path.join(__dirname, 'public')));

//前置中间件：将post请求主体数据解析封装入req.body对象
server.use(express.urlencoded({extended:false}));

// server.use( (req,res,next) => {
//   console.log(req.session.signInInfo);
// })

//路由&路由器
server.use("/user/article",articleRouter); //文章信息查询
server.use("/user",userRouter);
server.use("/admin",articleAdmin);
 