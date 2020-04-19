<template>
  <div id="main">
    <div v-title data-title="L 的个人博客"></div>
    <canvas id="bubbles"></canvas>
    <menu1></menu1>
    <header id="header">
      <div class="intro animated jackInTheBox">
        <h1>L的个人博客</h1>
        <p>开源程序员，自由职业者</p>
        <p>小而美的 Web 博客系统 <span style="color:red;font-weight:bolder">Solo</span></p>
      </div>
      <svg t="1578465319071" class="icon arrows animated infinite bounce slow" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1997" width="34" height="34" @click="toDown"><path d="M857.088 224.256q28.672-28.672 69.12-28.672t69.12 28.672q29.696 28.672 29.696 68.608t-29.696 68.608l-382.976 380.928q-12.288 14.336-30.72 19.968t-38.912 4.608-40.448-8.704-34.304-22.016l-376.832-374.784q-29.696-28.672-29.696-68.608t29.696-68.608q14.336-14.336 32.256-21.504t36.864-7.168 37.376 7.168 32.768 21.504l313.344 309.248z" p-id="1998"></path></svg>
    </header>

    <div class="content">
      <div class="item"  v-for="(item,index) in articleInfo" :key="index">
        <h2 v-html="item.title" class="pointer" @click="articleDetails(item)"></h2>
        <p v-html="item.content" class="pointer article" @click="articleDetails(item)"></p>
        <div class="articleInfo">
          <span v-html="item.tdate"></span>
          <span v-html="item.kind" style="margin-left:30px;" class="pointer"></span>
        </div>
      </div>

      <div class="block page">
        <el-pagination
        @current-change="handleCurrentChange"
          layout="prev, pager, next"
          :page-size="6"
          :total="articleCount">
        </el-pagination>
      </div>
    </div>
    <ufooter></ufooter>
  </div>
</template>
<script> 
import ufooter from "../../component/user/ufooter"
import { stringify } from 'querystring';
import menu1 from "../../component/user/menu"
import "animate.css";
export default {
  data(){
    return {
      articleCount:1, //搜索关键词的文章数
      page:"",//当前页码
      articleInfo:[],//查询到的文章信息
      search:"",
      kind:"",
    }
  },
  components:{
    menu1,
    ufooter
  },
  methods:{
    toDown(){
      let endPoint = document.documentElement.clientHeight;
      // console.log(endPoint)
      if(document.documentElement.scrollTop<endPoint){
        var start = setInterval(()=>{
          document.documentElement.scrollTop += 12;
          if(document.documentElement.scrollTop > endPoint){
            // console.log(document.documentElement.scrollTop)
            clearInterval(start);
          }
        },1)
      }
    },
    //文章详情
    articleDetails(info){
      let infoStr = JSON.stringify(info)
      sessionStorage.setItem("article",infoStr)
      this.$router.push("/user/articleDetail");
    },
    //   翻页
      handleCurrentChange(page){
          this.page = page;
          this.selectedArticle = [];
          let start = (page-1)*6;
          let end = 6;
          let search = this.search;
        //   console.log(search);
          this.queryArticle(start,end,search);
      },
    //   查询文章
      queryArticle(start,end,searchData){
        let self = this;
        let data = {start,end,searchData,headerName:"title"};
        data = stringify(data);
        console.log(data)
        this.axios.post("user/article",data).then(res => {
            // console.log(res.data.msg);
            let data = res.data.msg;
            for(let item of data){
              if(item.content.length>100){
                item.content = item.content.substring(0,100)+". . .";
              }
            }
            this.articleInfo = data;
        });
      },
      //文章数量查询
      selectArticleCount(keyword){
          let self = this;
          let params = {keyword,headerName:"title"};
          this.axios.get("/user/article/selectArticleCount",{params}).then(res => {
              let count = res.data.msg;
              self.articleCount = res.data.msg;
          })
      },
  },
  mounted(){
        this.selectArticleCount("");
        this.handleCurrentChange(1,"");


    var c = document.getElementById('bubbles'),
      ctx = c.getContext('2d'),
      width = window.innerWidth,
      height = window.innerHeight,
      particles = 100,
      minRadius = 4,
      maxRadius = 10,
      speed = 0.01,
      x = width / particles;

    // Bubbles
    var Bubbles = [];

    for (var i = 0; i < particles; i++) {
      Bubbles.push({
        x: i * x,
        y: height * Math.random(),
        r: minRadius + Math.random() * (maxRadius - minRadius),
        speed: 10 * Math.random()
      });
    }

    function bubble() {

      c.width = width;
      c.height = height;
      for (i = 0; i < Bubbles.length; i++) {
        var b = Bubbles[i];
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
        
        b.alpha = .5 * (b.y / height);
        b.speed += speed;
        
        ctx.strokeStyle = "rgba(190, 193, 198, 0.1)";
        ctx.stroke();
        ctx.fillStyle = "hsla(190, 0%, 69%," + b.alpha + ")";
        ctx.fill();
        b.y -= b.speed;
        if (b.y < 0) {
          b.y = height;
          b.speed = Math.random() * 5;
        }
      }
    }

    // Draw
    function draw() {
      bubble();
      window.requestAnimationFrame(draw);
    }

    // Resize Canvas
    function resizeCanvas() {
      width = window.innerWidth,
      height = window.innerHeight;
      c.width = width;
      c.height = height;
      c.style.position = "absolute";
      c.style.height = window.innerHeight;
      c.style.zIndex = "10"
      draw();
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, false);
      }
}
</script>


<style scoped>
  

  #header{
    width:100%;
    height: 100vh;
  }
  .intro{
    text-align: center;
    color: #fff;
    width:350px;
    position: absolute;
    z-index: 20;
    top:50%;
    left: 50%;
    margin-left:-175px;
    margin-top:-70px;
    font-family: 'Courier New', Courier, monospace
  }
  .intro h1{
    margin-bottom: 10px;
    font-size: 52px;
    letter-spacing: 8px;
    cursor: pointer;
  }
  .intro h1:hover{
    color:rgb(197, 197, 177);
  }
  .intro p{
    color:rgb(197, 197, 177);
    margin-bottom:5px;
  }
  #header::before{
    display: inline-block;
    content: "";
    width: 100%;
    height: 100%;
    background: url("../../assets/img/header-bg.jpg");
    background-size: 100% 100%;
    position: absolute;
    z-index: 1;
  }
  .content{
    margin: 0 auto;
    width:900px;
    margin-top:100px;
    background: rgba(255,255,255,0.8);
    border-radius: 10px;
    box-shadow: 1px -5px 10px #888888;
  }
  .content::before{
    display: inline-block;
    content: "";
  }
  .content::after{
    display: inline-block;
    content: "";
  }
  .arrows{
    z-index:10 !important;
    position: absolute;
    bottom: 0px;
    left: 50%;
    margin-left: -17px;
    cursor: pointer;
  }
  .arrows path{
    fill: #fff;
  }
  .arrows:hover path{
    fill: rgb(129, 129, 123);
  }
  .content .item{
    padding:20px 30px;
    height: 160px;
    border-bottom:1px solid rgba(129,129,123,0.1);
  }
  .content .articleInfo{
    margin-top:10px;
  }
  .content .article{
    color:rgb(50, 50, 50)
  }
  .pointer{
    cursor: pointer;
  }
  .pointer:hover{
    color: gray;
  }
  .page{
    margin:30px 0 20px 280px;
  }
</style>