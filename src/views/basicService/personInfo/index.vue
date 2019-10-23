<template>
<!--人员信息 包含详情组件和编辑组件-->
  <section class="personInfo">
    <div class="allPerson">
      <el-button size="mini" title="更多人员信息"  type="primary" icon="el-icon-document"  @click="toList">更多人员信息</el-button>
    </div>
    <div class="maxh">
      <el-button size="mini" title="编辑"  type="text" icon="el-icon-edit-outline" class="floatr"  v-if="isShowEditBtn"   @click="handleEdit"></el-button>
      <per-detail v-if='isShowDetail'></per-detail>  <!--详情页-->
      <per-Edit v-if='!isShowDetail'  @cancelEdit='cancelEdit'></per-Edit>  <!--编辑页-->
    </div>
  </section>
</template>

<script>
import PerDetail from './personDetail'
import PerEdit from './personEdit'
export default {
  name: 'personInfo',
  data() {
    return {
      isShowDetail: true, // 是否显示详情页
      isShowEditBtn: true, // 是否显示编辑按钮
      curId: '',
      curUser: {}
    }
  },
  components: {
    PerDetail,
    PerEdit
  },
  methods: {
    toList() {
      this.$router.push({
        path: '/basicService/personList'
      })
    },
    handleEdit() { // 点击‘编辑’按钮
      this.isShowDetail = false // 隐藏详情页
      this.isShowEditBtn = false // 隐藏编辑按钮
    },
    cancelEdit(val) { // 编辑页点‘取消’按钮传递的事件
      this.isShowDetail = val // 显示详情页
      this.isShowEditBtn = val // 显示编辑按钮
    }
  },
  mounted() {
    this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    this.curId = this.$route.query.id
    if (this.$route.query.type === 'mainEdit') { // 从首页弹框的点击“立即完善”进来的。
      this.isShowDetail = false // 隐藏详情页
      this.isShowEditBtn = false // 隐藏编辑按钮
    } else if (this.$route.query.type === 'listDetail') { // 从列表点击详情按钮进来的
      this.isShowDetail = true // 显示详情页
      if (this.curUser.id === this.curId) {
        this.isShowEditBtn = true // 显示编辑按钮
      } else {
        this.isShowEditBtn = false // 隐藏编辑按钮
      }
    } else if (this.$route.query.type === 'listEdit') { // 从列表点击编辑按钮进来的
      this.isShowDetail = false // 隐藏详情页
      this.isShowEditBtn = false // 隐藏编辑按钮
    } else { // 点击菜单或者首页右上角的'人员信息'进来的
      this.isShowDetail = true // 显示详情页
      this.isShowEditBtn = true // 显示编辑按钮
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.personInfo{
  width: 70%;
  margin: 0 auto;
  overflow: hidden;
  .allPerson{
    width: 100%;
    text-align: right;
    margin-bottom: 10px;
  }
  .maxh{
    height: 80vh;
    padding: 20px;
    background: rgba(0, 89, 130, 0.7);
    border: 1px solid #00a0e9;
    border-radius: 4px;
    overflow: auto;
  }
  .floatr{
    float: right;
    font-size:22px;
  }
}
</style>
