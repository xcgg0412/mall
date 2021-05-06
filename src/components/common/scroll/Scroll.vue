<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    data(){
      return {
        scroll:null
      }
    },
    props:{
      probeType:{
        type:Number,
        default(){
          return 0
        }
      },
      pullUpLoad:{
        type: Boolean,
        default() {
          return false
        }
      }
    },
    mounted() {
      //1.创建BScroll对象
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.probeType
      });
      //2.监听滚动位置
      this.scroll.on('scroll', (position) => {
        // console.log(position)
        this.$emit('scroll', position)
      });
      //3.监听上拉加载事件
      this.scroll.on('pullingUp', () => {
        // console.log('上拉加载更多');
        //   setTimeout(()=>{
        //     this.scroll.finishPullUp()
        //   },2000)
        // })
        this.$emit('pullingUp')
      })
    },
    methods:{
      //将scrollTop封装，在home组件btnClick中调用该组件对象中的scrollTop方法
      scrollTo(x,y,time=300){
        this.scroll.scrollTo(x,y,time)
      },
      //将finishPullUp进行封装
      finishPullUp(){
        this.scroll.finishPullUp()
      }
    }


  }
</script>

<style scoped>

</style>
