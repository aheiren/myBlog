<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data(){
    return {
      MaxHeight:"",
    }
  },
  methods:{},
  mounted(){
    
  }
}
</script>

<style>
  *{
    margin: 0px;
    padding:0px;
    box-sizing: border-box;
  }
  body{
    overflow-x: hidden
  }
    /*滚动条整体部分,必须要设置*/
  ::-webkit-scrollbar{
      width: 4px;
      height: 4px;
      background-color: #fff;
  }
  /*滚动条的轨道*/
  ::-webkit-scrollbar-track{
      background-color: #fff;
  }
  /*滚动条的滑块按钮*/
  ::-webkit-scrollbar-thumb{
      border-radius:5px;
      background-color: rgb(204, 192, 192);
  }
  .myInput .el-input__inner{
      background-color:rgba(0, 0, 0, 0) !important;
  }
</style>
