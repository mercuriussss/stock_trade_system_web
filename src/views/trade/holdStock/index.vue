<template>
  <div style="padding:30px;">
    <div class="userBalanceStatus">
      <span class="hold-stock-head-text">总资产：{{totalBalance + totalMarketValue}}</span>
      <span class="hold-stock-head-text">总资金：{{totalBalance}}</span>
      <span class="hold-stock-head-text">总市值：{{totalMarketValue}}</span>
      <span class="hold-stock-head-text">总盈亏：<span :style="totalFloatingColor">{{totalFloatingPL}}</span></span>
      <span class="hold-stock-head-text">盈亏率：<span :style="totalFloatingColor">{{totalFloatingPLChg}}%</span></span>
      <el-button type="primary" @click="getUserBalanceStatus" round>刷新</el-button>
    </div>
    <div class="holdStockList">
      <el-table
        :data="holdShares"
        border
        height="600"
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%;left: 20px"
      >
        <el-table-column label="股票代码" prop="stockCode" align="center" width="90" fixed>
          <template slot-scope="{row}">
            <span>{{ row.stockCode.substr(2,6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="股票名称" prop="stockName" align="center" width="100" fixed>
          <template slot-scope="{row}">
            <span>{{ row.stockName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本价" prop="costPrice" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.costPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总数量" prop="totalNumber" align="center" width="95">
          <template slot-scope="{row}">
            <span>{{ row.totalNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用数量" prop="avlNumber" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.avlNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="浮动盈亏" prop="floatingPL" align="center" width="110">
          <template slot-scope="{row}">
            <span :style="row.floatingColor">{{ row.floatingPL }}</span>
          </template>
        </el-table-column>
        <el-table-column label="浮动盈亏率" prop="floatingPLChg" align="center" width="100">
          <template slot-scope="{row}">
            <span :style="row.floatingColor">{{ row.floatingPLChg }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="现价" prop="nowPrice" align="center" width="90">
          <template slot-scope="{row}">
            <span :style="row.nowPriceColor">{{ row.nowPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现涨跌幅" prop="nowChg" align="center" width="90">
          <template slot-scope="{row}">
            <span :style="row.nowPriceColor">{{ row.nowChg }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="当天盈亏" prop="todayFloatingPL" align="center" width="90">
          <template slot-scope="{row}">
            <span :style="row.nowPriceColor">{{ row.todayFloatingPL }}</span>
          </template>
        </el-table-column>
        <el-table-column label="市值" prop="marketValue" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.marketValue }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓位比重" prop="storeRate" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.storeRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="marketValue" align="center" width="180">
          <template slot-scope="{row,$index}">
            <el-button type="danger" size="mini" @click="tradeDialog('buy',Number($index))" plain>
              买入
            </el-button>
            <el-button type="primary" size="mini" @click="tradeDialog('sell',Number($index))" plain>
              卖出
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="委托交易" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="entrustForm" :model="entrustForm" :rules="rules">
          <el-form-item align="center" prop="actionType">
            <el-radio-group v-model="entrustForm.actionType">
              <el-radio-button label="buy">买入</el-radio-button>
              <el-radio-button label="sell">卖出</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item align="center" prop="entrustStockName">
            <el-autocomplete
              v-model="entrustForm.entrustStockName"
              :disabled="true"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item align="center" prop="entrustCode">
            <el-autocomplete
              v-model="entrustForm.entrustCode"
              :disabled="true"
            ></el-autocomplete>
          </el-form-item>
          <el-form-item align="center" style="height: 30px" prop="entrustPrice">
            <el-input-number v-model="entrustForm.entrustPrice" :precision="2" :step="0.01"
                             :max="entrustForm.upLimitPrice"
                             :min="entrustForm.downLimitPrice"
                             @input='entrustPriceChange'></el-input-number>
          </el-form-item>
          <el-form-item align="center" style="height: 30px">
            <span class="hold-stock-trade-input-text">跌停:<span :style="downColor">{{entrustForm.downLimitPrice}}</span></span>
            <span class="hold-stock-trade-input-text"
                  v-if="entrustForm.actionType === 'buy'">可买数量:{{entrustForm.canBuyNumber}}</span>
            <span class="hold-stock-trade-input-text" v-else>可卖数量:{{entrustForm.canSellNumber}}</span>
            <span class="hold-stock-trade-input-text">涨停:<span
              :style="upColor">{{entrustForm.upLimitPrice}}</span></span>
          </el-form-item>
          <el-form-item align="center" style="height: 30px" prop="entrustNumber">
            <el-input-number v-if="entrustForm.actionType === 'buy'"
                             v-model="entrustForm.entrustNumber"
                             :step="100"
                             :min="0"
                             :max="entrustForm.canBuyNumber"
                             :step-strictly="true"></el-input-number>
            <el-input-number v-else
                             v-model="entrustForm.entrustNumber"
                             :step="100"
                             :min="0"
                             :max="entrustForm.canSellNumber"
                             :step-strictly="true"></el-input-number>
          </el-form-item>
          <el-form-item align="center" style="height: 30px" prop="storeRate">
            <el-radio-group v-model="entrustForm.storeRate" @change="storeRateChange">
              <el-radio :label="1">全仓</el-radio>
              <el-radio :label="1/2">半仓</el-radio>
              <el-radio :label="1/3">1/3仓</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item align="center" prop="actionType">
            <el-button v-if="entrustForm.actionType === 'buy'" class="hold-stock-trade-button" type="danger"
                       size="medium"
                       @click="entrustTradeOrder()">买入
            </el-button>
            <el-button v-else class="hold-stock-trade-button" type="primary" size="medium" @click="entrustTradeOrder()">
              卖出
            </el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import {
    changeToStockCode1,
    getColor,
    getColorByOne,
    getDownColor,
    getUpColor,
    ifCurTimeIsTradeTime
  } from "../../../utils/stockUtils";
  import TradeDrawer from '@/components/Charts/TradeDrawer';
  import Util from "../../../utils/utils";

  export default {
    name: 'holdStock',
    components: {
      TradeDrawer
    },
    data() {
      const validateEntrustNumber = (rule, value, callback) => {
        if (value === undefined) {
          callback(new Error('请输入委托数量'))
        } else if (value === 0) {
          callback(new Error('委托数量不能为0'))
        } else if (isNaN(value)) {
          callback(new Error('委托数量不能为Nan'))
        } else {
          callback();
        }
      };
      return {

        hold_stocks: [],   //从数据库获取的持仓信息
        holdShares: [],   //持仓信息
        totalBalance: 0, //总资金
        avlBalance: 0,    //可用资金
        totalMarketValue: 0,  //总市值

        totalFloatingPL: 0,         //浮动盈亏
        totalFloatingPLChg: 0,      //浮动盈亏率
        totalFloatingColor: '',      //浮动盈亏颜色

        upColor: getUpColor(),
        downColor: getDownColor(),

        dialogFormVisible: false, //消息弹窗

        listTimer: '', //定时刷新器，刷新股价信息
        holdSharesTimer: '', //定时刷新器2，刷新数据库持仓信息
        userToken: this.$store.getters.token,

        entrustForm: {
          entrustStockName: "", //股票名称
          entrustCode: "", //委托股票代码
          entrustPrice: 0,    //委托价
          entrustNumber: 0,  //委托数量
          upLimitPrice: 100, //涨停价
          downLimitPrice: 80, //跌停价
          storeRate: undefined, //购买仓位比重
          actionType: 'buy',
          canBuyNumber: 0,
          canSellNumber: 0
        },

        rules: {
          entrustNumber: [{
            validator: validateEntrustNumber
          }]
        }
      }
    },
    created() {
      this.getUserBalanceStatus();
      this.holdSharesTimer = this.listTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
        this.getUserBalanceStatus();
        }
      }, 30000) //半分钟刷一次
    },
    beforeDestroy() {
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.listTimer);
        clearInterval(this.holdSharesTimer);
      })
    },
    methods: {
      getUserBalanceStatus() {
        this.$store.dispatch('trade/getCapitalStatus',this.userToken).then(res => {
          this.totalBalance = Number(res.total_balance);
          this.avlBalance = Number(res.avl_balance);
          this.hold_stocks = res.hold_stocks;
          this.getStocksNowPrice(this.hold_stocks);
          this.listTimer = setInterval(() => {
            if (ifCurTimeIsTradeTime()) {
            this.getStocksNowPrice(this.hold_stocks);
            }
          }, 3000)
        })
      },

      //用户持仓信息
      getStocksNowPrice(holdShare) {
        let stockCodes = [];
        for (let i = 0; i < holdShare.length; i++) {
          stockCodes.push(holdShare[i].stock_code);
        }
        this.$store.dispatch('stock/getStockInfo', stockCodes.join()).then(res => {
          let data = res.data.split(';');
          let temp = [];
          this.holdShares = [];
          this.totalMarketValue = 0;
          this.totalFloatingPL = 0;
          for (let i = 0; i < data.length - 1; i++) {
            temp.push(data[i].split('~'));
            this.holdShares.push({
              stockCode: holdShare[i].stock_code,
              stockName: holdShare[i].stock_name,
              costPrice: holdShare[i].cost_price,
              totalNumber: holdShare[i].total_number,
              avlNumber: holdShare[i].avl_number,
              nowPrice: Number(temp[i][3]),   //该股票现价
              nowChg: Number(temp[i][32]), //该股票现涨跌幅
              nowPriceColor: getColorByOne(Number(temp[i][32])),
              marketValue: Number((Number(temp[i][3]) * holdShare[i].total_number).toFixed(2)), //该股票持有总市值
              floatingPL: Number(((Number(temp[i][3]) - holdShare[i].cost_price) * holdShare[i].total_number).toFixed(2)), //浮动盈亏
              floatingPLChg: Number(((Number(temp[i][3]) - holdShare[i].cost_price) / Number(temp[i][3]) * 100).toFixed(2)), //浮动盈亏比
              floatingColor: getColor(Number(temp[i][3]), holdShare[i].cost_price)
            });
            this.totalMarketValue += this.holdShares[i].marketValue;
            this.totalFloatingPL += this.holdShares[i].floatingPL;
          }
          for (let i = 0; i < data.length - 1; i++) {
            this.holdShares[i].todayFloatingPL = Number((this.holdShares[i].marketValue * Number(this.holdShares[i].nowChg) / 100).toFixed(2)) //今日浮动盈亏
            this.holdShares[i].storeRate = Number((this.holdShares[i].marketValue / (this.totalMarketValue + this.totalBalance) * 100).toFixed(2)) //仓位比重
          }
          this.totalFloatingPLChg = Number(this.totalFloatingPL / (this.totalMarketValue + this.totalBalance) * 100).toFixed(2)
          this.totalFloatingColor = getColorByOne(this.totalFloatingPL);
        })
      },

      //挂单
      entrustTradeOrder() {
        console.log(this.entrustForm);
        this.$confirm('请确定是否要进行挂单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.$refs['entrustForm'].validate((valid) => {
            if (valid) {
              console.log(this.entrustForm);
              //if (ifCurTimeIsTradeTime()) { //判断当前是否为交易时间
              let data = {
                token: this.userToken,
                code: changeToStockCode1(this.entrustForm.entrustCode),
                price: this.entrustForm.entrustPrice,
                number: this.entrustForm.entrustNumber,
                type: this.entrustForm.actionType
              };
              this.$store.dispatch('trade/entrustTradeOrder', data).then(() => {
                this.$notify({
                  title: 'Success',
                  message: '挂单成功',
                  type: 'success',
                  duration: 2000
                });
                this.dialogFormVisible = false;
                this.getUserBalanceStatus();
              })
              // }else{
              //   this.$notify({
              //     title: 'Error',
              //     message: '当前并非交易时间，无法进行交易',
              //     type: 'error',
              //     duration: 2000
              //   });
              // }
            }
          })
        })
      },

      //打开委托交易弹窗
      tradeDialog(type, index) {
        this.dialogFormVisible = true;
        this.entrustForm.actionType = type;
        console.log(this.hold_stocks)
        this.entrustForm.entrustCode = this.hold_stocks[index].stock_code.substr(2, 6);
        this.entrustForm.entrustStockName = this.hold_stocks[index].stock_name;
        this.entrustForm.canSellNumber = this.hold_stocks[index].avl_number;
        this.entrustForm.canBuyNumber = Math.floor(this.avlBalance / (this.entrustForm.entrustPrice * 100)) * 100;
        this.getStockPriceInfo(this.hold_stocks[index].stock_code);
      },

      //获取股票当前价格，并赋值可买、可卖的数量
      getStockPriceInfo(stockCode) {
        this.$store.dispatch('stock/getStockInfo', stockCode).then(res => {
          let stockInfo = res.data.split("~");
          this.entrustForm.entrustPrice = Number(stockInfo[3]);   //现价
          this.entrustForm.upLimitPrice = Number(stockInfo[47]);  //涨停价
          this.entrustForm.downLimitPrice = Number(stockInfo[48]);  //跌停价
          this.entrustPriceChange();
        })
      },

      //实时监控输入的价格来改变可买最大数量
      entrustPriceChange() {
        this.entrustForm.canBuyNumber = Math.floor(this.avlBalance / (this.entrustForm.entrustPrice * 100)) * 100;
      },

      //全仓、半仓、1/3仓
      storeRateChange() {
        if (this.entrustForm.actionType === 'buy') {
          this.entrustForm.entrustNumber = Math.floor(this.entrustForm.canBuyNumber * this.entrustForm.storeRate / 100) * 100;
        } else {
          this.entrustForm.entrustNumber = Math.floor(this.entrustForm.canSellNumber * this.entrustForm.storeRate / 100) * 100;
        }
      }
    }
  }
</script>
<style>
  .holdStockList {
    margin: 50px 50px 50px 50px;
  }

  .userBalanceStatus {
    margin: 50px auto 50px 7%;
  }

  .hold-stock-head-text {
    margin-right: 50px;
    font-size: 20px;
  }

  .hold-stock-trade-input-text {
    font-size: 12px;
    margin: 12px;
  }

  .el-table th {
    display: table-cell !important;
  }

  .hold-stock-trade-button {
    width: 200px;
  }

  .el-form-item {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
