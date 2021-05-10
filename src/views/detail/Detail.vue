<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probeType="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommendList"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "network/detail";
  import {itemListenerMinxin,backTop} from "common/mixin";
  import {debounce} from "common/utils";

  export default {
    name: "Detail",
    data(){
      return {
        iid:null,
        topImages:[],
        goods:{},
        shop:{},
        detailInfo:{},
        paramInfo:{},
        commentInfo:{},
        recommendList:[],
        themeTopYs:[],
        getThemeTopY:null,
        currentIndex:0,
        // isShowBackTop:false,



      }
    },
    components:{
      DetailCommentInfo,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,


      Scroll,
      GoodsList,
    },
    mixins:[itemListenerMinxin,backTop],
    created () {
      //1.保存传过来的参数,获取iid
      // console.log(this.$route.params)
      this.iid=this.$route.params.id;

      //2.根据传过来的参数获取数据,请求详情数据
      getDetail(this.iid).then(res=>{
        //1.获取商品轮播图数据
        const data=res.result;
        // console.log(res);
        this.topImages=data.itemInfo.topImages;

        //2.获取商品信息
        this.goods=new Goods(data.itemInfo,data.columns,data.shopInfo.services);

        //3.获取店铺信息
        this.shop=new Shop(data.shopInfo);

        //4.获取商品详情信息
        this.detailInfo=data.detailInfo;

        //5.获取商品参数信息
        this.paramInfo=new GoodsParam(data.itemParams.info,data.itemParams.rule);

        //6.获取商品评论信息
        if (data.rate.list){
          this.commentInfo=data.rate.list[0]
        }

        //这里是点击标题滚动到相应内容
        //第一次获取，值不对，因为this.$refs.params.$el压根没有渲染
        // this.themeTopYs=[];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        // console.log(this.themeTopYs)

        // this.$nextTick(()=>{
        //   //第二次获取值，值不对，因为图片没有被计算在内，没有加载完
        //   //根据最新的数据，dom已经被渲染出来
        //   //但是图片依旧没有加载完
        //   this.themeTopYs=[];
        //
        //   this.themeTopYs.push(0);
        //   this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        //   console.log(this.themeTopYs)
        // })
      });

      //3.请求推荐数据
      getRecommend().then(res=>{
        console.log(res);
        this.recommendList=res.data.list;
      });

      //4.给getThemeTopY赋值
      this.getThemeTopY=debounce(()=>{
        this.themeTopYs=[];

        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        this.themeTopYs.push(Number.MAX_VALUE);
        // console.log(this.themeTopYs)
      },500)
    },
    mounted() {
      // console.log('bbb')
    },
    destroyed() {
      this.$bus.$off('itemImageLoad',this.itemImgListener);

    },
    methods:{
      imageLoad(){
        this.$refs.scroll.refresh();
        this.refresh();

        // this.refresh()

      },
      titleClick(index){
        // console.log(index)
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      contentScroll(position){
        // console.log(position)
        //1.获取Y值
        const positionY=-position.y;
        let length=this.themeTopYs.length;

        for(let i = 0; i < length-1;i++){
          //2.将positionY和主题中的值进行对比
          //[0,参数的Y，评论的Y，推荐的Y，Number.MAX_VALUE]
          //hack方法
          if (this.currentIndex!==i && (positionY>=this.themeTopYs[i] && positionY<this.themeTopYs[i+1])){
              this.currentIndex=i;
              // console.log(this.currentIndex)
              this.$refs.nav.currentIndex=this.currentIndex
          }
          // if (this.currentIndex!=i && ((i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) ||
          //   (i===length-1 && positionY>this.themeTopYs[i]))){
          //   this.currentIndex=i;
          //   // console.log(this.currentIndex)
          //   this.$refs.nav.currentIndex=this.currentIndex
          // }
        }

        //3.判断backTop是否显示
        this.isShowBackTop=(-position.y)>1000;

      },
      // backClick(){
      //   // console.log(this.$refs.scroll.scroll)
      //   this.$refs.scroll.scrollTo(0,0);
      // },
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    left: 0;
    right: 0;
    top: 0;
    background-color: #fff;
    z-index: 9;
  }

  .content{
    height: calc(100% - 44px - 58px);
  }

  .back-top{
    position: fixed;
    right: 8px;
    bottom: 70px;
  }
</style>
