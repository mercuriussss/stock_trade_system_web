<template>
  <div class="info-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="个人资料" name="set-basic-info" >
        <el-form class="basic-info-form" ref="temp" :model="temp" :rules="rules" label-width="80px">
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
          <el-form-item prop="introduction" label="个人简介">
            <el-input v-model="temp.introduction" type="textarea" maxlength="80" rows="6" show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">保存设置</el-button>
            <el-button @click="resetForm()">取消修改</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="设置头像" name="set-avatar">
        <el-row :gutter="10">
          <el-col :span="12">
            <div class="text-title"><h3>当前头像</h3></div>
            <el-avatar class="avatar-img" shape="square" :size="150" fit="fill" :src="temp.avatar">改头像</el-avatar>
          </el-col>
          <el-col :span="12">
            <div class="text-title"><h3>预览头像</h3></div>
            <el-upload
              class="avatar-uploader"
              :action= uploadPath
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="text-msg"><h6>注：图片支持JPG、PNG、GIF格式,文件不超过2M</h6></div>
          </el-col>
        </el-row>
        <el-button class="center-button" type="primary" @click="onSubmit('temp')">保存头像</el-button>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="set-password">
        <el-form class="pass-form" ref="passForm" :model="passForm" :rules="rules" label-width="80px">
          <el-form-item prop="password" label="新密码">
            <el-input v-model="passForm.new_pass" type="password" placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item prop="checkPass" label="确认密码">
            <el-input v-model="passForm.check_new_pass" type="password" placeholder="请再次输入新密码"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="center-button" type="primary" @click="updatePass()">保存设置</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Util from '../../../utils/utils.js'

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
        } else if (!Util.passwordReg.test(this.passForm.new_pass)) {
          callback(new Error('密码要求至少包含数字和英文，长度为6-20位'))
        } else {
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (this.passForm.check_new_pass === '') {
          callback(new Error('请再次输入密码'))
        } else if (this.passForm.check_new_pass !== this.passForm.new_pass) {
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
          id: '',
          name: '',
          username: '',
          password: '',
          checkPass: '',
          phone: '',
          card: '',
          birth: '',
          sex: '',
          avatar: '',
          introduction: '',
          create_date: ''
        },
        passForm: {
          new_pass: '',
          check_new_pass: ''
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
        },
        activeName: 'set-basic-info',
        token: this.$store.getters.token,
        uploadPath: 'http://localhost:8080/api/user/upload',
        imageUrl: ''
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.$store.dispatch('user/getInfo').then(response => {
          console.log("test")
          console.log(response)
          this.temp = response
        })
      },
      onSubmit() {
        this.$refs.temp.validate((valid) => {
          if (valid) {
            let data = {avatarUrl: this.imageUrl, token: this.token};
            this.$store.dispatch('user/updateUserAvatar', data).then((res) => {
              console.log(res);
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm() {
        this.getList()
      },
      handleAvatarSuccess(res, file) {
        console.log("up")
        console.log(res)
        console.log(file)
        console.log(file.raw)
        this.imageUrl = res.data
        console.log(this.imageUrl)
      },
      beforeAvatarUpload(file) {
        const types = ['image/jpeg', 'image/gif', 'image/png'];
        const isImg = types.includes(file.type);
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isImg) {
          this.$message.error('上传头像图片只能是 jpg、png、gif 格式中的一种!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isImg && isLt2M;
      },
      updatePass(){
        this.$refs.passForm.validate((valid) => {
          if (valid) {
            const data = {id: this.temp.id, new_password: this.passForm.new_pass};
            this.$store.dispatch('user/updatePassword', data).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: 'Success',
                message: '设置新密码成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>
<style>
  .info-container {
    width: 50%;
    margin-left: 25%;
    margin-top: 20px;
  }

  .basic-info-form {
    width: 410px;
    margin: 20px auto;
  }
  .pass-form {
    width: 410px;
    margin: 50px auto;
  }
  .select-sex {
    width: 330px;
  }

  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader :hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }

  .avatar-img {
    margin-left: 25%;
  }

  .avatar-uploader {
    margin-left: 25%;
    margin-right: 25%;
  }

  .center-button {
    margin-top: 3%;
    margin-bottom: 5%;
    margin-left: 42.5%;
  }
  .text-title{
    margin-left: 25%;
    margin-top: 20%;
  }
  .text-msg{
    margin-left: 20%;
  }
</style>
