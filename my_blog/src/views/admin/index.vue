<template>
    <div id="main">
        <div v-title data-title="后台管理"></div>
        <el-container>

            <el-header>
                <div class="topNav">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="rgba(0,0,0,0)">
                        <el-submenu index="2">
                            <template slot="title">{{uname}}</template>
                            <el-menu-item index="2-1">我的信息</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="logOut">退出登录</el-menu-item>
                    </el-menu>
                </div>
            </el-header>

            <el-container style="margin-top:50px;">
                <el-aside width="200px">
                            <el-menu
                            background-color="rgba(0,0,0,0)"
                            default-active="2"
                            class="el-menu-vertical-demo">
                                <el-menu-item index="2" @click="reportShow">
                                    <i class="el-icon-s-opportunity"></i>
                                    <span slot="title">报告</span>
                                </el-menu-item>
                                <el-menu-item index="1" @click="articleShow">
                                    <i class="el-icon-s-home"></i>
                                    <span slot="title">文章</span>
                                </el-menu-item>
                                <el-menu-item index="3" @click="photoShow">
                                    <i class="el-icon-picture"></i>
                                    <span slot="title">相册</span>
                                </el-menu-item>
                                <el-menu-item index="4" @click="msgShow">
                                    <i class="el-icon-s-comment"></i>
                                    <span slot="title">留言</span>
                                </el-menu-item>
                                <el-menu-item index="5" @click="userShow">
                                    <i class="el-icon-user-solid"></i>
                                    <span slot="title">用户</span>
                                </el-menu-item>
                            </el-menu>
                </el-aside>

                <el-main v-show="contentShow.reportShow">
                    <h2>信息总览</h2>
                    <el-divider></el-divider>
                    <div class="infoPandect">
                        <div class="articleCount">
                            <h5>文章</h5>
                            <span v-html="articleTotalCount" @click="articleShow"></span>
                        </div>
                        <div class="msgCount">
                            <h5>留言</h5>
                            <span>2</span>
                        </div>
                        <div class="PV">
                            <h5>访问量</h5>
                            <span>3</span>
                        </div>
                    </div>
                    <div class="loggingStatus mt30">
                        <h2>状态</h2>
                        <el-divider></el-divider>
                        <div class="darkBG">登录者：<span class="adminName" v-html="uname"></span>,这是您第 <span v-html="loginNum"></span> 次登录系统</div>
                    </div>
                    <div class="systemInfo mt30">
                        <h2>系统信息</h2>
                        <el-divider></el-divider>
                        本机IP地址：<span v-html="ipv4"></span>
                    </div>
                </el-main>
                <!-- 编辑模块 -->
                <el-main v-show="contentShow.editArtcleShow">
                    <h1 style="margin-bottom:20px;">编辑文章</h1>
                    <v-editor  v-model="text" upload-url="/admin/add" fileName="file" :articleInfo="articleInfo"/>

                </el-main>
                <!-- 表格模块 -->
                <el-main v-show="contentShow.articleShow">
                    <div>
                        <el-button type="primary" style="margin-bottom:20px;" @click="addArticle">新增文章</el-button>
                    </div>
                    <el-table
                        :data="ArticleTableData"
                        ref="multipleTable"
                        @selection-change="ArticleHandleSelectionChange"
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        label="日期"
                        prop="tdate">
                        </el-table-column>
                        <el-table-column
                        label="分类"
                        prop="kind">
                        </el-table-column>
                        <el-table-column
                        label="标题"
                        prop="title">
                        </el-table-column>
                        <el-table-column
                        align="right">
                        <template slot="header" slot-scope="scope">
                            <el-input
                            v-model="search"
                            size="mini"
                            @change="searchData(search)"
                            placeholder="输入标题关键字搜索"/>
                        </template>
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="editArtcle(scope.$index, scope.row)">编辑</el-button>
                            <el-button
                            size="mini"
                            type="danger"
                            @click="delArticle(scope.$index, scope.row)">删除</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin:0 auto;width:400px;">
                        <el-pagination
                        @current-change="handleCurrentChange"
                        background
                        layout="prev, pager, next"
                        :page-size="6"
                        :total="articleCount">
                        </el-pagination>
                    </div>
                    <div style="margin-top: 20px">
                        <!-- <el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button> -->
                        <el-button @click="ArticleToggleSelection()">取消选择</el-button>
                        <el-button type="danger" @click="delSelectedArticle()">删除选中文章</el-button>
                    </div>
                </el-main>

                <el-main v-show="contentShow.photoShow">相册</el-main>

                <el-main v-show="contentShow.msgShow">留言</el-main>

                <el-main v-show="contentShow.userShow">
                    <div class="adminPhoto">
                        <img :src="adminPhotoUrl">
                    </div>
                    <el-divider></el-divider>
                    <div class="adminInfo">
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <span>昵称：</span>
                            <el-input v-model="nickName" :disabled="adminInfo.nickName_disabled" class="inputLen myInput"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <span>生日：</span>
                            <el-date-picker
                            class="inputLen myInput"
                            v-model="birthday"
                            type="date"
                            placeholder="选择日期"
                            :disabled="adminInfo.birthday_disabled"
                            @blur="birthday_blur">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="10" :offset="2">
                            <span>年龄：</span>
                            <el-input v-model="age" :disabled="true" class="inputLen myInput"></el-input>
                        </el-col>
                        <el-col :span="10" :offset="1">
                            <span>住址：</span>
                            <el-input v-model="address" :disabled="adminInfo.address_disabled" class="inputLen myInput"></el-input>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5" :offset="8">
                            <el-button type="primary" plain @click="modification">修改</el-button>
                        </el-col>
                        <el-col :span="5" :offset="0">
                            <el-button type="primary" plain @click="modificationSubmit" :disabled="adminInfo.modificationSubmit_disabled">提交</el-button>
                        </el-col>
                    </el-row>
                        
                    </div>
                </el-main>
                </el-container>
            </el-container>
        </div>
</template>


<script>
import { async } from 'q';
import ip from "./getUserIP"
import { stringify } from 'querystring';
import vEditor from "../../component/admin/Editor"
export default {
    data(){
        return {
            // 生日
            birthday:"",
            // 年龄
            age:"",
            // 住址
            address:"",
            //管理员用户名
            uname:"",
            // 登录次数
            loginNum:"",
            //昵称
            nickName:"",
            //管理员头像
            adminPhotoUrl:"",
            //编辑文章内容
            articleInfo:{},
            //文章分类
            kind:"",
            //文章内容
            articleContent:"",
            //文章标题
            articleTitle:"",
            text:"",
            //当前页码
            page:"",
            //搜索文章的内容
            searchTableData:[],
            //选中文章
            selectedArticle:[],
            multipleSelection: [],
            search: '',
            //表格内容
            ArticleTableData:[],
            // ip地址
            ipv4:"",
            activeIndex:"1",
            //控制内容显示隐藏
            contentShow:{  
                reportShow:true,
                articleShow:false,
                photoShow:false,
                msgShow:false,
                userShow:false,
                editArtcleShow:false
            },
            //文章总数
            articleTotalCount:0,
            //搜索到文章数
            articleCount:0,
            // 个人信息禁用状态
            adminInfo:{
                // 昵称是否禁用
                nickName_disabled:true,
                // 生日是否禁用
                birthday_disabled:true,
                // 住址是否禁用
                address_disabled:true,
                // 提交是否禁用
                modificationSubmit_disabled:true,
            },
        }
    },
    components:{
        vEditor
    },
    methods:{
        // 个人信息和退出登录
      handleSelect(key, keyPath) {  
        console.log(key, keyPath);
        if(key == "logOut"){
            this.logOut();
        }
      },
    //修改管理员信息
      modification(){
          this.adminInfo.modificationSubmit_disabled = false;
          this.adminInfo.nickName_disabled = false;
          this.adminInfo.birthday_disabled = false;
          this.adminInfo.address_disabled = false;
      },
    //   修改管理员信息提交
      modificationSubmit(){
          let data = {
              birthday:this.birthday,
              age:this.age,
              address:this.address,
              nickname:this.nickName
          };
          data = stringify(data);
          this.axios.post("/admin/modificationAdminInfo",data).then( res => {
              if(res.data.code == "1"){
                this.$message({
                message: '修改成功！',
                type: 'success'
                });
                for(let i in this.adminInfo){
                    this.adminInfo[i] = true;
                }
              }else{
                this.$message.error('修改失败！');
              }
          })
      },
      birthday_blur(){
        //   console.log("生日：",this.birthday.valueOf());
          this.birthday = this.birthday.valueOf();
        //   获取当前日期
          let nowDate = new Date().valueOf();
          if(this.birthday > nowDate){
            this.$alert('选中日期不能大于当前日期', '提示', {
            confirmButtonText: '确定',
            callback: action => {
                this.birthday = "";
            }
            });
          }else{
              console.log("年龄为：",new Date(nowDate).getFullYear() - new Date(this.birthday).getFullYear());
              this.age = new Date(nowDate).getFullYear() - new Date(this.birthday).getFullYear();
          }
      },
      //管理员信息查询
      queryAdminInfo(){
          this.axios.post("/admin/adminInfo").then( res => {
            //   console.log(res.data.msg);
              let data = res.data.msg;
              this.uname = data.uname;
              this.loginNum = data.loginnum;
              this.adminPhotoUrl = data.adminphoto;
              this.nickName = data.nickname;
              this.birthday = new Date(parseInt(data.birthday));
              this.age = data.age;
              this.address = data.address;
          })
      },
      //退出登录
      logOut(){
          this.axios.post("/admin/logOut").then( res => {
                this.$message({
                message: res.data.msg,
                type: 'success'
                });
                this.$router.push("login");
          })
      },
      //删除文章
      delArticle(index, rows){
          console.log(index,rows);
          this.selectedArticle.push(rows.tid);
          this.delSelectedArticle();
      },
    //   编辑文章
      editArtcle(index,rows){
          console.log(index,rows);
          rows.isEditor = true;
          this.articleInfo = rows;
          this.editArtcleShow();
      },
      //新增文章
      addArticle(){
          this.articleInfo = {};
          this.editArtcleShow();
      },
      //选中文章
      ArticleHandleSelectionChange(val){
          this.multipleSelection = val;
        //   把id放进选中的文章
          for(let item of this.multipleSelection){
              this.selectedArticle.push(item.tid);
          }
      },
      //删除选中文章
       delSelectedArticle(){
            let data = this.selectedArticle;
            console.log(data)
            if(data.length>0){
                this.$confirm('此操作将永久删除文章, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                })
                .then(() => {
                this.deleteArticle(data);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
                });
            }else{
                this.$alert('未选中数据', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                    this.$message({
                    type: 'info',
                    message: `请选择至少一条数据`
                    });
                }
                });
            }

      },
      //删除文章
      deleteArticle(data){
          data = stringify(data);
        //   console.log(data);
          this.axios.post("admin/del",data).then( res => {
              console.log(res.data.msg);
              if((this.articleTotalCount % 6 ==0 ||this.articleCount % 6 ==0 )&& this.page != 1){
                  this.handleCurrentChange(this.page-1);
              }else{
                  this.handleCurrentChange(this.page);
              }
              this.selectArticleCount("");
              return res.data.msg;
          })
          
      },
      //取消选择
      ArticleToggleSelection(){
          this.$refs.multipleTable.clearSelection();
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
        // console.log(data)
        this.axios.post("user/article",data).then(res => {
            if(res.data.code == 1){
                // console.log(res.data.msg)
                let tableData = res.data.msg;
                self.ArticleTableData = tableData;
            }else if(searchData){
                // self.ArticleTableData = [];
                this.$message({
                message: '未查询到相关关键词',
                type: 'warning'
                });
            }else if(res.data.code == -1){
                // console.log("没有数据")
                self.ArticleTableData = [];
            }
        });
      },
    //   搜索文章
      searchData(search){
            this.selectArticleCount(search);
            this.handleCurrentChange(1);
      },
      //文章数量查询
      selectArticleCount(keyword){
          let self = this;
          let params = {keyword,headerName:"title"};
          this.axios.get("/user/article/selectArticleCount",{params}).then(res => {
              let count = res.data.msg;
              self.articleCount = res.data.msg;
              if(!keyword){
                  self.articleTotalCount = count;
              }
              return count;
          })
      },
    //   主内容显示控制
    //   所有内容隐藏
      closeContentShow(){
          for(let i in this.contentShow){
              this.contentShow[i] = false;
          }
      },
      reportShow(){
        this.closeContentShow();
        this.contentShow.reportShow = true;
      },
      articleShow(){
        this.selectArticleCount("");
        this.handleCurrentChange(1);
        this.closeContentShow();
        this.contentShow.articleShow = true;
      },
      photoShow(){
        this.closeContentShow();
        this.contentShow.photoShow = true;
      },
      msgShow(){
        this.closeContentShow();
        this.contentShow.msgShow = true;
      },
      userShow(){
        this.closeContentShow();
        this.contentShow.userShow = true;
      },
      editArtcleShow(){
          this.closeContentShow();
          this.contentShow.editArtcleShow = true;
      },
    },
    mounted(){
        this.axios.post("/admin/PermissionCheck").then( res => {
            // console.log(res.data)
            if(res.data.code == -1){
                this.$message({
                message: res.data.msg,
                type: 'warning'
                });
                this.$router.push("login")
            }
        });
        
        this.queryAdminInfo();
        //查询文章
        this.selectArticleCount("");
        this.handleCurrentChange(1,"");
        //ip查询
        ip((a)=>{
            // console.log(a)
            if(a.length < 30){
                this.ipv4 = a;
            };
            // console.log(this.ipv4)
        });
    }
}
</script>


<style scoped>
    .mt30{
        margin-top:30px;
    }
    .topNav{
        float: right;
    }
    .el-header, .el-footer {
        background-color: rgba(0,0,0,0);
        color: #333;    
        text-align: center;
        line-height: 60px;
    }
    
    .el-aside {
        background-color: rgba(0,0,0,0);
        color: #333;
        text-align: center;
        line-height: 200px;
    }
    
    .el-main {
        background-color:  rgba(0,0,0,0);
        color: #333;
        overflow-x:hidden;
        word-wrap: break-word;
    }
    
    /* body > .el-container {
        margin-bottom: 40px;
    } */
    
    /* .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }
    
    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    } */

    .infoPandect{
        display: flex;
        justify-content: space-around;
        flex-wrap: nowrap;
        text-align: center;
    }
    .infoPandect span{
        font-size: 13px;
    }
    .articleCount:hover span,
    .msgCount:hover span,
    .PV:hover span,
    .darkBG:hover .adminName{
        color: rgb(37, 62, 173);
        text-decoration:underline  rgb(37, 62, 173);
        cursor: pointer;
    }
    .darkBG{
        background: rgba(241, 237, 235, 0.5);
        border-radius: 8px;
        line-height: 35px;
        margin-top: 10px;
        padding-left: 20px;
    }
    .lightBG{
        line-height: 35px;
        margin-top: 10px;
        padding-left: 20px;
    }
    .adminPhoto{
        margin: 0 auto;
        width:80px;
        height:80px;
    }
    .adminPhoto:hover{
        cursor: pointer;
    }
    .adminPhoto img{
        width:80px;
        height:80px;
        border-radius: 50%;
    }
    .inputLen{
        width: 300px !important;
    }
    .adminInfo div{
        margin-top: 10px;
    }
</style>