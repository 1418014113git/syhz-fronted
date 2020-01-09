<template>
  <div class="QbxsInfo">
    <div style="padding: 10px; height: 44px;">
      <el-button icon="el-icon-plus" style="float: right; margin-right: 10px;"
                 @click.stop="plusPerson">添加人员</el-button>
    </div>
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="(person, index) in persons" :name="person.tempId" :key="person.tempId">
        <template slot="title">
          人员({{person.gmsfhm}})
          <el-button icon="el-icon-delete" circle style="float: right;margin-top: 11px; margin-right: 10px;"
                     @click.stop="doDelPerson(index)" v-if="personLen > 1"></el-button>
        </template>
        <div style="padding: 10px 20px;">
          <div class="per-div">
            <p class="per-title">
              人员基本信息
              <el-button icon="el-icon-download" style="margin-left: 10px;" :loading="personLoad"
                         @click.stop="getPersonBase(person.gmsfhm, index)">获取信息</el-button>
            </p>
            <base-info :person="person" @backId="backIdPlus"></base-info>
          </div>
          <div class="per-div">
            <p class="per-title">
              人员服务信息
              <el-button icon="el-icon-plus" circle style="float: right;margin-right: 10px;"
                         @click.stop="plusService(index)"></el-button>
            </p>
            <each-service-info v-if="person.id" :index="index" :person="person"></each-service-info>
          </div>
          <div class="per-div">
            <p class="per-title">
              人员车辆信息
              <el-button icon="el-icon-plus" circle style="float: right;margin-right: 10px;"
                         @click.stop="plusCar(index)"></el-button>
            </p>
            <each-car-info v-if="person.id" :index="index" :person="person"></each-car-info>
          </div>
          <div class="per-div">
            <p class="per-title">
              人员通讯记录
              <el-button icon="el-icon-plus" circle style="float: right;margin-right: 10px;"
                         @click.stop="plusPhoneRecords(index)"></el-button>
            </p>
            <each-record v-if="person.id" :index="index" :person="person"></each-record>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import BaseInfo from '@/views/intellSystem/components/BaseInfo'
  import EachCarInfo from '@/views/intellSystem/components/EachCarInfo'
  import EachServiceInfo from '@/views/intellSystem/components/EachServiceInfo'
  import EachRecord from '@/views/intellSystem/components/EachRecord'
  // import { personByCardId } from '@/api/personSearch/personSearch'
  export default {
    name: 'QbxsInfo',
    props: ['analysisData', 'qbxsId'],
    components: {
      EachCarInfo, EachServiceInfo, EachRecord, BaseInfo
    },
    data() {
      return {
        personLoad: false,
        curUser: {},
        activeNames: ['temp0'],
        personId: 0,
        personLen: 0,
        persons: []
      }
    },
    methods: {
      getPersonBase(gmsfhm, idx) {
        // 根据身份证号码查询人员详细信息
        // if (!gmsfhm) {
        //   this.$message({ message: '请先添加身份证号码', type: 'warning' })
        //   return false
        // }
        // const para = {
        //   method: 'Query',
        //   byUserCard: gmsfhm,
        //   userCardId: this.curUser.cardNumber,
        //   userCertId: this.curUser.cardNumber,
        //   userDept: '010000',
        //   userName: this.curUser.realName
        // }
        // this.personLoad = true
        // personByCardId(para).then((response) => {
        //   this.personLoad = false
        //   const obean = this.persons[idx]
        //   const bean = response.data
        //   for (const key in bean) {
        //     Vue.set(obean, key, bean[key])
        //   }
        //   Vue.set(this.persons, idx, obean)
        // }).catch(() => {
        //   this.personLoad = false
        // })
      },
      plusPerson() {
        const data = this.analysisData[0]
        this.personId = this.personId + 1
        const per = {}
        per.cjdw = data.cjdw
        per.cjdwName = data.cjdwName
        per.createUser = data.createUser
        per.tempId = 'per' + this.personId
        per.qbxsJbxxId = this.qbxsId
        per.serviceInfos = []
        per.serviceInfoId = 0
        per.serverLen = 0
        per.carInfos = []
        per.carInfoId = 0
        per.carInfoLen = 0
        per.phoneRecords = []
        per.phoneRecordsId = 0
        per.phoneRecordsLen = 0
        this.persons.push(per)
        this.personLen = this.persons.length
      },
      doDelPerson(i) {
        this.persons.splice(i, 1)
        this.personLen = this.persons.length
      },
      plusService(idx) {
        const per = this.persons[idx]
        if (this.checkPerson(per)) {
          const person = this.persons[idx]
          person.serviceInfoId = person.serviceInfoId + 1
          person.serviceInfos.push(this.getBean(per, person.serviceInfoId))
          person.serverLen = person.serviceInfos.length
        }
      },
      doDelService(bean, idx) {
        const person = this.persons[idx]
        for (let i = 0; i < person.serviceInfos.length; i++) {
          if (person.serviceInfos[i].tempId === bean.tempId) {
            person.serviceInfos.splice(i, 1)
          }
        }
        person.serverLen = person.serviceInfos.length
      },
      plusCar(idx) {
        const per = this.persons[idx]
        if (this.checkPerson(per)) {
          const person = this.persons[idx]
          person.carInfoId = person.carInfoId + 1
          const car = this.getBean(per, person.carInfoId)
          if (car.gmsfhm) {
            car.sfzmc = 'A'
          }
          person.carInfos.push(car)
          person.carInfoLen = person.carInfos.length
        }
      },
      doDelCar(bean, idx) {
        const person = this.persons[idx]
        for (let i = 0; i < person.carInfos.length; i++) {
          if (person.carInfos[i].tempId === bean.tempId) {
            person.carInfos.splice(i, 1)
          }
        }
        person.carInfoLen = person.carInfos.length
      },
      plusPhoneRecords(idx) {
        const per = this.persons[idx]
        if (this.checkPerson(per)) {
          const person = this.persons[idx]
          person.phoneRecordsId = person.phoneRecordsId + 1
          person.phoneRecords.push(this.getBean(per, person.phoneRecordsId))
          person.phoneRecordsLen = person.phoneRecords.length
        }
      },
      doDelPhoneRecords(bean, idx) {
        const person = this.persons[idx]
        for (let i = 0; i < person.phoneRecords.length; i++) {
          if (person.phoneRecords[i].tempId === bean.tempId) {
            person.phoneRecords.splice(i, 1)
          }
        }
        person.phoneRecordsLen = person.phoneRecords.length
      },
      checkPerson(per) {
        let flag = false
        if (per) {
          if (!per.gmsfhm) {
            this.$message({ message: '请先提交人员信息!', type: 'warning' })
            return flag
          }
          flag = true
          return flag
        }
        return flag
      },
      getBean(per, id) {
        return {
          tempId: 'temp' + id,
          gmsfhm: per.gmsfhm,
          cjdwName: per.cjdwName,
          createUser: per.createUser
        }
      },
      backIdPlus(gmsfhm) {
        const array = []
        for (let i = 0; i < this.persons.length; i++) {
          const bean = this.persons[i]
          if (bean.gmsfhm === gmsfhm) {
            if (!bean.serviceInfos || bean.serviceInfos.length === 0) {
              this.plusService(i)
            }
            if (!bean.carInfos || bean.carInfos.length === 0) {
              this.plusCar(i)
            }
            if (!bean.phoneRecords || bean.phoneRecords.length === 0) {
              this.plusPhoneRecords(i)
            }
          }
          array.push(bean)
        }
        this.persons = array
      }
    },
    mounted() {
      if (this.analysisData instanceof Array) {
        for (let i = 0; i < this.analysisData.length; i++) {
          const bean = this.analysisData[i]
          // if (bean.gmsfhm) {
          this.personId = this.personId + 1
          const per = bean
          per.tempId = 'per' + this.personId
          per.qbxsJbxxId = this.qbxsId
          if (per.serviceInfos) {
            const array = []
            per.serviceInfoId = 0
            for (let j = 0; j < bean.serviceInfos.length; j++) {
              const b = this.getBean(per, per.serviceInfoId)
              b.type = bean.serviceInfos[j]['type']
              b.zh = bean.serviceInfos[j]['zh']
              per.serviceInfoId = per.serviceInfoId + 1
              array.push(b)
            }
            per.serviceInfos = array
            per.serverLen = array.length
          } else {
            per.serviceInfos = []
            per.serviceInfoId = 0
            per.serverLen = 0
          }
          per.carInfos = []
          per.carInfoId = 0
          per.carInfoLen = 0
          per.phoneRecords = []
          per.phoneRecordsId = 0
          per.phoneRecordsLen = 0
          this.persons.push(per)
          // }
        }
      }
      this.curUser = JSON.parse(sessionStorage.getItem('userInfo'))
    },
    watch: {
      qbxsId(val) {
        if (val) {
          if (this.analysisData instanceof Array) {
            for (let i = 0; i < this.analysisData.length; i++) {
              this.analysisData[i].qbxsJbxxId = this.qbxsId
            }
          }
        }
      }
    }
  }
</script>

<style scoped>
  .QbxsInfo .per-title{
    padding: 10px;
    color: #FFFFFF;
    border-bottom: 1px solid #00a0e9;
  }
  .QbxsInfo .per-div{
    padding: 0 10px;
    border: 1px solid #00a0e9;
    border-radius: 5px;
    margin-bottom: 10px;
  }
</style>
