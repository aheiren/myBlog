//用户路由器：封装用户相关的操作
const express = require('express');
const pool = require('../../pool');

const router = express.Router();
module.exports = router;

//文章信息查询
router.post("/",(req,res)=>{
    let headerName = req.body.headerName;//表头名 必输
    let searchData = req.body.searchData; //搜索关键词
    let start = req.body.start; //查询开始位置
    let end = req.body.end; //查询结束位置
    let sql = `select * from article where ${headerName} like "%${searchData}%" limit ${start},${end}`;
    // console.log(start,end);
    console.log(sql)
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        // console.log(result);
        if(result.length>0){
            let data = [];
            for(let item of result ){
                let date =  new Date(parseInt(item.tdate)).toLocaleDateString();
                item.tdate = date;
                // console.log(item.tdate)
                data.push(item);
            }
            res.send({code:1,msg:data});
        }else{
            res.send({code:-1,msg:"未查询到数据"})
        };
    })
});


//查询文章数量
router.get("/selectArticleCount",(req,res)=>{
    let keyword = req.query.keyword;  //选输
    let headerName = req.query.headerName; //必输
    if(headerName == ""){
        res.send({code:-1,msg:"headerName必输"});
        return;
    }
    if(headerName != "imgUrl" && headerName != "tdate" && headerName != "title" && headerName != "content" && headerName != "kind"){
        res.send({code:-1,msg:"参数传入不正确"});
        return;
    }

    console.log(req.query)
    let sql = `select count(*) from article where ${headerName} like "%${keyword}%"`;
    console.log("文章数量查询",sql)
    pool.query(sql,(err,result)=>{
        if(err) throw err;
        if(result.length > 0){
            let count = result[0]["count(*)"];
            res.send({code:1,msg:count})
        }else{
            res.send({code:1,msg:"查询失败！"})
        }
    })
});
