<template>
    <div id="main">
        <div id="menu" :class="isShowBtn" @click="open_menu" :style="showSmall">
            <svg t="1578277405489" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2159" width="25" height="25"><path d="M133.310936 296.552327l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949 0-19.781623-15.997312-35.950949-35.950949-35.950949L133.310936 224.650428c-19.781623 0-35.950949 16.169326-35.950949 35.950949C97.359987 280.383 113.529313 296.552327 133.310936 296.552327z" p-id="2160" ></path><path d="M890.51705 476.135058 133.310936 476.135058c-19.781623 0-35.950949 16.169326-35.950949 35.950949 0 19.781623 16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-16.169326 35.950949-35.950949C926.467999 492.304384 910.298673 476.135058 890.51705 476.135058z" p-id="2161" ></path><path d="M890.51705 727.447673 133.310936 727.447673c-19.781623 0-35.950949 15.997312-35.950949 35.950949s16.169326 35.950949 35.950949 35.950949l757.206115 0c19.781623 0 35.950949-15.997312 35.950949-35.950949S910.298673 727.447673 890.51705 727.447673z" p-id="2162"></path></svg>
            <span class="text_menu" v-html="showText"></span>
        </div>
        <div :class="isShowMenu" :style="menu_height">
            <svg @click="close_menu" t="1578039047046" class="icon menu_close" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2916" width="20" height="20"><path d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z" p-id="2917"></path></svg>
            <div class="wrap">
                <div class="photo"></div>
                <div class="navigation">
                    <ol>
                        <li class="index" @click="toIndex">首页</li>
                        <li>关于我</li>
                        <li>相册</li>
                        <li>搜索</li>
                    </ol>
                </div>
                <div class="contact">
                    <img src="../../assets/img/wechat.png" alt="">
                    <img src="../../assets/img/QQ.png" alt="">
                </div>
            </div>
        </div>
        <div class="dark" style="display:none" id="dark" @click="close_menu"></div>
    </div>
</template>


<script>
export default {
    data(){
        return {
            isShowBtn:"",
            menu_height:"",
            isShowMenu:"menu hide",
            showText:"menu",
            showSmall:"top:20px;left:20px;border:1px solid #fff;background:rgab(0,0,0,0);z-index: 100;",
        }
    },
    methods:{
        open_menu(){
            this.isShowBtn = "hide";
            this.isShowMenu = "menu show menu_recover";
            document.getElementById("dark").style.display = "block";
        },
        close_menu(){
            this.isShowMenu = "menu hide";
            this.isShowBtn = "";
            document.getElementById("dark").style.display = "none";
        },
        windowScroll() {
            // 滚动条距离页面顶部的距离
            // 以下写法原生兼容
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if(scrollTop >= 400){
                this.showText = "";
                this.showSmall = "border:1px solid #333333;background:#333333;transform:translateX(-9px);top:20px;z-index: 100;"
            }else{
                this.showText = "MENU";
                this.showSmall = "top:20px;left:20px;border:1px solid #fff;background:rgba(0,0,0,0);z-index: 100;";
            }
        },
        toIndex(){
            this.$router.push("/index");
        }

    },
    mounted(){
        window.addEventListener('scroll', this.windowScroll);
        // console.log(document.documentElement.clientHeight);
        this.menu_height = `height:${document.documentElement.clientHeight}px;width:${document.documentElement.clientHeight/2.6}px`
    }
}
</script>

<style scoped>
    #main{
        position: fixed;
        z-index: 100;
    }
    .hide{
        opacity: 0;
        transition: 0.5s;
    }
    .show{
        opacity: 1;
        transition: 0.5s;
    }
    #menu{
        padding-right: 6px;
        z-index: 100;
        position: absolute;
        cursor: pointer;
        height:40px;
        /* width:90px; */
        display: flex;
        
        border-radius: 4px;
        transition: 0.5s;
    }
    #menu:hover .text_menu,
    #menu:hover,
    #menu:hover  svg path{
        color: #ada1a1;
        border-color: #ada1a1;
        fill: #ada1a1;
    }
    #menu svg path{
        fill: #fff;
    }
    #menu svg{
        position: relative;
        top:7px;
        left: 8px;
    }
    .text_menu{
        text-transform: uppercase;
        font-size: 12px;
        margin-top: 11px;
        margin-left: 16px;
        color: #fff;
    }
    .menu{
        background:#000 url("../../assets/img/background.jpeg") no-repeat;
        position: absolute;
        transform-origin: bottom left;
        transform: rotate(-25deg);
        transition: 1s;
    }
    .menu_recover{
        transform-origin: bottom left;
        transform: rotate(0deg);
        z-index: 200;
    }
    .menu_close{
        fill:#6d6868;
        position: relative;
        top:10px;
        left: 85%;
        cursor: pointer;
    }
    .menu_close:hover{
        fill: azure;
    }

    .dark{ 
	z-index: 101; 
	position:fixed;
	left:0; 
	right:0; 
	bottom:0; 
	top:0; 
	background:rgba(0, 0, 0, 0.3);
    }
    .wrap .photo{
        width: 80px;
        height: 80px;;
        border-radius: 50%;
        border:3px solid rgb(158, 158, 149);
        box-shadow: 0px 5px 12px 1px #002;
        margin: 0 auto;
        margin-top: 30px;
        background:url("../../assets/img/touxiang.jpg");
        background-size:cover;
    }
    .wrap .navigation{
        color: rgb(109, 101, 101);
        margin-top:200px;
        padding-left:20px;
        font-size: 14px;
        letter-spacing:1px;
        text-align: center;
    }
    .wrap .navigation li{
        margin-top:5px;
    }
    .wrap .navigation li:hover{
        color:aliceblue;
        cursor: pointer;
    }
    .wrap .contact{
        margin:0 auto;
        margin-top: 80px;
        width: 60px;
    }
    .wrap .contact img{
        width:20px;
        height: 20px;
        cursor: pointer;
        margin-right: 10px;
    }
</style>