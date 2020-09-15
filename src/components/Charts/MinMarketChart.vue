<template>
  <div class="indexREF">
    <el-row :gutter="0">
      <el-col :span="8">
        <MinChart id="MinChart" class="MinChart" width="400px" height="200px" stockCode1="sh000001"
                  stockCode2="0000001"/>
      </el-col>
      <el-col :span="8">
        <MinChart id="Min2Chart" class="Min2Chart" width="400px" height="200px" stockCode1="sz399001"
                  stockCode2="1399001"/>
      </el-col>
      <el-col :span="8">
        <MinChart id="Min3Chart" class="Min3Chart" width="400px" height="200px" stockCode1="sz399006"
                  stockCode2="1399006"/>
      </el-col>
    </el-row>
    <br><br>

    <el-divider></el-divider>
  </div>
</template>

<script>
  import MinChart from "@/components/Charts/MinMimuteChart"

  export default {
    name: "min-market-chart",
    components: {
      MinChart
    }
  }
</script>

<style scoped>

</style>
