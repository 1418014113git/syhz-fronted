<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="16">
        <h3 style="width:180px; padding-right: 12px; text-align: right">申请检验鉴定</h3>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center">
      <el-col :span="16">
        <el-form :model="applyBean" ref="applyForm" label-width="180px">
          <el-form-item label="主送">
            <el-input v-model="applyBean.zs" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="送检单位">
            <el-select v-model="applyBean.sjdw" size="small" placeholder="请选择" style="width:200px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="送检民警">
            <el-input v-model="applyBean.sjmj" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="applyBean.lxdh1" size="small" style="width:200px" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="案件名称">
            <el-input type="textarea" v-model="applyBean.ajmc" size="small"></el-input>
          </el-form-item>
          <el-form-item label="检材名称">
            <el-input type="textarea" v-model="applyBean.sjmc" size="small"></el-input>
          </el-form-item>
          <el-form-item label="送检要求">
            <el-input type="textarea" v-model="applyBean.sjyq" size="small"></el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="applyBean.yxq" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="公安厅联系人">
            <el-input v-model="applyBean.gatlxr" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item label="联络电话">
            <el-input v-model="applyBean.lxdh2" size="small" style="width:200px" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :show-file-list="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              style="width:300px;">

              <el-button size="small" type="primary">点击上传</el-button>

            </el-upload>


          </el-form-item>
          <el-form-item label="申请单位">
            <el-select v-model="applyBean.sqdw" size="small" placeholder="请选择" style="width:200px">
              <el-option v-for="item in sqdwSelect" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="applyBean.sqr" size="small" style="width:200px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" v-on:click="sunbmit">提交申请</el-button>
          </el-form-item>
        </el-form>

      </el-col>
    </el-row>

    <el-dialog title="附件" ref="dialogView" :visible.sync="dialogViewVisible">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>


  </div>
</template>

<script>
  // import { mapGetters } from 'vuex'

  export default {
    name: 'inspectionApply',
    data() {
      return {
        options: [
          { value: '0', label: '类型1' },
          { value: '1', label: '类型2' }
        ],
        sqdwSelect: [
          { value: '0', label: '内蒙古公安厅' },
          { value: '1', label: '市局' }
        ],
        applyBean: {
          zs: '',
          sjdw: '',
          sjmj: '',
          lxdh1: '',
          ajmc: '',
          sjmc: '',
          sjyq: '',
          yxq: '',
          gatlxr: '',
          lxdh2: '',
          fj: '',
          sqdw: '',
          sqr: ''
        },
        fileList: [
          {
            name: 'food.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }, {
            name: 'food2.jpeg',
            url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
          }
        ],
        dialogViewVisible: false,
        dialogImageUrl: ''

      }
    },
    methods: {
      toApply() {
        this.$router.push({ path: '/jyjd/apply' })
      },
      getDetail() {
        const id = this.$route.query.id
        if (id) {
          this.applyBean = {
            zs: '主送',
            sjdw: '送检单位',
            sjmj: '送检名称',
            lxdh1: '1213123141',
            ajmc: '名称1',
            sjmc: '名称2',
            sjyq: '灭哦更好啊见到过好贵撒个',
            yxq: '阿达饿啊我发发到付 ',
            gatlxr: '啊放大到个阿嘎多个撒地方',
            lxdh2: '31231241',
            fj: '',
            sqdw: '阿斯蒂芬阿道夫sa',
            sqr: 'afdsfaf'
          }
        }
      },
      handleAvatarSuccess(res, file) {
        const imageUrl = URL.createObjectURL(file.raw)
        this.fileList.push({ name: file.name, url: imageUrl })
      },
      beforeAvatarUpload(file) {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png')
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      handleRemove(file, fileList) {
        // console.log('handleRemove')
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file.url)
        this.dialogImageUrl = file.url
        this.dialogViewVisible = true
      },
      handleExceed(files, fileList) {
        this.$message.warning('当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件')
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`)
      }

    },
    mounted() {
      this.getDetail()
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
