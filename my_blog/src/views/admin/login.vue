<template>
    <div id="login">
        <div v-title data-title="管理员登录"></div>
        <div class="dowebok">
            <div class="container-login100">
                <div class="wrap-login100">
                    <div class="login100-pic js-tilt" data-tilt>
                        <img src="./images/img-01.png" alt="IMG">
                    </div>

                    <div class="login100-form validate-form">
                        <span class="login100-form-title">
                            管理员登录
                        </span>

                        <div class="wrap-input100 validate-input">
                            <input class="input100" type="text" name="email" placeholder="账号" v-model="uname">
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-envelope" aria-hidden="true"></i>
                            </span>
                        </div>

                        <div class="wrap-input100 validate-input">
                            <input class="input100" type="password" name="pass" placeholder="密码" v-model="upwd" @keyup.enter="login">
                            <span class="focus-input100"></span>
                            <span class="symbol-input100">
                                <i class="fa fa-lock" aria-hidden="true"></i>
                            </span>
                        </div>
                        
                        <div class="container-login100-form-btn">
                            <button class="login100-form-btn" style="margin-bottom:120px;" @click="login">
                                登陆
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./css/util.css"
import "./css/main.css"
import { stringify } from 'querystring';
export default {
    data(){
        return {
            uname:"",
            upwd:"",
        }
    },
    methods:{
        login(){
            let uname = this.uname;
            let upwd = this.upwd;
            let data = {uname,upwd};
            data = stringify(data);
            console.log(data)
            this.axios.post("/admin/login",data).then( res => {
            if(res.data.code == -1){
                    this.$message({
                    message: res.data.msg,
                    type: 'warning'
                    });
                }else{
                    this.$message({
                    message: '登录成功',
                    type: 'success'
                    });
                    // console.log(res.data.msg);
                    this.$router.push("index");
                }
            });
        },
    }
}
</script>

<style scoped>
    
</style>