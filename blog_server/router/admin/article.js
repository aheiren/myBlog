//用户路由器：封装用户相关的操作
const express = require('express');
const pool = require('../../pool');
const fs = require("fs");
const path = require("path");
const multiparty = require("multiparty"); //用于接收formdata的内容
const querystring=require("querystring"); //解析查询字符串
const session = require("express-session");


var router = express.Router();
module.exports = router;

//新增文章
router.post("/add",(req,res)=>{
    console.log("新增文章");
    let form = new multiparty.Form();
    let savaImgPath = path.resolve("public/img/tec");
    form.uploadDir = savaImgPath; //修改文件保存路径
    //设置编辑
    form.encoding = 'utf-8';
    
    
    form.parse(req, function(err,fields,file){
        console.log("文件",file);
        let fieldsStr = JSON.stringify(fields);
        if(fieldsStr != "{}"){
            reqData = querystring.parse(fields.data[0]);
            console.log("数据",reqData)
        }
        
        if(JSON.stringify(file) != "{}"){    //判断是否传入图片,如果传入保存
            let fileName = file.file[0].path; 
            let dirName = path.parse(fileName).dir;
            // console.log(dirName);
            
            
            let newName = `${new Date().valueOf()}.${path.parse(fileName).ext}`
            let newFilePath = path.join(dirName,newName);
            // console.log("转换前",newFilePath)
            // let newFilePath1 = path.relative(newFilePath);
            // console.log("相对路径",newFilePath.replace(/C:\\Users\\Administrator\\Desktop\node\\blog_server\\public/i,"http://127.0.0.1:3000"));
            // let $path = newFilePath.replace(/C:\\Users\\Administrator\\Desktop\\node\\blog_server\\public/i,"http://127.0.0.1:3000").replace("\\","/");
            // console.log("转换后",$path)
            let $path = newName;
    
        //   同步重命名文件名
            fs.renameSync(fileName,path.join(dirName,newName));
            console.log(file);
            if(fieldsStr != "{}"){
                if(Object.keys(reqData).length == 6){ //传入参数是否正确
                    let imgUrl = $path;
                    let tdate = reqData.tdate;
                    let title = reqData.title;
                    let content = reqData.content;
                    let kind = reqData.kind;
                    let html = reqData.html;
                    let msg = "";
                    switch(""){
                        case tdate :
                            msg = "日期不能为空";
                            break;
                        case title :
                            msg = "标题不能为空";
                            break;
                        case content :  
                            msg = "内容不能为空";
                            break;
                        case kind :
                            msg = "分类不能为空";
                            break;
                    }
                    if(msg != ""){
                        res.send({code:-1,msg});
                        return;
                    }
                    
            
                    let sql = "INSERT INTO article VALUES(Null,?,?,?,?,?,?)";
                    pool.query(sql,[imgUrl,tdate,title,html,content,kind],(err,result)=>{
                        if(err) throw err;
                        if(result.affectedRows>0){
                            console.log("添加成功");
                            res.send({code:1,msg:"添加成功"});
                        } 
                    })
                }else{
                    res.send({code:-1,msg:"传入参数不符"})
                };
            }else{
                res.send({code:1,msg:$path});
            }

        }else{
            res.send({code:-1,msg:"未传入主题图片"})
        }
      });    
    // console.log("请求数据为",req);
})
 

//删除文章
router.post("/del",(req,res) => {
    console.log("删除文章");
    let selectedArticle = req.body;
    let tid = [];
    for(let i in selectedArticle){
        tid.push(selectedArticle[i]);
    };
    let delCount = tid.length;
    tid = tid.join(",");
    let sql = `delete from article where tid in (${tid})`;
    console.log(sql);
    pool.query(sql,(err,result) => {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({code:1,msg:`成功删除${delCount}条数据`})
        }else{
            res.send({code:-1,msg:`删除失败`})
        }
    })
})

// 修改文章
router.post("/update",(req,res) => {
    console.log("修改文章",req.body);
    let title = req.body.title;
    let tid = req.body.tid;
    let content = req.body.content;
    let kind = req.body.kind;
    let html = req.body.html;

    let sql = "update article set content=?,kind=?,title=?,html=? where tid=?";
    pool.query(sql,[content,kind,title,html,tid], (err,result) => {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send({code:1,msg:"修改成功"});
        }else{
            res.send({code:-1,msg:"修改失败"});
        }
    })
})


// 管理员登录
router.post("/login",(req,res) => {
    console.log("管理员登录")
    let uname = req.body.uname;
    let upwd = req.body.upwd;
    
    console.log(req.session)
    let sql = "select aid,loginnum from admin_l where uname=? and upwd=?";
    pool.query(sql,[uname,upwd],(err,result) => {
        if(err) throw err;
        if(result.length > 0){
            console.log("查询结果",result);
            let aid = result[0].aid;
            let loginnum = result[0].loginnum + 1;
            console.log("登录次数",loginnum)
            let sql = "update admin_l set loginnum=? where aid=?";
            pool.query(sql,[loginnum,aid], (err,$result) => {
                if(err) throw err;
                if($result.affectedRows > 0 ){
                    console.log("登录次数更新成功！")
                    req.session.loginFlag = "1"; //打开权限
                    req.session.aid = aid; //将aid保存在session
                    res.send({code:1,msg:"登录次数更新成功"});
                }else{
                    res.send({code:-1,msg:"登录次数更新失败"})
                    console.log("登录次数更新失败！")
                }
            })
        }else{
            res.send({code:-1,msg:"账号或密码错误"});
        }
    })
});

//管理员信息查询
router.post("/adminInfo", (req,res) => {
    console.log("管理员信息查询",req.session.aid)

    let aid = req.session.aid;

    let sql = "select * from admin_l where aid=?";
    pool.query(sql,[aid], (err,result) => {
        if(err) throw err;
        if(result.length > 0){
            res.send({code:1,msg:result[0]})
        }else{
            res.send({code:-1,msg:"管理员信息查询失败！"})
        }
    })
})

// 退出登录
router.post("/logOut",(req,res) => {
    req.session.loginFlag = null;
    res.send({code:1,msg:"退出成功"});
})

//权限检查
router.post("/PermissionCheck",(req,res) => {
    console.log(req.session.loginFlag);
    if(req.session.loginFlag == "1"){
        res.send({code:1,msg:"验证通过"});
    }else{
        res.send({code:-1,msg:"请先登录"});
    }
}) 

//修改管理员信息
router.post("/modificationAdminInfo",(req,res) => {
    console.log("修改管理员信息",req.body);
    let birthday = req.body.birthday;
    let age = req.body.age;
    let address = req.body.address;
    let nickname = req.body.nickname;
    let sql = "update admin_l set birthday=?,age=?,address=?,nickname=?";
    pool.query(sql,[birthday,age,address,nickname],(err,result) => {
        if (err) throw err;
        if(result.affectedRows > 0){
            res.send({code:1,msg:"修改成功"});
        }else{
            res.send({code:-1,msg:"修改失败"});
        };
    })
})
 