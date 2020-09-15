<template>
  <div class="userContent">
    <el-card class="card" :body-style="{ padding: '20px'} ">
      <el-form ref="temp" :model="temp" :rules="rules" label-width="80px">
        <el-form-item prop="username" label="账号">
          <el-input v-model="temp.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="temp.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="checkPass" label="确认密码">
          <el-input v-model="temp.checkPass" type="password" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="手机">
          <el-input v-model="temp.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="card" label="身份证">
          <el-input v-model="temp.card" placeholder="请输入身份证号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="temp.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="birth" label="出生日期">
          <el-col :span="24">
            <el-date-picker type="date" placeholder="选择日期" v-model="temp.birth" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item prop="sex" label="性别">
          <el-select class="select-sex" v-model="temp.sex" placeholder="请选择性别">
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('temp')">注册</el-button>
          <el-button @click="onClear()">清空</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import Util from '../../utils/utils.js'

  export default {
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
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else if (!Util.passwordReg.test(this.temp.password)) {
          callback(new Error('密码要求至少包含数字和英文，长度为6-20位'))
        } else {
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.temp.password) {
          callback(new Error('两次输入的密码不一致'))
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
        temp: {
          name: '',
          username: '',
          password: '',
          checkPass: '',
          phone: '',
          card: '',
          birth: '',
          sex: ''
        },
        rules: {
          name: [{
            validator: validateName,
            trigger: 'blur'
          }],
          username: [{
            validator: validateUsername,
            trigger: 'blur'
          }],
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
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
    methods: {
      onSubmit() {
        this.$refs.temp.validate((valid) => {
          if (valid) {
            console.log(this.temp)
            this.$store.dispatch('user/register', this.temp)
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      onClear() {
        this.$refs.temp.resetFields()
      }
    }
  }
</script>
<style>
  .userContent {
    width: 430px;
    margin: 20px auto;
  }

  .select-sex {
    width: 310px;
  }

</style>
