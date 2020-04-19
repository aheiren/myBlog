import Vue from 'vue'
import VueRouter from 'vue-router'
import index from "../views/user/index"
import adminIndex from "../views/admin/index"
import adminLogin from "../views/admin/login"
import articleDetail from "../views/user/articleDetail"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    component: index
  },
  {
    path: '/index',
    name: 'index',
    component: index
  },
  {
    path:"/admin/index",
    name:"adminIndex",
    component:adminIndex
  },
  {
    path:"/admin/login",
    name:"adminLogin",
    component:adminLogin
  },
  {
    path:"/user/articleDetail",
    name:"articleDetail",
    component:articleDetail
  },
]

const router = new VueRouter({
  routes
})

export default router
