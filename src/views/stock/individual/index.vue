<template>
  <div class="individual-container">
    <MinMarketChart/>
    <el-autocomplete
      class="stockSelect"
      v-model="state"
      :fetch-suggestions="querySearch"
      placeholder="请输入股票代码或名称"
      :trigger-on-focus="false"
      @select="handleSelect"
    />
    <span style="color:#99a9bf">（ps:点击相应股票即可进行切换）</span>
    <el-button class="addBtn" type="info" v-if="isOptional && userRole !== 'visitor'" @click="updateUserOptional(stockCode1,'delete')">已添加自选股
    </el-button>
    <el-button class="addBtn" type="primary" v-else-if="userRole !== 'visitor'" @click="updateUserOptional(stockCode1,'add')">添加自选股</el-button>
    <el-divider></el-divider>
    <StockHead id="stockHead" class="stockHead" width="900px" height="180px" :stockCode1="stockCode1"/>
    <el-radio-group v-model="chartType" class="chartTypeSelect" @change="chartTypeChange">
      <el-radio-button label="Minute">分时图</el-radio-button>
      <el-radio-button label="Daily">日线图</el-radio-button>
      <el-radio-button label="Weekly">周线图</el-radio-button>
      <el-radio-button label="Monthly">月线图</el-radio-button>
    </el-radio-group>
    <!--<TradeInfo id="tradeInfo" class="tradeInfo" width="280px" height="480px" :stockCode1="stockCode1"/>-->
    <TradeInfo id="tradeInfo" class="tradeInfo" width="280px" height="550px" :stockCode1="stockCode1"/>
    <MinuteChart v-if="chartType === 'Minute'" id="StockMinuteChart" class="StockMinuteChart" width="800px"
                 height="480px"
                 :stockCode2="stockCode2"/>
    <StockKline v-else id="StockKline" class="StockKline" width="800px" height="480px" :stockCode1="stockCode1"
                :chartType="chartType"/>
    <TradeDrawer v-if="userRole !== 'visitor'" id="tradeDrawer" class="tradeDrawer" :stockCode1="stockCode1" btnSize="medium"/>
  </div>
</template>
<script>

  import MinMarketChart from '@/components/Charts/MinMarketChart';
  import StockKline from '@/components/Charts/StockKline';
  import StockHead from "../../../components/Charts/StockHead";
  import TradeInfo from "../../../components/Charts/TradeInfo";
  import MinuteChart from '@/components/Charts/MinuteChart';
  import TradeDrawer from '@/components/Charts/TradeDrawer';
  import {changeToStockCode1, changeToStockCode2} from "../../../utils/stockUtils";

  export default {
    name: 'stockIndividual',
    components: {
      StockHead,
      MinuteChart,
      TradeInfo,
      MinMarketChart,
      StockKline,
      TradeDrawer
    },
    data() {
      return {
        userRole: this.$store.getters.roles,
        state: '',
        stockCode1: this.$route.query.stockCode1 || sessionStorage.getItem("stockCode1") || this.$store.getters.stockCode1,
        stockCode2: this.$route.query.stockCode2 || sessionStorage.getItem("stockCode2") || this.$store.getters.stockCode2,
        stockName: '',
        isOptional: '',
        chartType: 'Minute'
      }
    },
    created() {
      this.updateIfIsOptionalState(this.stockCode1);
    },
    methods: {
      querySearch(query, cb) {
        let stockQuery = [];
        this.$store.dispatch('stock/getQueryStock', query).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            //this.stockQuery[i].value = res.data[i].symbol + '\t' + res.data[i].name
            stockQuery.push({
              value: res.data[i].symbol + '\t' + res.data[i].name,
              ts_code: res.data[i].ts_code,
              name: res.data[i].name
            })
          }
        });
        // 调用 callback 返回建议列表的数据
        cb(stockQuery);
      },
      updateIfIsOptionalState(stockCode1) {
        this.$store.dispatch('stock/getUserAllOptionalCode', this.$store.getters.token).then(res => {
          let userOptional = res.data.items;
          if (userOptional === null || userOptional === undefined) {
            this.isOptional = false;
          } else {
            this.isOptional = (userOptional.indexOf(stockCode1) > -1);
          }
        })
      },
      updateUserOptional(code, type) {
        let data = {
          token: this.$store.getters.token,
          code: changeToStockCode1(code),
          name: this.$store.getters.stockName,
          type: type
        };
        this.$store.dispatch('stock/updateUserOptional', data).then(() => {
          this.updateIfIsOptionalState(this.stockCode1);
        })
      },
      handleSelect(item) {
        this.stockCode1 = changeToStockCode1(item.ts_code.split('.')[0]);
        this.updateIfIsOptionalState(this.stockCode1);
        this.stockCode2 = changeToStockCode2(item.ts_code.split('.')[0]);
        this.stockName = changeToStockCode2(item.name);
        let query = {stockCode1: this.stockCode1, stockCode2: this.stockCode2, stockName: item.name};
        this.$store.dispatch('stock/saveStockCodeToIndividual', query);
      },
      chartTypeChange() {
        console.log(this.chartType);
      }
    }
  }
</script>
<style>
  .individual-container {
    position: relative;
    width: 100%;
    height: 1350px;
  }

  .stockHead {
    margin: 20px auto 0 auto;
    border: 5px solid #adb0b2;
    background-color: rgb(235, 235, 235);
  }

  .StockMinuteChart {
    float: left;
    margin: 0 auto 50px 10%;
    position: center;
  }

  .StockKline {
    float: left;
    margin: 0 auto 50px 10%;
    position: center;
  }

  .chartTypeSelect {
    margin: 20px auto 0 23%;
  }

  .tradeInfo {
    float: right;
    margin: 20px 5% auto auto;
    border: 5px solid #adb0b2;
    background-color: rgb(235, 235, 235);
  }

  .stockSelect {
    margin-left: 20px;
    width: 180px;
  }

  .addBtn {
    float: right;
    margin-right: 80px;
  }

  .tradeDrawer {
    float: right;
    margin: 20px 10% auto auto;
  }
</style>
