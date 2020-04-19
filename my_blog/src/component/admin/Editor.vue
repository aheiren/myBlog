<template>
  <div>
      <div class="head">
          <p><span>标题:</span><el-input v-model="title" placeholder="标题不超过30字" class="myInput"></el-input></p>
          <p>
              <span>分类:</span><br>
            <el-select v-model="kind" placeholder="请选择" class="myInput">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
          </p>
          <p style="margin-top:10px;" v-show="uploadImgShow">
            <span>上传主题图片:</span><br>
            <input type="file" name="uploadImg" id="uploadImg" @change="uploadImgChange">
            </p>
      </div>
    <quilleditor v-model="html"
                 ref="myTextEditor"
                 :options="editorOption"
                 @change="onChange(($event))"
                 >
      <div id="toolbar" slot="toolbar">
        <select class="ql-size">
          <option value="small"></option>
          <!-- Note a missing, thus falsy value, is used to reset to default -->
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>
        <!-- Add subscript and superscript buttons -->
        <span class="ql-formats"><button class="ql-script" value="sub"></button></span>
        <span class="ql-formats"><button class="ql-script" value="super"></button></span>
        <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
        <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
        <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
        <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
        <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
        <span class="ql-formats"><button type="button" class="ql-link"></button></span>
        <span class="ql-formats">
        <button type="button" @click="imgClick" style="outline:none">
        <svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle
          class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill"
                                                                  points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg>
        </button>
      </span>
        <span class="ql-formats"><button type="button" class="ql-video"></button></span>
      </div>
    </quilleditor>
    <el-button type="primary" @click="submit" style="margin-top:20px;">提交</el-button>
  </div>
</template>
<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { stringify } from 'querystring';

 
  import {quillEditor} from 'vue-quill-editor'
 
  export default {
    name: "v-editor",
    props: {
      value: {
        type: String
      },
      /*上传图片的地址*/
      uploadUrl: {
        type: String,
        default: '/'
      },
      /*上传图片的file控件name*/
      fileName: {
        type: String,
        default: 'file'
      },
      maxUploadSize:{
        type:Number,
        default: 1024 * 1024 * 500
      },
      articleInfo:{
        type:Object,
        default:{}
      }
    },
    data() {
      return {
          uploadImgShow:true,
          content:"",
          title:"",
          html:"",
          kind:"",
        editorOption: {
          modules: {
            toolbar: '#toolbar'
          }
        },
        options: [{
          value: 'JavaScript',
          label: 'JavaScript'
        }, {
          value: '记录生活',
          label: '记录生活'
        }, {
          value: '我的相册',
          label: '我的相册'
        }, {
          value: 'Node.js',
          label: 'Node.js'
        }, ],
        
      }
    },
    methods: {
        uploadImgChange(){
            let file = document.getElementById("uploadImg").files;
            console.log("file",file[0].type.slice(0,5));
            if(file[0].type.slice(0,5) != "image"){
                this.$message({
                  message:"仅支持图片上传",
                  type: 'faile'
                });
            }
        },
        submit(){
          let tdate = new Date().valueOf();
          let title = this.title;
          let html = this.html;
          let kind = this.kind;
          let content = this.content;
          let tid = this.articleInfo.tid;
          let data = {tdate,title,html,kind,tid,content};
          data = stringify(data);
          this.uploadImgShow ? this.addArticle(data) : this.updateArticle(data);
        },
        //修改文章
        updateArticle(data){
          this.axios.post("/admin/update",data).then( res => {
            console.log(res.data.msg);
            if(res.data.code == 1){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
            }else{
              this.$message.error(res.data.msg);
            }
          });
        },
        //新增文章
        addArticle(data){
            let file = document.getElementById("uploadImg").files;
            if(file[0].type.slice(0,5) != "image"){
                this.$message({
                  message:"仅支持图片上传",
                  type: 'faile'
                });
                return;
            };
            let config = {
              //添加请求头
              headers: { "Content-Type": "multipart/form-data" },
            };
            let formData = new FormData();
            formData.append('file', file[0]);
            formData.append('data', data);
            this.axios.post("/admin/add",formData,config).then( res => {
              console.log(res.data);
              if(res.data.code == "-1"){
                this.$message.error(res.data.msg);
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
              }
            })
        },
      onChange({ quill, html, text} ) {
        this.$emit('input', this.html)
        this.content = text;
      },
      /*选择上传图片切换*/
      onFileChange(e) {
        var fileInput = e.target;
        if (fileInput.files.length === 0) {
          return
        }
        this.editor.focus();
        if (fileInput.files[0].size > this.maxUploadSize) {
          this.$alert('图片不能大于500KB', '图片尺寸过大', {
            confirmButtonText: '确定',
            type: 'warning',
          })
        }
        var data = new FormData;
        data.append(this.fileName, fileInput.files[0]);
        console.log("开始上传")
        this.axios.post(this.uploadUrl, data)
          .then(res => {
            if (res.data) {
              console.log(res.data);
              let url = `http://127.0.0.1:3000/img/tec/${res.data.msg}`;
              console.log(url)
              this.editor.insertEmbed(this.editor.getSelection().index, 'image', url)
            }
          })
      },
      /*点击上传图片按钮*/
      imgClick() {
        if (!this.uploadUrl) {
          console.log('no editor uploadUrl');
          return;
        }
        /*内存创建input file*/
        var input = document.createElement('input');
        input.type = 'file';
        input.name = this.fileName;
        input.accept = 'image/jpeg,image/png,image/jpg,image/gif';
        input.onchange = this.onFileChange;
        input.click()
      }
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      }
    },
    components: {
      'quilleditor': quillEditor
    },
    mounted() {
      this.html = this.value
    },
    watch: {
      'value'(newVal, oldVal) {
        if (this.editor) {
          if (newVal !== this.html) {
            this.html = newVal
          }
        }
      },
      "articleInfo"(){
        // console.log(this.articleInfo)
        if(JSON.stringify(this.articleInfo) != "{}"){ //编辑
          this.title = this.articleInfo.title;
          this.html = this.articleInfo.html;
          this.kind = this.articleInfo.kind;
          this.uploadImgShow = false;
        }else{ //新增
          this.title = "";
          this.html = "";
          this.kind = "";
          this.uploadImgShow = true;
        }
      },
    }
  }
 
</script>

<style>
    .head{
        margin-bottom:20px;
    }
</style>