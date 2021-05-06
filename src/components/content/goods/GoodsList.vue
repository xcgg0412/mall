<template>
  <div class="goods">
    <goodslist-item v-for="item in goods" :goods-items="item"/>
  </div>
</template>

<script>
  import GoodslistItem from "./GoodslistItem";
  export default {
    name: "GoodsList",
    components:{
      GoodslistItem
    },
    props:{
      goods:{
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>
  .goods{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
</style>
