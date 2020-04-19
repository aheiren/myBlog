//用户路由器：封装用户相关的操作
const express = require('express');
const pool = require('../../pool');

var router = express.Router();
module.exports = router;


// 用户登录
router.post("/login",(req,res)=>{
    var uname=req.query.uname;
    var upwd=req.query.upwd;

    var sql="select uid from yg_user where uname=? and upwd=?";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err)throw err;
        if(result.length>0){
            res.send({code:1,msg:"登录成功"});
        }else{
            res.send({code:-1,msg:"账号或密码错误"});
        };
    });
});

// 用户验证
router.post("/test",(req,res)=>{
    var uname=req.query.uname;
    var sql="select uid from user where uname=?";
    pool.query(sql,[uname],(err,result)=>{
        if(err) throw err;
        if(result.length>0){
            res.send({code:-1,msg:"用户名已存在"});
        }else{
            res.send({code:1,msg:"用户名可用"});
        };
    });
});

//用户注册
router.post("/register",(req,res)=>{
    var uname=req.query.uname;
    var upwd=req.query.upwd;

    var sql="insert into yg_user values(null,?,?)";
    pool.query(sql,[uname,upwd],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0){
            res.send({code:1,msg:"注册成功"});
        };
    });
})