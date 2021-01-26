import request from '@/http/request'

export default {
  data () {
    return {

    }
  },
  created() {

  },
  computed: {

  },
  methods:{
    // 载入地图
    loadMap: function(image) {
      image.onload = () => {
        this.image = image
        const { scaleX, scaleY } = this.imageConfig

        const scaleContainer = document.getElementById('scale-contianer')
        if(!scaleContainer) return
        const containerWidth = scaleContainer.clientWidth
        const containerHeight = scaleContainer.clientHeight
        this.stageSize = {
          width: containerWidth,
          height: containerHeight
        }

        // 设置图片位于中心点
        const x = (containerWidth - image.width * scaleX) / 2
        const y = (containerHeight - image.height * scaleY) / 2
        this.imageConfig.x = x < 0 ? 0 : x
        this.imageConfig.y = y < 0 ? 0 : y


        // 请求marker标记点分布
        // request.http_mock('/api/marker').then(res => {
        //   console.log(res);
        // })
        setInterval(() => {
          this.$axios.get('/api/marker').then(response => {
            this.imgMarkerConfig = response.data.list;
            this.markerList = response.data.defaultList;
            // 调用computed中定义的initMarkerCoordinate对marker位置进行初始化
            this.initMarkerCoordinate
            // 围栏
            this.fenceCoordinate();
          })
        }, 10000)
      }
    },
    // 计算坐标缩放
    calcCoordinate(data) {
      data.forEach(item => {
        item.x = item.x * currentScale
        item.y = item.y * currentScale
      })
      return data
    },
    // 载入标记点
    loadMarker: function(imgMarker) {
      imgMarker.onload = () => {
        this.imgMarker = imgMarker
      }
    },
    handleWheel: function(e) {
      this.isShow = true;
      // 在这里监听鼠标滚轮是否停止滚动
      setTimeout (() => {
        if (this.imageConfig.scaleX == scale) {
          this.isShow = false;
        }
      }, 1000)
      // 缩放时先关闭显示的气泡
      this.closeTips()
      // 地图缩放
      const shape = e.target
      // if (shape.attrs.id !== 'myImg') {
      //   // 只允许在图片上点击滚轮缩放
      //   return
      // }
      let scale = this.imageConfig.scaleX
      if (e.evt.deltaY > 0 && scale > 0.25) { // 缩小
        scale = scale - 0.05
      } else if (e.evt.deltaY < 0 && scale < 1.5) { // 放大
        scale = scale + 0.05
      }
      // 提示
      if (scale >1.5 && this.imageConfig.scaleX != scale) {
        this.currentScale = scale // 存当前缩放比例
        this.$Message.warning('已经放大到最大等级');
      } else if (scale < 0.25 && this.imageConfig.scaleX != scale) {
        this.currentScale = scale // 存当前缩放比例
        this.$Message.warning('已经缩小到最小等级');
      }
      // 画布赋值
      this.imageConfig.scaleX = scale
      this.imageConfig.scaleY = scale

      // 根据缩放控制marker位置
      this.zoomCoordinate(this.calcCoordinate(this.markerList), scale)
      // 根据缩放控制围栏位置
      // this.fenceCoordinate();
      // 缩放百分比
      this.scalingNum = this.toFixed(scale / 0.8, 2);
    },
    toFixed: function(num, s) {
      let times = Math.pow(100, s);
      let des = num * times + 0.5;
      des = parseInt(des, 10) / 100;
      return des.toFixed(0)
    },
    // 拖拽画布
    handleDrag: function(e) {
      this.closeTips()
    },
    // 缩放比例
    zoomCoordinate: function(markerList, scale) {
      // 根据缩放控制marker位置
      for (let i = 0; i < markerList.length; i++) {
        this.imgMarkerConfig[i].scaleX = scale
        this.imgMarkerConfig[i].scaleY = scale
        this.imgMarkerConfig[i].x = (markerList[i].x * scale) + this.imageConfig.x
        this.imgMarkerConfig[i].y = (markerList[i].y * scale) + this.imageConfig.y
      }
    },
    // 控制围栏位置
    fenceCoordinate: function() {
      this.$axios.get('/api/fence').then(response => {
        const defaultPoints = response.data.list;
        this.fenceX = (300 * this.imageConfig.scaleX) + this.imageConfig.x;
        this.fenceY = (230 * this.imageConfig.scaleY) + this.imageConfig.y;
        this.fencePoints = [];
        for (let i = 0; i < defaultPoints.length; i++) {
          this.fencePoints.push(defaultPoints[i].x * this.imageConfig.scaleX);
          this.fencePoints.push(defaultPoints[i].y * this.imageConfig.scaleY);
        }
      })
    },
    // 鼠标经过marker标记
    mouseoverMarker: function(e) {
      if (this.isTips) {
        document.getElementsByClassName('tipsWindow')[0].style.display = 'block'
        document.getElementsByClassName('tipsWindow')[0].style.left =
          (e.target.attrs.x + 40) + "px"
        document.getElementsByClassName('tipsWindow')[0].style.top =
          (e.target.attrs.y - 10) + "px"
        // 给气泡填充显示信息
        this.msg = e.target.attrs.name
      }
    },
    // 鼠标离开marker
    mouseoutMarker: function(e) {
      if (this.isTips) {
        document.getElementsByClassName('tipsWindow')[0].style.display = 'none'
      }
    },
    // 点击marker标记，固定气泡其实窗
    mouseClick: function(e){
      this.isTips = false
      console.log(e)
    },
    // 关闭气泡
    closeTips: function(e){
      this.isTips = true
      document.getElementsByClassName('tipsWindow')[0].style.display = 'none'
    },
    // getData: function() {
    //   request.http_mock('/api/marker').then(response => {
    //     console.log(response)
    //   })
    // }
  },
}
