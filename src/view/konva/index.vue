<template>
  <!-- 
    将事件绑定到节点。 KonvaJS支持鼠标悬停，鼠标移动，
    mouseout，mouseenter，mouseleave，mousedown，mouseup，wheel，contextmenu，click，dblclick，touchstart，touchmove，
    touchend，tap，dbltap，dragstart，dragmove和dragend事件。
  -->
  <div class='container-wraper'>
    <div id='scale-contianer'>
      <v-stage ref='stage' :config='stageSize' @wheel='handleWheel' @dragstart='handleDrag'>
        <v-layer ref='layer' draggable='true'>
          <!-- 地图 -->
          <v-image :config='{
            image: image,
            ...imageConfig,
          }' />
          <!-- 围栏 -->
          <v-line
            :config="{
              x: this.fenceX,
              y: this.fenceY,
              points: this.fencePoints,
              tension: 0,
              closed: true,
              stroke: 'black'
            }"
          />
          <!-- marker标记 -->
          <v-image
            v-for='(item, i) in imgMarkerConfig'
            v-bind:key='item.id'
            @click='mouseClick(item)'
            @mousemove='mouseoverMarker'
            @mouseleave='mouseoutMarker'
            :config='{
                image: imgMarker,
                scaleX: imageConfig.scaleX == currentScale ? imageConfig.scaleX : currentScale,
                scaleY: imageConfig.scaleY == currentScale ? imageConfig.scaleY : currentScale,
                ...imgMarkerConfig[i],
            }'
          />
        </v-layer>
      </v-stage>
      <!-- 提示气泡窗口 -->
      <div class='tipsWindow' slot='tipsWindow'>
        <div class='close'>
          <span @click='closeTips'>×</span>
        </div>
        <div class='content'>
          <el-tooltip class="item" effect="dark" content="Right Center 提示文字" placement="right">
            <div class='msg'>
              {{ msg }}
            </div>
          </el-tooltip>
        </div>
      </div>
      <!-- 缩放 -->
      <div class="scaling-ratio" v-if="isShow">
        <div class="num">{{ scalingNum }}%</div>
      </div>
    </div>
  </div>
</template>

<script>
import Mapimg from '../../assets/map.jpg';
import Marker from '../../assets/marker.png';
import request from '@/http/request'
import mixin from './mixin/mixin.js'

export default {
  mixins: [mixin],
  data () {
    return {
      isShow: false,
      scalingNum: 100,
      msg: '',
      stageSize: {
        width: 0,
        height: 0
      },
      image: null,
      imgMarker: null,
      imageConfig: {
        id: 'myImg',
        scaleX: 0.8,
        scaleY: 0.8,
        x: 0,
        y: 0
      },
      markerList: [],
      imgMarkerConfig: [],
      fencePoints: [],
      fenceX: 0,
      fenceY: 0,
      currentScale: 0.8, // 当前缩放比例
      isTips: true
    }
  },
  computed: {
    // 根据地图初始化缩放的比例，初始化marker坐标位置
    initMarkerCoordinate: function() {
      // 缩放坐标位置
      for (let i = 0; i < this.imgMarkerConfig.length; i++) {
        this.imgMarkerConfig[i].scaleX = 0.8
        this.imgMarkerConfig[i].scaleY = 0.8
        this.imgMarkerConfig[i].x = (this.imgMarkerConfig[i].x * 0.8) + this.imageConfig.x
        this.imgMarkerConfig[i].y = (this.imgMarkerConfig[i].y * 0.8) + this.imageConfig.y
      }
    }
  },
  created() {
    // 初始化
    this.$nextTick(() => {
      this.init()
    })

    // 监听浏览器窗口大小变化
    const that = this
    window.onresize = function(){
      //重新载入地图和标记点
      that.init()
    }
  },
  methods: {
    init: function() {
        // 实例化marker标记点
        const imgMarker = new window.Image()
        imgMarker.src = Marker;

        // 实例化地图背景
        const image = new window.Image()
        image.src = Mapimg;

        //载入地图和标记点
        this.loadMap(image)
        this.loadMarker(imgMarker)
    }
  }
}
</script>

<style lang='less' scoped>
.container-wraper {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
#scale-contianer {
  height: 100%;
  width: 100%;
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
  .scaling-ratio {
    width: 13%;
    height: 10%;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    box-shadow: 10px 10px 10px  rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 1);
    position: absolute; 
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    transform: translateX(-50%);
    // 禁止选中
    -moz-user-select:none; /*火狐*/
    -webkit-user-select:none; /*webkit浏览器*/
    -ms-user-select:none; /*IE10*/
    -khtml-user-select:none; /*早期浏览器*/
    user-select:none;
    .num {
      width: 100%;
      font-size: 3em;
    }
  }
}
.tipsWindow {
  width: 150px;
  height: 200px;
  border: 1px solid rgba(0, 0, 0, 1);
  border-radius: 4px;
  box-shadow: 3px 3px 3px #3d3d3d;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  position: absolute;
  top: 0px;
  left: 0px;
  display: none;
  .content {
    width: 100%;
    height: calc(~'(100% - 20px)');
    overflow-y: auto;
    text-align: center;
    .ivu-tooltip {
      display: block;
    }
  }
  .close {
    width: 100%;
    height: 20px;
    line-height: 20px;
    color: #3d3d3d;
    text-align: right;
  }
  .close span{
    color: red;
    display: block;
    padding-right: 5px;
    cursor: pointer;
  }
}
// 气泡窗口箭头样式
// .tipsWindow::before {
//   content: '';
//   width: 0;
//   height: 0;
//   border: 10px solid;
//   position: absolute;
//   bottom: 170px;
//   left: -20px;
//   border-left-color: transparent;
//   border-right-color: rgba(0, 0, 0, 0.8);
//   border-top-color: transparent;
//   border-bottom-color: transparent;
// }
</style>
