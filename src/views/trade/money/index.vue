<template>
  <div class="money-container">
    <el-row :gutter="40" class="panel-group">
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text">总资产：{{totalBalance + totalMarketValue}}</div>
          <el-button class="card-panel-button" type="info" @click="storeBalance()">转入</el-button>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text">可用金额： {{avlBalance}}</div>
          <el-button class="card-panel-button" type="info" @click="takeOutBalance()">转出</el-button>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text">总市值: {{totalMarketValue}}</div>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text">仓位比重: {{totalStoreRate}}%</div>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text" :style="totalFloatingPLColor">浮动总盈亏: {{totalFloatingPL}}</div>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text" :style="totalFloatingPLColor">浮动总盈亏率: {{totalFloatingPLChg}}%</div>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text" :style="todayTotalFloatingPLColor">今日浮动盈亏: {{todayTotalFloatingPL}}</div>
        </div>
      </el-col>
      <el-col :span="12" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-text" :style="todayTotalFloatingPLColor">今日浮动盈亏率: {{todayTotalFloatingPLChg}}%</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Utils from "../../../utils/utils";
  import getters from "../../../store/getters"
  import {getColor, getColorByOne, ifCurTimeIsTradeTime} from "../../../utils/stockUtils";

  export default {
    data() {
      return {
        totalBalance: '',
        avlBalance: '',
        totalMarketValue: 0,
        totalStoreRate: 0,

        totalFloatingPL: 1,
        totalFloatingPLChg: 0,
        totalFloatingPLColor: '',

        todayTotalFloatingPL: 0,
        todayTotalFloatingPLChg: 0,
        todayTotalFloatingPLColor: '',

        hold_stocks:[],
        holdShares:[],

        userToken: this.$store.getters.token,

        listTimer: '', //定时刷新器，刷新股价信息
        holdSharesTimer: '', //定时刷新器2，刷新数据库持仓信息
      }
    },
    created() {
      this.getCapitalStatus();
      this.holdSharesTimer = this.listTimer = setInterval(() => {
        if (ifCurTimeIsTradeTime()) {
          this.getCapitalStatus();
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
      getCapitalStatus() {
        this.$store.dispatch('trade/getCapitalStatus',this.userToken).then(res => {
          console.log(res);
          this.totalBalance = Number(res.total_balance);
          this.avlBalance = Number(res.avl_balance);
          this.getStocksNowPrice(res.hold_stocks);
          this.listTimer = setInterval(() => {
            if (ifCurTimeIsTradeTime()) {
              this.getStocksNowPrice(res.hold_stocks);
            }
          }, 3000)
        })
      },
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
          this.todayTotalFloatingPL = 0;
          this.totalStoreRate = 0;
          for (let i = 0; i < data.length - 1; i++) {
            temp.push(data[i].split('~'));
            this.holdShares.push({
              marketValue: Number((Number(temp[i][3]) * holdShare[i].total_number).toFixed(2)), //该股票持有总市值
              floatingPL: Number(((Number(temp[i][3]) - holdShare[i].cost_price) * holdShare[i].total_number).toFixed(2)), //浮动盈亏
              floatingPLChg: Number(((Number(temp[i][3]) - holdShare[i].cost_price) / Number(temp[i][3]) * 100).toFixed(2)), //浮动盈亏比
              floatingPLColor: getColor(Number(temp[i][3]), holdShare[i].cost_price),
              todayFloatingPLChg: Number(temp[i][32]), //今日浮动盈亏率
            });
            this.totalMarketValue += this.holdShares[i].marketValue;
            this.totalFloatingPL += this.holdShares[i].floatingPL;
          }
          for (let i = 0; i < data.length - 1; i++) {
            this.holdShares[i].todayFloatingPL = Number((this.holdShares[i].marketValue * this.holdShares[i].todayFloatingPLChg / 100).toFixed(2)) //今日浮动盈亏
            this.holdShares[i].todayFloatingColor = getColorByOne(this.holdShares[i].todayFloatingPLChg)
            this.todayTotalFloatingPL += Number(this.holdShares[i].todayFloatingPL);
          }

          this.totalFloatingPLColor = getColorByOne(this.totalFloatingPL);
          this.totalFloatingPLChg = Number(this.totalFloatingPL / (this.totalMarketValue + this.totalBalance) * 100).toFixed(2)

          this.todayTotalFloatingPL = this.todayTotalFloatingPL.toFixed(2)
          this.todayTotalFloatingPLColor = getColorByOne(this.todayTotalFloatingPL);
          this.todayTotalFloatingPLChg = Number(this.todayTotalFloatingPL / (this.totalMarketValue + this.totalBalance) * 100).toFixed(2)
          this.totalStoreRate = Number(this.totalMarketValue/(this.totalMarketValue + this.totalBalance) * 100).toFixed(2)  //总仓位比重
        })
      },
      takeOutBalance() {
        this.$prompt('请输入即将从账户转出到银行卡的金额', '转入', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: Utils.moneyReg,
          inputErrorMessage: '请输入正确的金额数字，小数点后不能超过2位，并且不能为负数'
        }).then(({value}) => {
          if (this.avlBalance > value) {
            const updateValue =  -value;
            const data = {token: this.userToken, updateValue: updateValue}
            this.$store.dispatch('trade/updateBalanceByBank', data).then(() => {
              this.dialogFormVisible = false;
              this.$notify({
                title: 'Success',
                message: '资金取出成功',
                type: 'success',
                duration: 2000
              });
              this.getCapitalStatus()
            })
          }else {
            this.$notify({
              title: 'Warning',
              message: '取出失败，您当前账户可取出的金额不足',
              type: 'warning',
              duration: 2000
            });
          }
        })
      },
      storeBalance() {
        this.$prompt('请输入即将从银行卡转入到账户的金额', '转入', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: Utils.moneyReg,
          inputErrorMessage: '请输入正确的金额数字，小数点后不能超过2位，并且不能为负数'
        }).then(({value}) => {
          const data = {token: this.userToken, updateValue: value}
          this.$store.dispatch('trade/updateBalanceByBank', data).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: 'Success',
              message: '资金转入成功',
              type: 'success',
              duration: 2000
            });
            this.getCapitalStatus()
          })
        })
      }
    }
  }
</script>

<style>
  .money-container {
    width: 60%;
    margin-left: 20%;
    margin-top: 2%;
  }

  .panel-group {
    margin-top: 18px;
  }

  .card-panel-col {
    margin-bottom: 25px;
  }

  .card-panel {
    height: 108px;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 30px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
  }

  .card-panel-text {
    line-height: 18px;
    color: #000000;
    font-size: 20px;
    margin-top: 40px;
    margin-left: 25px;
  }

  .card-panel-button {
    margin-top: -50px;
    margin-left: 70%;
  }
</style>
