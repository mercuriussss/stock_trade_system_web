<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="用户姓名" style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;top: 20px;"
    >
      <el-table-column label="注册单ID" prop="id" align="center" width="90">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.register_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户账号" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="90px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="身份证" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.card }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" width="130px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.birth }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="success" size="mini" @click="handlePass(row)">
            通过
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            驳回
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                @pagination="getList"/>

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label="注册单ID" prop="id">
          <el-input v-model="temp.id" disabled/>
        </el-form-item>
        <el-form-item label="用户账号" prop="username">
          <el-input v-model="temp.username" disabled/>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="身份证" prop="card">
          <el-input v-model="temp.card"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="temp.sex" class="filter-item">
            <el-option v-for="item in sexOptions" :key="item.key" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期" prop="birth">
          <el-date-picker v-model="temp.birth" type="date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="申请日期" prop="register_date">
          <el-date-picker v-model="temp.register_date" type="date" disabled/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updateData()">
          修改
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import Util from '../../../utils/utils.js'

  const sexOptions = ['男', '女']

  export default {
    name: 'check',
    components: {Pagination},
    filters: {},
    data() {
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入账号'))
        } else if (!Util.usernameReg.test(this.temp.username)) {
          callback(new Error('用户名只能由数字和字母组成，长度为4-15位'))
        } else {
          callback()
        }
      }
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'))
        } else if (!Util.phoneReg.test(this.temp.phone)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入姓名'))
        } else if (!Util.nameReg.test(this.temp.name)) {
          callback(new Error('请输入正确的姓名'))
        } else {
          callback()
        }
      }
      var validateCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入身份证号'))
        } else if (!Util.idCardReg.test(this.temp.card)) {
          callback(new Error('请输入正确的身份证号'))
        } else {
          callback()
        }
      }
      var validateBirth = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入出生日期'))
        } else {
          callback()
        }
      }
      var validateSex = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入性别'))
        } else {
          callback()
        }
      }
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: false,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined
        },
        temp: {
          id: undefined,
          username: '',
          phone: '',
          card: '',
          name: '',
          sex: '',
          birth: '',
          register_date: ''
        },
        sexOptions,
        dialogFormVisible: false,
        rules: {
          name: [{
            validator: validateName,
            trigger: 'blur'
          }],
          username: [{
            validator: validateUsername,
            trigger: 'blur'
          }],
          phone: [{
            validator: validatePhone,
            trigger: 'blur'
          }],
          card: [{
            validator: validateCard,
            trigger: 'blur'
          }],
          birth: [{
            validator: validateBirth,
            trigger: 'blur'
          }],
          sex: [{
            validator: validateSex,
            trigger: 'blur'
          }]
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.$store.dispatch('user/getUncheckedList', this.listQuery).then(response => {
          console.log('test');
          console.log(this.listQuery);
          console.log(response);
          this.list = response.data.items;
          this.total = response.data.total;
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 300)
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleUpdate(row) {
        console.log('row')
        console.log(row)
        console.log(this.list)
        this.temp = Object.assign({}, row) // copy obj
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        });
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const user = Object.assign({}, this.temp);
            this.$store.dispatch('user/updateUncheckedUser', user).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id);
              this.list.splice(index, 1, this.temp);
              this.dialogFormVisible = false;
              this.$notify({
                title: 'Success',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      handlePass: function (row, index) {
        this.$confirm('管理员审核完毕，是否通过该注册申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          const user = Object.assign({}, row, {checker: this.$store.getters.name});
          console.log(user)
          this.$store.dispatch('user/passUncheckedUser', user).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: '审核成功',
              type: 'success',
              duration: 2000
            });
            this.list.splice(index, 1)
          })
        })
      },
      handleDelete(row, index) {
        this.$confirm('管理员审核完毕，是否驳回该注册申请？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$store.dispatch('user/deleteUncheckedUser', row.id).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: '驳回成功',
              type: 'success',
              duration: 2000
            });
            this.list.splice(index, 1)
          })
        })
      }
    }
  }
</script>
