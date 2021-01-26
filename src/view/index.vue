<template>
    <div class="content">
        <!-- 轮播 -->
        <div class="carousel-box">
            <Carousel :height="carouselHeight" v-model="current" loop autoplay :autoplay-speed="6000">
                <CarouselItem v-for="(item, i) in carouselData" :key="i">
                    <div class="demo-carousel">{{ item.name }}</div>
                </CarouselItem>
            </Carousel>
            <!-- 轮播无数据 -->
            <div class="no-data">暂无数据</div>
        </div>
        <!-- 内容 -->
        <div class="detail-box">
            6666
        </div>
    </div>
</template>

<script>

export default {
  mixins: [],
  data () {
    return {
        current: 0,
        carouselHeight: document.documentElement.clientHeight - 104,
        carouselData: [],
    }
  },
  components: {

  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.content {
    width: 100%;
    height: 100%;
    .carousel-box {
        width: 100%;
        height: 100%;
        .bg-mask {
            width: 100%;
            height: 100%;
            background-image: url("../assets/bg.jpg");
            background-size: cover;
            filter: blur(20px);
        }
    }
    .detail-box {
        width: 100%;
        height: 1200px;
        background: #fff;
        border:1px solid red;
    }
}
</style>
