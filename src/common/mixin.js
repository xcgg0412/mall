import {debounce} from "common/utils";
import BackTop from "components/content/back-top/BackTop";


export const itemListenerMinxin={
  data(){
    return{
      itemImgListener:null,
      refresh:null
    }
  },
  mounted(){
    this.refresh=debounce(this.$refs.scroll.refresh,100);
    //保存监听的函数
    this.itemImgListener=()=>{
      this.refresh();
      if (this.themeTopYs){
        this.getThemeTopY()
      }

    };
    this.$bus.$on('itemImageLoad',this.itemImgListener);
    // console.log('aaa')
  }
}

export const backTop={
  data(){
    return{
      isShowBackTop:false,
    }
  },
  components:{
    BackTop
  },
  methods:{
    backClick(){
      this.$refs.scroll.scrollTo(0,0);
      // console.log(this.$refs.scroll.scroll)
    },
  }
}
