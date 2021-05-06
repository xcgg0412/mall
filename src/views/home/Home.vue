<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="homeScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners"/>
      <home-recommend-view :recommends="recommends"/>
      <home-feature-view/>
      <tab-control :titles="['流行','新款','精选']" class="tab-control" @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  //导入的自己的组件
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import HomeFeatureView from "./childComps/HomeFeatureView";

  //导入公共组件
  import NavBar from "components/common/navbar/NavBar";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from "components/common/scroll/Scroll";
  import BackTop from "components/content/back-top/BackTop";

  //导入的方法
  import {getHomeMultidata,getHomeGoods} from "network/home";


  export default {
		name: "Home",
    //data存放getHomeMultidata方法请求的数据,因为方法里面是局部变量，方法执行完，变量不存在
    data(){
		  return{
		    banners:[],
        dKeyword:[],
        keywords:[],
        recommends:[],
        goods:{
		      'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]}
        },
        currentType:'pop',
        isShowBackTop:false,
      }
    },
    components: {
      HomeSwiper,
      HomeRecommendView,
      HomeFeatureView,

      //注册的公共组件
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    created() {
		  //1.请求多个数据
		  this.getHomeMultidata();
		  //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    methods:{
		  /*
		  *事件监听相关方法
		  */
      tabClick(index){
        switch (index) {
          case 0:
            this.currentType='pop'
            break
          case 1:
            this.currentType='new'
            break
          case 2:
            this.currentType='sell'
            break
        }
      },
      backClick(){
        this.$refs.scroll.scrollTo(0,0);
        // console.log(this.$refs.scroll.scroll)
      },
      homeScroll(position){
        // console.log(position)
        this.isShowBackTop=(-position.y)>1000
      },
      loadMore(){
        // console.log('上拉加载更多')；
        this.getHomeGoods(this.currentType);
      },
		  /*
		  *网络请求相关方法
		   */
      getHomeMultidata(){
        getHomeMultidata().then(res=>{
          // console.log(res);
          this.banners=res.data.banner;
          this.dKeyword=res.data.dKeyword;
          this.keyword=res.data.keyword;
          this.recommends=res.data.recommend;
        });
      },
      getHomeGoods(type){
        const page=this.goods[type].page+1;
        getHomeGoods(type,page).then(res=>{
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
          // console.log(res)
          this.$refs.scroll.finishPullUp()
        })
      },

    },
    computed:{
		  showGoods(){
		    return this.goods[this.currentType].list
      }
    }
	}
</script>

<style scoped>
  #home{
  padding-top: 44px;
    /*vh     viewport height视口高度*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top: 44px;
    background-color: #fff;
    z-index: 9;
  }

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
