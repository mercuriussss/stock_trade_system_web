<template>
  <div class="app-container">
    <div class="selected-container">
      <el-select @change="stockChange" v-model="stockCode" placeholder="value">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <IndexHead id="stockHead" class="stockHead" width="800px" height="150px" :stockCode1="stockCode1" />
    <el-radio-group v-model="chartType" class="chartTypeSelect" @change="chartTypeChange">
      <el-radio-button label="Minute">分时图</el-radio-button>
      <el-radio-button label="Daily">日线图</el-radio-button>
      <el-radio-button label="Weekly">周线图</el-radio-button>
      <el-radio-button label="Monthly">月线图</el-radio-button>
    </el-radio-group>
    <MinuteChart v-if="chartType === 'Minute'" id="IndexMinuteChart" class="IndexMinuteChart" width="1000px" height="400px" :stockCode2="stockCode2" />
    <IndexKline v-else id="IndexKline" class="IndexKline" width="1000px" height="400px" :stockCode1="stockCode1" :chartType="chartType" />
  </div>
</template>

<script>
  import MinuteChart from '@/components/Charts/MinuteChart';
  import IndexKline from '@/components/Charts/IndexKline';
  import IndexHead from "../../components/Charts/IndexHead";
  import {changeToIndexCode2} from "../../utils/stockUtils";

  export default {
    name: 'market',
    components: {
      IndexHead,
      MinuteChart,
      IndexKline},
    data(){
      return{
        activeName: 'MinuteChart',
        options:[{
          value: 'sh000001',
          label: '上证指数'
        },{
          value: 'sz399001',
          label: '深证成指'
        },{
          value: 'sz399006',
          label: '创业板指'
        },{
          value: 'sz399005',
          label: '中小板指'
        },{
          value: 'sh000010',
          label: '上证180'
        },{
          value: 'sh000016',
          label: '上证50'
        },{
          value: 'sh000300',
          label: '沪深300'
        },{
          value: 'sh000905',
          label: '中证500'
        }],
        stockCode:'',
        stockCode1:'',
        stockCode2:'',
        chartType:'Minute'
      }
    },
    created() {
      this.stockCode = this.$route.query.indexCode1 || sessionStorage.getItem("indexCode1") || this.$store.getters.indexCode1;
      this.stockCode1 = this.stockCode;
      this.stockCode2 = this.$route.query.indexCode2 || sessionStorage.getItem("indexCode2") || this.$store.getters.indexCode2;
    },
    methods: {
      handleFilter(){

      },
      stockChange(val){
        console.log('stockCode change');
        this.stockCode = val;
        this.stockCode1 = val;
        this.stockCode2 = changeToIndexCode2(val.substr(2,6));
        let query = {indexCode1: this.stockCode1, indexCode2: this.stockCode2};
        this.$store.dispatch('stock/saveStockCodeToIndex',query);
      },
      chartTypeChange(){
        console.log(this.chartType);
      }
    }
  }
</script>

<style scoped>
  .app-container{
    position: relative;
    width: 100%;
    height: 100%;
  }
  .IndexMinuteChart{
    margin: 0 auto 50px auto;
    position: center;
  }
  .IndexKline{
    margin: 0 auto 50px auto;
    position: center;
  }
  .stockHead{
    margin: 20px auto 0 auto;
    border: 5px solid #adb0b2;
    background-color: rgb(235, 235, 235);
  }
  .chartTypeSelect{
    margin: 20px auto 0 38%;
  }
  .selected-container{
    margin: 20px 20px 0 84%;
  }
</style>

