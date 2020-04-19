<template>
    <div id="main">
        <menu1></menu1>
        <div class="head">
            <img :src="bgurl" alt="">
        </div>


        <div class="info">
            <span v-html="articleInfo.tdate"></span> / <span v-html="articleInfo.kind"></span>
            <h2 v-html="articleInfo.title"></h2>
        </div>
        <div class="content">
            <div v-html="articleInfo.html"></div>
        </div>

        <ufooter></ufooter>
    </div>
</template>

<script>
import ufooter from "../../component/user/ufooter"
import menu1 from "../../component/user/menu"
export default {
    data(){
        return {
            headbg:"",
            articleInfo:{},
            bgurl:"",
            title:"",
        }
    },
    components:{
        ufooter,
        menu1
    },
    mounted(){
        // this.articleInfo = this.$route.query;
        let data = sessionStorage.getItem("article");
        data = JSON.parse(data);
        this.articleInfo = data;
        this.bgurl = `http://127.0.0.1:3000/img/tec/${this.articleInfo.imgUrl}`;
        this.title = this.articleInfo.title;
        document.title = this.title;
    }
}
</script>


<style>
    .head{
        width:100%;
        height: 50vh;
    }
    .head img{
        width:100%;
        height: 100%;
    }
    .info{
        text-align: center;
    }
    .content{
        margin: 0 auto;
        width:900px;
        margin-top:60px;
        background: rgba(255,255,255,0.8);
        border-radius: 10px;
        box-shadow: 1px -5px 10px #888888;
        padding: 20px;
    }
    .content img {
        max-width: 750px;
    }
</style>