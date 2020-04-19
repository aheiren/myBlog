//整个项目中唯一的数据库连接池
const mysql = require('mysql');
var pool = mysql.createPool({
    host:'127.0.0.1',           //数据库主机地址
    port:'3306',                //端口号
    user:'root',                //管理员名
    password:'',                //管理员密码
    database:'myblog',              //数据库名
    connectionLimit:10          //连接池大小
});

module.exports = pool;