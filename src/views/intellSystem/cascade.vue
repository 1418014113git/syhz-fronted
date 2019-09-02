<template>
  <div class="cascade">
    <div id="forceDiv" style="min-width: 850px; min-height: 500px;">
      <svg id="svgContainer"
           :style="{minWidth: minWidth +'px', minHeight: minHeight +'px', width: svgWidth + 'px', height: svgHeight + 'px'}">
        <circle cx="20" cy="30" r="10" class="colorQB"></circle>
        <circle cx="20" cy="60" r="10" class="colorAJ"></circle>
        <circle cx="20" cy="90" r="10" class="colorCP"></circle>
        <circle cx="20" cy="120" r="10" class="colorPS"></circle>
        <text x="36" y="35" fill="#eeeeee">情报</text>
        <text x="36" y="65" fill="#eeeeee">案件</text>
        <text x="36" y="95" fill="#eeeeee">企业</text>
        <text x="36" y="125" fill="#eeeeee">人员</text>
        <path v-for="item in paths" :d="item.point" :class="item.color" stroke-width="1" fill="none"></path>
        <circle v-for="item in drawData" :cx="item.x" :cy="item.y" :r="item.r" :class="item.class"></circle>
        <circle :cx="cmodelX" :cy="cmodelY" :r="circleR" class="colorQB"></circle>
        <text v-if="qbBean.name" :x="cmodelX" :y="cmodelY" fill="#eeeeee" text-anchor="middle">{{qbBean.name}}</text>
        <text v-for="item in drawData" :x="item.tx" :y="item.ty" fill="#eeeeee" :text-anchor="item.anchor">{{item.name}}</text>
      </svg>
    </div>
  </div>
</template>

<script>
  import {
    getAJList, getCPList, getPSList, getQBBean
  } from '@/api/caseCade'
  export default {
    name: 'cascade',
    data() {
      return {
        circleR: 20,
        minWidth: 850,
        minHeight: 500,
        svgWidth: 0,
        svgHeight: 0,
        rectW: 100,
        rectH: 80,
        cmodelX: 0,
        cmodelY: 0,
        fontWidth: 14.2,
        qbId: '',
        force1: '',
        paths: [],
        drawData: [],
        testpoint: '',
        ajData: [],
        psData: [],
        cpData: [],
        qbBean: {},
        resultBack: 0
      }
    },
    methods: {
      initSvg() {
        this.svgWidth = document.body.clientWidth
        this.svgHeight = document.body.clientHeight
        if (this.svgHeight < 500) {
          this.svgHeight = 700
        }
        if (this.svgWidth < 800) {
          this.svgWidth = 800
        }
        this.svgWidth = this.svgWidth * 0.97 - 40
        this.svgHeight = this.svgHeight - 200
        this.cmodelX = this.svgWidth / 2
        this.cmodelY = this.svgHeight / 2
      },
      init() {
        this.initSvg()
        this.forceX()
      },
      forceX() {
        this.drawData = this.drawData.concat(this.ajData)
        this.drawData = this.drawData.concat(this.psData)
        this.drawData = this.drawData.concat(this.cpData)
        this.drawData = this.initPoint(this.drawData)
      },
      initPoint(arr) {
        const result = []
        let a = 60
        let plus = 0
        let r = 100
        let cr = 20
        for (let i = 0; i < arr.length; i++) {
          if (i <= 5) {
            plus = 270
          } else if (i > 5 && i <= 50) {
            plus = 240
            r = 200
            a = 360 / (arr.length - 6)
          } else if (i > 50 && i <= 120) {
            plus = 240
            r = 300
            a = 360 / (arr.length - 51)
            cr = 10
          }
          const ao = i * a + plus
          const xy = this.cipherXY(r, ao)
          const obj = arr[i]
          obj.x = xy.x
          obj.y = xy.y
          obj.r = cr
          const fxy = this.cipherXY(r + 20, ao % 360)
          obj.tx = fxy.x
          obj.ty = fxy.y
          this.getFontAnchor(ao % 360, obj)
          obj.class = 'color' + obj.type
          if (i > -1) {
            const xy1 = this.cipherXY(r - 20, ao)
            this.paths.push({
              // point: 'M ' + this.cmodelX + ' ' + this.cmodelY + ' Q ' + this.cmodelX + ' ' + this.cmodelY + ' ' + xy1.x + ' ' + xy1.y,
              point: 'M ' + xy1.x + ' ' + xy1.y + ' L ' + this.cmodelX + ' ' + this.cmodelY,
              color: 'line' + obj.type
            })
          }
          result.push(obj)
        }
        return result
      },
      cipherXY(r, ao) {
        return {
          x: this.cmodelX + r * Math.cos(ao * Math.PI / 180),
          y: this.cmodelY + r * Math.sin(ao * Math.PI / 180)
        }
      },
      getFontAnchor(ao, obj) {
        if (ao < 90 || ao > 270) {
          obj.anchor = 'start'
        }
        if (ao > 90 && ao < 270) {
          obj.anchor = 'end'
        }
        if (ao === 90 || ao === 270) {
          obj.anchor = 'middle'
        }
        return obj
      },
      getData() {
        const para = {
          qbId: this.qbId
        }
        this.ajData = []
        getAJList(para).then((res) => {
          if (res.code === '000000' && res.data) {
            res.data.forEach((item) => {
              item['type'] = 'AJ'
              this.ajData.push(item)
            })
          }
          this.resultBack += 1
        })
        this.cpData = []
        getCPList(para).then((res) => {
          if (res.code === '000000' && res.data) {
            res.data.forEach((item) => {
              item['type'] = 'CP'
              this.cpData.push(item)
            })
          }
          this.resultBack += 1
        })
        this.psData = []
        getPSList(para).then((res) => {
          if (res.code === '000000' && res.data) {
            res.data.forEach((item) => {
              item['type'] = 'PS'
              this.psData.push(item)
            })
          }
          this.resultBack += 1
        })
        this.qbBean = {}
        getQBBean({
          id: this.qbId
        }).then((res) => {
          if (res.code === '000000' && res.data) {
            this.qbBean = {
              id: res.data.id, name: res.data.BT, type: 'QB', isMain: true
            }
          }
          this.resultBack += 1
        })
      }
    },
    mounted() {
      if (this.$route.params) {
        this.qbId = this.$route.params.id
        this.getData()
      }
    },
    watch: {
      resultBack(val) {
        if (val === 4) {
          this.init()
        }
      }
    }
  }
</script>

<style scoped>
.bt {
	fill: blue;
	stroke: pink;
	stroke-width: 2px;
	fill-opacity: 0.1;
	/* fill-opacity 属性定义填充颜色透明度 stroke-opacity: 0.9 / / stroke-opacity 属性定义笔触颜色的透明度*/
}

.cascade {
	/* background-color: #f3f3f3; */
}
/*.cascade circle {*/
/*cursor: pointer;*/
/*}*/

.colorQB {
	fill: #61a0a8;
	stroke: none;
}
/*.colorQB:hover {*/
/*opacity: 0.5;*/
/*}*/
.colorAJ {
	fill: #749f83;
	stroke: none;
}
/*.colorAJ:hover {*/
/*opacity: 0.5;*/
/*}*/
.colorPS {
	fill: #91c7ae;
	stroke: none;
}
/*.colorPS:hover {*/
/*opacity: 0.5;*/
/*}*/
.colorCP {
	fill: #bda29a;
	stroke: none;
}
/*.colorCP:hover {*/
/*opacity: 0.5;*/
/*}*/

.lineQB {
	stroke: #61a0a8;
}
.lineAJ {
	stroke: #749f83;
}
.linePS {
	stroke: #91c7ae;
}
.lineCP {
	stroke: #bda29a;
}
/*#c23531*/
/*#61a0a8*/
/*#91c7ae*/
/*#ca8622*/
/*#749f83*/
/*#6e7074*/
/*#bda29a*/

/*stroke-width: 2px;*/
/*stroke-opacity: 1;*/
</style>
