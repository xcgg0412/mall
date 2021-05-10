<template>
  <div class="goods" @click="itemClick">
    <img :src="showImage" alt="" @load="imageLoad"/>
    <div class="goods-info">
      <p >{{goodsItems.title}}</p>
      <span class="price">{{goodsItems.price}}</span>
      <span class="collect">{{goodsItems.cfav}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GoodslistItem",
    props:{
      goodsItems:{
        type: Object,
        default(){
          return {}
        }
      }
    },
    methods:{
      imageLoad(){
        // console.log('img load')
        this.$bus.$emit('itemImageLoad')
      },
      itemClick(){
        // console.log('xiagnqing')
        this.$router.push('/detail/' + this.goodsItems.iid)
      }
    },
    computed:{
      showImage(){
        return this.goodsItems.image || this.goodsItems.show.img
      }
    }
  }
</script>

<style scoped>
  .goods{
    padding-bottom: 40px;
    position: relative;

    width: 48%;
  }
  .goods img{
    width: 100%;
  }

  .goods-info{
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price{
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect{
    position: relative;
  }

  .goods-info .collect::before{
    content: '';
    position: absolute;
    left: -15px;
    top: 0;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }

</style>
