<template>
  <div id="detail">
    <detail-nav-bar></detail-nav-bar>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";

  export default {
    name: "Detail",
    data(){
      return {
        iid:null
      }
    },
    components:{
      DetailNavBar
    },
    created () {
      // console.log(this.$route.params)
      this.iid=this.$route.params.id
    }
  }
</script>

<style scoped>

</style>
