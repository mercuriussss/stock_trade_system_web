<template>
  <div class="home-container" align="center">
    <div class="home-text">欢迎使用该证券交易系统， {{ name }}
      <span v-if="sex === man" style="margin-left: -10px">先生</span>
      <span v-else-if="sex === woman" style="margin-left: -10px">女士</span>
    </div>
    <div class="home-text">您当前账号的权限为：
      <span v-if="roles === 'admin'" style="color: red">管理员</span>
      <span v-else-if="roles === 'user'" style="color: #003dff">用户</span>
      <span v-else style="color: #000000">游客</span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'name',
      'roles',
      'sex'
    ])
  },
  data(){
    return {
      man: "男",
      woman: "女"
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  &-container {
    margin: 200px;
  }
  &-text {
    margin: 50px 50px 50px 50px;
    font-size: 40px;
    line-height: 46px;
  }
}
</style>
