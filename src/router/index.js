import Vue from 'vue'
import VueRouter from 'vue-router'

//1.安装插件
Vue.use(VueRouter);

//2.创建路由对象
//配置路由映射关系
//定义路由映射，懒加载
const Home = () =>import('views/home/Home')
const Category = () =>import('views/category/Category')
const Shopcart = () =>import('views/shopcart/Shopcart')
const Profile = () =>import('views/profile/Profile')

const routes=[
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/shopcart',
    component: Shopcart
  },
  {
    path: '/profile',
    component: Profile
  }]

const router=new VueRouter({
  mode:'history',
  routes

})

//3.导出
export default router
