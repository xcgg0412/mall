<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"  @tabClick="tabClick" ref="tabControl1" v-show="isTabFixed" class="tab-control-top" style="z-index: 9"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="homeScroll" :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <home-feature-view/>
      <tab-control :titles="['流行','新款','精选']"  @tabClick="tabClick" ref="tabControl2"/>
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

  //导入的方法
  import {getHomeMultidata,getHomeGoods} from "network/home";
  import {itemListenerMinxin,backTop} from "common/mixin";

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
        // isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0,
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
    },
    mixins:[itemListenerMinxin,backTop],
    created() {
		  //1.请求多个数据
		  this.getHomeMultidata();
		  //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    mounted() {
		  //这个地方img确实被挂载，但是没有占据高度
		  //1.图片加载的防抖动


    },
    //通路scrollTo函数设置离开时位置
    activated() {
		  this.$refs.scroll.scrollTo(0,this.saveY,0);
		  this.$refs.scroll.refresh();
    },
    //记录离开时的位置
    deactivated() {
		  //1.保存Y值
		  this.saveY=this.$refs.scroll.getScrollY();
		  //2.取消全局事件的监听
      //不能只传一个事件，否则所有的事件都被取消，还要传一个监听的函数
      this.$bus.$off('itemImageLoad',this.itemImgListener)
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
        //同步tabControl1、tabControl2的currentIndex
        this.$refs.tabControl1.currentIndex=index;
        this.$refs.tabControl2.currentIndex=index;
      },
      // backClick(){
      //   this.$refs.scroll.scrollTo(0,0);
      //   // console.log(this.$refs.scroll.scroll)
      // },
      homeScroll(position){
        // console.log(position)
        //1.判断backTop是否显示
        //没抽离到混入
        this.isShowBackTop=(-position.y)>1000;
        //2.决定tabControl是否吸顶
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      loadMore(){
        // console.log('上拉加载更多');
        this.getHomeGoods(this.currentType);
      },
      swiperImageLoad(){
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop;
        // console.log(this.tabOffsetTop)
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
    /*padding-top: 44px;*/
    /*vh     viewport height视口高度*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /*在浏览器原生滚动时，为了不让导航跟随滚动而设置*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.tab-control{*/
  /*  position: sticky;*/
  /*  top: 44px;*/
  /*  background-color: #fff;*/
  /*  z-index: 9;*/
  /*}*/

  .content{
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control-top{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
