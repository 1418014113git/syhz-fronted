<template>
  <div class="portal-list">
    <div>
      <div class="tabList">
        <span v-for="(item,index) in tabList" :key="index" :class="{'onClick':curIndex === index}" @click="checkTab(item.type,index)">{{item.title}}({{item.total}})</span>
      </div>
      <ul class="portal_carousel_ul">
        <template v-if="isShowAll">
          <div v-if="listData.length > 0">
             <li v-for="(data,index) in listData" :key="index" style="margin-bottom: 10px;">
              <p class="ajbh-color zbMainTit" @click="goTztgDetail(data.messageId)" :title="data.title">
                <span class="ellipsis-word text">{{ data.title }}</span>
                <span style="float: right;color:#fff;">{{$parseTime(new Date(data.createTime), '{y}-{m}-{d}')}}</span>
              </p>
              <p>
                <span class="f_color_409EFF">{{data.creatorName}}</span>
                <span class="f_color_409EFF" v-if="curDept.id === Number(data.create_org_id)">本部门</span>
                <span class="f_color_409EFF" v-else-if="String(data.isSign) === '1'">已签收</span>
                <span class="f_color_e6a23c" v-else-if="String(data.isSign) === '0'">待签收</span>
              </p>
            </li>
          </div>
          <div v-if="listData.length < 1" style="line-height: 247px; text-align: center; color: #fff;font-size:15px;">
            暂无数据
          </div>
        </template>
        <template v-if="!isShowAll">
          <div v-if="classData.length > 0" >
             <li v-for="(data,index) in classData" :key="index" style="margin-bottom: 10px;">
              <p class="ajbh-color zbMainTit" @click="goTztgDetail(data.messageId)" :title="data.title">
                <span class="ellipsis-word" style="width:70%; overflow:hidden;">{{ data.title }}</span>
                <span style="float: right;color:#fff;">{{$parseTime(new Date(data.createTime), '{y}-{m}-{d}')}}</span>
              </p>
              <p>
                <span class="f_color_409EFF">{{data.creatorName}}</span>
              </p>
            </li>
          </div>
          <div v-if="classData.length < 1" style="line-height: 247px; text-align: center; color: #fff;font-size:15px;">
            暂无数据
          </div>
        </template>

      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'List',
    data() {
      return {
        listData: [],
        classData: [], // 除了全部以外的其他分类菜单列表数据
        isShowAll: true, // 是否显示“全部”分类下的列表
        curDept: {},
        curUser: {},
        curIndex: 0,
        tabList: [
          {
            title: '全部',
            type: '',
            total: 0
          },
          {
            title: '未签收',
            type: '1',
            total: 0
          }
        ]
      }
    },
    methods: {
      queryAll() { // 查询全部分类
        const param = {
          pageNum: 1,
          pageSize: 5,
          curDeptId: this.curDept.id,
          userId: this.curUser.id,
          checkFlag: this.$isViewBtn('149005')
        }
        this.$query('notice/home', param).then((response) => {
          const data = response.data
          this.tabList[0].total = data.total
          this.tabList[1].total = data.unSignNum
          this.classData = data.unSignData
          for (let i = 0; i < data.allData.length; i++) {
            if (typeof (data.allData[i].isSign) === 'undefined') {
              data.allData[i].isSign = -1
            }
          }
          this.listData = data.allData
        })
      },
      goTztgDetail(id) {
        localStorage.setItem('curAppCode', 'C')
        this.$gotoid('/notice/detail', JSON.stringify({ id: id, from: 'home' }))
      },
      checkTab(type, index) { // 点击tab菜单
        this.curIndex = index
        if (type) {
          this.isShowAll = false
        } else {
          this.isShowAll = true
        }
      }
    },
    mounted() {
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
      this.curDept = JSON.parse(sessionStorage.getItem('depToken'))[0]
      this.queryAll()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss"  scoped>
.portal-list {
	.portal_carousel_ul {
		padding: 6px 20px 6px 8px;
	}
	.portal_carousel_ul li {
		position: relative;
		padding-left: 25px;
		&::before {
			display: inline-block;
			content: '';
			width: 16px;
			height: 16px;
			border-radius: 50%;
			background-color: #6cbef2;
			position: absolute;
			left: 0;
			top: 3px;
		}
	}
	.portal_carousel_ul .portal_carousel_li {
		width: 100%;
		list-style: none;
		display: inline-block;
		padding-bottom: 18px;
	}
	.portal_carousel_ul .portal_carousel_li span {
		float: left;
		margin-right: 10px;
	}
	.portal_carousel_li span.float_r {
		float: right;
	}
	.f_color_e6a23c {
		color: #e6a23c;
	}
	.f_color_409EFF {
		color: #00a0e9;
	}
	.tabList {
		width: 100%;
		height: 31px;
		background: url('/static/image/portal_newImg/moudyq.png') no-repeat center center;
		background-size: 100%;
    line-height: 27px;
    margin-top: 10px;
		span {
			font-size: 17px;
			color: rgba(0, 160, 233, 0.8);
			cursor: pointer;
      display: inline-block;
      width: 19.5%;
      text-align: center;
		}
		span:nth-child(2) {
      margin-left: -10px;
		}
		span:last-child {
			margin-left: 7px;
		}
	}
	.onClick {
		color: #bce8fc !important;
		text-shadow: 0 0 2px #fff;
	}
	.zbMainTit {
		display: flex;
		justify-content: space-between;
    margin: 0 0 2px;
	}
	.text {
		width: 70%;
		overflow: hidden;
	}
}

@media only screen and (max-width: 1367px){
	.portal-list .tabList span {
		font-size: 14px;
	}
}

</style>
