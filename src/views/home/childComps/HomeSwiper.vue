<template>
  <swiper>
    <swiper-item v-for="item in banners.list">
      <a :href="item.link">
        <img :src="item.image" alt="">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from 'components/common/swiper'
  export default {
    name: "HomeSwiper",
    props:{
      banners:{
        //原接口是一个数组，新接口是一个对象
        // type:Array,
        // default(){
        //   return []
        // }
      }
    },
    components:{
      SwiperItem,
      Swiper,
    }
  }
</script>

<style scoped>

</style>
