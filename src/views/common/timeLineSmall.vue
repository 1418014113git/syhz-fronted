<template>
  <div>
    <div v-if="points && points.length < 1">
      <p style="line-height: 150px; text-align: center">暂无数据</p>
    </div>
    <div v-else class="timeline-container timeline" v-loading="loading">
      <div @click="changeCurrentTimePoint(point)" v-for="point in points" class="timeline-block">
        <div class="timeline-img" :class="['timeline-img',point.pointColor===undefined?'red':point.pointColor]">
          <!--<img v-if="point.img" :src="getImg(point.img)" alt="">-->
        </div>
        <div class="timeline-content">
          <p v-text="point.text" style="padding-left: 5px;"></p>
          <!--<p v-if="point.text1" v-text="point.text1"></p>-->
          <!--<p v-if="point.text2" v-text="point.text2"></p>-->
          <!--<a :href="point.linkUrl" class="read-more" target="_blank" v-if="point.linkUrl" v-html="point.linkText!=undefined?point.linkText:'Read more'"-->
          <!--&gt;</a>-->
          <span v-if="point.date" class="date" v-text="point.date"></span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {
    getLineList
  } from '@/api/timeLine'
  export default{
    props: [
      'caseId', 'type'
    ],
    data() {
      return {
        loading: false,
        points: [],
        defaultImg: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNDg2OTExMDgyNTYzIiBjbGFzcz0iaWNvbiIgc3R5bGU9IiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIxNDYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMzYxLjU2NTEwNSAwbDI5Ni44NzcxNjkgMCAwIDk3LjYwNzMxMy0yOTYuODc3MTY5IDAgMC05Ny42MDczMTNaIiBwLWlkPSIyMTQ3Ij48L3BhdGg+PHBhdGggZD0iTTQ2MS4xOTIyMDQgMzQzLjYyOTcyNWw5Ny42MDczMTMgMCAwIDI0NC4wMDI2MjYtOTcuNjA3MzEzIDAgMC0yNDQuMDAyNjI2WiIgcC1pZD0iMjE0OCI+PC9wYXRoPjxwYXRoIGQ9Ik05NTMuMjA1NzEzIDE2Mi42MDA1NjlsLTY5LjAwMTUxMy02OS4wMDE1MTMtMTI3LjcwMDU1MyAxMjcuNzAwNTUzYy03MC4yODU0MDctNDcuNzU0NjIxLTE1NS4xMTY0MDMtNzUuNzAyODE3LTI0Ni40OTIxMjktNzUuNzAyODE3QzI2Ny40MzM3MDEgMTQ1LjU5Njc5MyA3MC43OTQyNjUgMzQyLjIyMDU3MiA3MC43OTQyNjUgNTg0Ljc5ODM4OWMwIDI0Mi41NjIxNTkgMTk2LjYzOTQzNyA0MzkuMjAxNTk2IDQzOS4yMDE1OTYgNDM5LjIwMTU5NiAyNDIuNTc3ODE2IDAgNDM5LjIwMTU5Ni0xOTYuNjM5NDM3IDQzOS4yMDE1OTYtNDM5LjIwMTU5NiAwLTExNS45MjYyOTktNDUuMjQ5NDYtMjIxLjA0OTA5NC0xMTguNjM1MDA0LTI5OS41NTQ1NTlMOTUzLjIwNTcxMyAxNjIuNjAwNTY5ek04NTEuNjA1OCA1ODQuNzk4Mzg5YzAgMTg4LjY1NDIzOC0xNTIuOTQwMDQ0IDM0MS42MDk5NC0zNDEuNjA5OTQgMzQxLjYwOTk0UzE2OC40MDE1NzggNzczLjQ1MjYyNyAxNjguNDAxNTc4IDU4NC43OTgzODljMC0xODguNjY5ODk1IDE1Mi45NDAwNDQtMzQxLjYwOTk0IDM0MS42MDk5NC0zNDEuNjA5OTRTODUxLjYwNTggMzk2LjEyODQ5NCA4NTEuNjA1OCA1ODQuNzk4Mzg5eiIgcC1pZD0iMjE0OSI+PC9wYXRoPjwvc3ZnPg=='
      }
    },
    components: {},
    methods: {
      getImg: function(imgurl) {
        const ImgObj = new Image() // 判断图片是否存在
        ImgObj.src = imgurl
        // 没有图片，则返回-1
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
          return imgurl
        } else {
          return this.defaultImg
        }
      },
      changeCurrentTimePoint: function(point) {
      },
      getData() {
        if (this.caseId && this.type) {
          this.loading = true
          getLineList({
            caseId: this.caseId, type: this.type
          }).then((res) => {
            this.loading = false
            this.points = []
            if (res.code === '000000' && res.data) {
              res.data.forEach((e, i) => {
                this.points.push({
                  text: e.userName + '：' + e.actionType, date: e.time, pointColor: i === 0 ? 'red' : 'green'
                })
              })
            }
          }).catch(() => {
            this.loading = false
          })
        }
      }
    },
    mounted() {
      if (this.caseId) {
        this.getData()
      }
    },
    watch: {
      caseId(val) {
        this.getData()
      },
      type(val) {
        this.getData()
      }
    }
  }
</script>
<style scoped>
.timeline-container {
	width: 90%;
	max-width: 1170px;
	margin: 0 auto;
	font-size: 16px;
}
.timeline-container::after {
	content: '';
	display: table;
	clear: both;
}
.timeline {
	position: relative;
	margin-top: 2em;
}
.timeline::before {
	content: '';
	position: absolute;
	top: 0;
	left: 18px;
	height: 100%;
	width: 4px;
	background: #d7e4ed;
}
@media only screen and (min-width: 1170px) {
	.timeline {
		margin-top: 30px;
		margin-bottom: 20px;
	}
	.timeline::before {
		left: 50%;
		margin-left: -2px;
	}
}
.timeline-block {
	position: relative;
	margin: 1em 0;
}
.timeline-block:after {
	content: '';
	display: table;
	clear: both;
}
.timeline-block:first-child {
	margin-top: 0;
}
.timeline-block:last-child {
	margin-bottom: 0;
}
@media only screen and (min-width: 1170px) {
	.timeline-block {
		margin: 2em 0;
	}
	.timeline-block:first-child {
		margin-top: 0;
	}
	.timeline-block:last-child {
		margin-bottom: 0;
	}
}
.timeline-img {
	position: absolute;
	top: 0;
	left: 7px;
	width: 25px;
	height: 25px;
	border-radius: 50%;
	box-shadow: 0 0 0 4px white, inset 0 2px 0 rgba(0, 0, 0, 0.08), 0 3px 0 4px rgba(0, 0, 0, 0.05);
}
.timeline-img img {
	display: block;
	width: 20px;
	height: 20px;
	position: relative;
	left: 50%;
	top: 50%;
	margin-left: -10px;
	margin-top: -10px;
}
.timeline-img.green {
	background: #75ce66;
}
.timeline-img.red {
	background: #c03b44;
}
.timeline-img.yellow {
	background: #f0ca45;
}
@media only screen and (min-width: 1170px) {
	.timeline-img {
		width: 25px;
		height: 25px;
		top: 70%;
		left: 50%;
		margin-left: -12px;
		/* Force Hardware Acceleration in WebKit */
		-webkit-transform: translateZ(0);
		-webkit-backface-visibility: hidden;
	}
	.cssanimations .timeline-img.is-hidden {
		visibility: hidden;
	}
	.cssanimations .timeline-img.bounce-in {
		visibility: visible;
		-webkit-animation: bounce-1 0.6s;
		-moz-animation: bounce-1 0.6s;
		animation: bounce-1 0.6s;
	}
}
.timeline-content {
	position: relative;
	margin-left: 60px;
	/* background: white; */
	border-radius: 0.25em;
	box-shadow: 0 3px 0 #d7e4ed;
}
.timeline-content:after {
	content: '';
	display: table;
	clear: both;
}
.timeline-content h2 {
	color: #303e49;
}
.timeline-content p,
.timeline-content .read-more,
.timeline-content .date {
	font-size: 16px;
	font-size: 0.875rem;
}
.timeline-content .read-more,
.timeline-content .date {
	display: inline-block;
}
.timeline-content p {
	margin: 10px 0;
	line-height: 1.6;
}
.timeline-content .read-more {
	float: right;
	padding: 0.8em 1em;
	background: #acb7c0;
	color: white;
	border-radius: 0.25em;
}
.no-touch .timeline-content .read-more:hover {
	background-color: #bac4cb;
}
a.read-more:hover {
	text-decoration: none;
	background-color: #424242;
}
.timeline-content .date {
	float: left;
	padding: 0.5em 0;
	opacity: 0.7;
}
.timeline-content::before {
	content: '';
	position: absolute;
	top: 58px;
	right: 100%;
	height: 0;
	width: 0;
	border: 7px solid transparent;
	border-right: 7px solid white;
}
@media only screen and (min-width: 768px) {
	.timeline-content h2 {
		font-size: 20px;
	}
	.timeline-content p {
		font-size: 16px;
	}
	.timeline-content .read-more,
	.timeline-content .date {
		font-size: 16px;
	}
}
@media only screen and (min-width: 1170px) {
	.timeline-content {
		margin-left: 0;
		width: 45%;
	}
	.timeline-content::before {
		top: 29px;
		left: 99%;
		border-color: transparent;
		border-left-color: white;
	}
	.timeline-content .read-more {
		float: left;
	}
	.timeline-content .date {
		position: absolute;
		width: 100%;
		left: 122%;
		top: 70%;
		font-size: 16px;
	}
	.timeline-block:nth-child(even) .timeline-content {
		float: right;
	}
	.timeline-block:nth-child(even) .timeline-content::before {
		top: 39px;
		left: auto;
		right: 99%;
		border-color: transparent;
		border-right-color: white;
	}
	.timeline-block:nth-child(even) .timeline-content .read-more {
		float: right;
	}
	.timeline-block:nth-child(even) .timeline-content .date {
		left: auto;
		right: 122%;
		text-align: right;
	}
	.cssanimations .timeline-content.is-hidden {
		visibility: hidden;
	}
	.cssanimations .timeline-content.bounce-in {
		visibility: visible;
		-webkit-animation: bounce-2 0.6s;
		-moz-animation: bounce-2 0.6s;
		animation: bounce-2 0.6s;
	}
}
@media only screen and (min-width: 1170px) {
	/* inverse bounce effect on even content blocks */
	.cssanimations .timeline-block:nth-child(even) .timeline-content.bounce-in {
		-webkit-animation: bounce-2-inverse 0.6s;
		-moz-animation: bounce-2-inverse 0.6s;
		animation: bounce-2-inverse 0.6s;
	}
}
</style>
