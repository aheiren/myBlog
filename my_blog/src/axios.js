// 引入axios库并且配置
// 1：引入vue
import vue from "vue"
// 2：引入axios库
import axios from "axios"
// 3：设置跨域请求保存session
axios.defaults.withCredentials=true;
// 4：设置请求服务器的基础路径
axios.defaults.baseURL="http://127.0.0.1:3000/";
// 5：将axios注册 Vue实例
vue.prototype.axios=axios;

// 7：main.js引入axios即可


