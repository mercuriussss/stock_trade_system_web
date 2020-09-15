<template>
  <div class="trade-container">
    <h1>股票交易</h1>
    <el-card class="box-card">
      <el-row :gupanr="10" type="flex" class="trade-row" align="center">
        <el-col :span="10" class="trade-col" align="center">
          <el-form ref="entrustForm" :model="entrustForm" :rules="rules" class="trade-col-container">
            <el-form-item align="center" prop="actionType">
              <el-radio-group v-model="entrustForm.actionType" @change="actionTypeChange">
                <el-radio-button label="buy">买入</el-radio-button>
                <el-radio-button label="sell">卖出</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item align="center" prop="entrustCode">
              <el-autocomplete
                v-model="entrustForm.entrustCode"
                :fetch-suggestions="querySearch"
                placeholder="请输入股票代码或名称"
                :trigger-on-focus="false"
                @select="handleSelect"
              ></el-autocomplete>
            </el-form-item>
            <el-form-item align="center" style="height: 30px" prop="entrustPrice">
              <el-input-number v-model="entrustForm.entrustPrice" :precision="2" :step="0.01"
                               :max="entrustForm.upLimitPrice"
                               :min="entrustForm.downLimitPrice"
                               @input='entrustPriceChange'></el-input-number>
            </el-form-item>
            <el-form-item align="center" style="height: 30px">
              <span class="trade-input-text">跌停:<span :style="downColor">{{entrustForm.downLimitPrice}}</span></span>
              <span class="trade-input-text"
                    v-if="entrustForm.actionType === 'buy'">可买数量:{{entrustForm.canBuyNumber}}</span>
              <span class="trade-input-text" v-else>可卖数量:{{entrustForm.canSellNumber}}</span>
              <span class="trade-input-text">涨停:<span :style="upColor">{{entrustForm.upLimitPrice}}</span></span>
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
              <el-button v-if="entrustForm.actionType === 'buy'" class="trade-button" type="danger" size="medium"
                         @click="entrustTradeOrder">买入
              </el-button>
              <el-button v-else class="trade-button" type="primary" size="medium" @click="entrustTradeOrder">卖出
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10" class="trade-col" align="center">
          <h3>五档交易信息</h3>
          <div class="BSInfoHead">
            <span class="BS-head-text">{{BSTradeHead[0]}}</span>
            <span class="BS-head-text" :style="BSTradeHead[4]">{{BSTradeHead[1]}}</span>
            <span class="BS-head-text" :style="BSTradeHead[4]">{{BSTradeHead[2]}}</span>
            <span class="BS-head-text" :style="BSTradeHead[4]">{{BSTradeHead[3]}}</span>
          </div>
          <div class="BSInfo">
            <el-row :gutter="5" type="flex" class="BS-S" align="center">
              <el-col :span="8">
                <div class="BS-text">卖五</div>
                <div class="BS-text">卖四</div>
                <div class="BS-text">卖三</div>
                <div class="BS-text">卖二</div>
                <div class="BS-text">卖一</div>
              </el-col>
              <el-col :span="8">
                <div class="BS-text" :style="BSTradeColorArr[9]">{{BSTradeInfo[18]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[8]">{{BSTradeInfo[16]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[7]">{{BSTradeInfo[14]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[6]">{{BSTradeInfo[12]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[5]">{{BSTradeInfo[10]}}</div>
              </el-col>
              <el-col :span="8">
                <div class="BS-text">{{BSTradeInfo[19]}}</div>
                <div class="BS-text">{{BSTradeInfo[17]}}</div>
                <div class="BS-text">{{BSTradeInfo[15]}}</div>
                <div class="BS-text">{{BSTradeInfo[13]}}</div>
                <div class="BS-text">{{BSTradeInfo[11]}}</div>
              </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="5" type="flex" class="BS-B" align="center">
              <el-col :span="8">
                <div class="BS-text">买一</div>
                <div class="BS-text">买二</div>
                <div class="BS-text">买三</div>
                <div class="BS-text">买四</div>
                <div class="BS-text">买五</div>
              </el-col>
              <el-col :span="8">
                <div class="BS-text" :style="BSTradeColorArr[0]">{{BSTradeInfo[0]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[1]">{{BSTradeInfo[2]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[2]">{{BSTradeInfo[4]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[3]">{{BSTradeInfo[6]}}</div>
                <div class="BS-text" :style="BSTradeColorArr[4]">{{BSTradeInfo[8]}}</div>
              </el-col>
              <el-col :span="8">
                <div class="BS-text">{{BSTradeInfo[1]}}</div>
                <div class="BS-text">{{BSTradeInfo[3]}}</div>
                <div class="BS-text">{{BSTradeInfo[5]}}</div>
                <div class="BS-text">{{BSTradeInfo[7]}}</div>
                <div class="BS-text">{{BSTradeInfo[9]}}</div>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="10" class="trade-col" align="center">
          <el-tabs v-model="actionName" type="card">
            <el-button class="trade-hold-head-btn" size="mini" type="primary" @click="getUserBalanceStatus" round>
              刷新
            </el-button>
            <el-tab-pane label="挂单" name="entrustOrder">
              <el-table
                :data="entrustOrder"
                height="400"
                border
                fit
                highlight-current-row
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                style="width: 100%"
              >
                <el-table-column label="操作" prop="action" align="center" width="90">
                  <template slot-scope="{row,$index}">
                    <el-button type="danger" size="mini" @click="cancelEntrustOrder(row.orderId,$index)">
                      撤单
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column label="股票代码" prop="stockCode" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.stockCode.substr(2,6) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="股票名称" prop="stockName" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.stockName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="委托时间" prop="costPrice" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.entrustTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="委托数量" prop="totalNumber" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.entrustNumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="委托价格" prop="entrustPrice" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.entrustPrice }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="委托类型" prop="type" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.type }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="委托状态" prop="station" align="center" width="80">
                  <template slot-scope="{row}">
                    <span>{{ row.station }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page"
                          :limit.sync="listQuery.limit"
                          :pageSizes.sync="pageSizes" @pagination="getTodayUserTradeOrderInfo"/>
            </el-tab-pane>
            <el-tab-pane label="持仓信息" name="holdShares">
              <el-table
                :data="holdShares"
                height="400"
                border
                fit
                highlight-current-row
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
                style="width: 100%"
              >
                <el-table-column label="股票" prop="stock" align="center" width="95" fixed>
                  <template slot-scope="{row}">
                    <div>{{ row.stockName }}</div>
                    <div>{{ row.stockCode.substr(2,6) }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="成本/现价" prop="price" align="center" width="95">
                  <template slot-scope="{row}">
                    <div :style="row.floatingColor">{{ row.costPrice }}</div>
                    <div :style="row.floatingColor">{{ row.nowPrice }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="持仓/可用" prop="number" align="center" width="95">
                  <template slot-scope="{row}">
                    <div>{{ row.totalNumber }}</div>
                    <div>{{ row.avlNumber }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="当日盈亏" prop="todayFloatingPL" align="center" width="95">
                  <template slot-scope="{row}">
                    <div :style="row.todayFloatingColor">{{ row.todayFloatingPLChg }}%</div>
                    <div :style="row.todayFloatingColor">{{ row.todayFloatingPL }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="总盈亏" prop="floatingPL" align="center" width="95">
                  <template slot-scope="{row}">
                    <div :style="row.floatingColor">{{ row.floatingPLChg }}%</div>
                    <div :style="row.floatingColor">{{ row.floatingPL }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="总市值" prop="marketValue" align="center" width="95">
                  <template slot-scope="{row}">
                    <div :style="row.floatingColor">{{ row.marketValue }}</div>
                  </template>
                </el-table-column>
                <el-table-column label="仓位比重" prop="storeRate" align="center" width="95">
                  <template slot-scope="{row}">
                    <div>{{ row.storeRate }}%</div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination';
  import {
    changeToStockCode1,
    getBSTradeInfo, getBSTradeInfoColor, getBSTradeInfoHead,
    getColor,
    getColorByOne,
    getDownColor,
    getUpColor, handleOrderStation, handleOrderType, handleTimestamp, ifCurTimeIsTradeTime
  } from "../../../utils/stockUtils";
  import Util from "../../../utils/utils";

  export default {
    name: "trade",
    components: {
      Pagination
    },
    data() {
      const validateEntrustCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入股票代码'))
        } else if (!Util.entrustCodeReg.test(value)) {
          callback(new Error('请输入正确的股票代码'))
        } else {
          callback()
        }
      };
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
        upColor: getUpColor(),
        downColor: getDownColor(),

        userToken: this.$store.getters.token,

        entrustOrder: [], //目前还挂着的委托单列表
        actionName: 'entrustOrder',

        entrustForm: {
          entrustCode1: sessionStorage.getItem("stockCode1") || this.$store.getters.stockCode1, //委托股票代码
          entrustCode: '',
          entrustPrice: 0,    //委托价
          entrustNumber: 0,  //委托数量
          upLimitPrice: 0, //涨停价
          downLimitPrice: 0, //跌停价
          storeRate: undefined, //购买仓位比重
          actionType: 'buy',
          canBuyNumber: 0,
          canSellNumber: 0
        },

        BSTradeInfo: [],   //五档买卖信息
        BSTradeColorArr: [], //五档买卖信息颜色
        BSTradeHead: [], //五档买卖信息头部，包含股票名、现价、现涨跌幅、现涨跌额

        totalBalance: 0, //总资金
        avlBalance: 0,    //可用资金
        totalMarketValue: 0,  //总市值

        listTimer: '', //定时刷新器，刷新股价信息
        holdSharesTimer: '', //定时刷新器2，刷新数据库持仓信息

        hold_stocks: [],
        holdShares: [],

        station: {
          entrust: 0, //还挂着的单
          cancel: -1, //已撤的单
          done: 1 //已成交的单
        },

        listQuery: {
          page: 1,
          limit: 10,
          total: 0
        },
        pageSizes: [10, 15, 25, 20, 30, 50],

        rules: {
          entrustCode: [{
            validator: validateEntrustCode
          }],
          entrustNumber: [{
            validator: validateEntrustNumber
          }]
        }
      }
    },
    created() {
      this.entrustForm.entrustCode = this.entrustForm.entrustCode1.substr(2, 6);
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
      querySearch(query, cb) {
        let stockQuery = [];
        this.$store.dispatch('stock/getQueryStock', query).then(res => {
          for (let i = 0; i < res.data.length; i++) {
            //this.stockQuery[i].value = res.data[i].symbol + '\t' + res.data[i].name
            stockQuery.push({
              value: res.data[i].symbol + '\t' + res.data[i].name,
              symbol: res.data[i].symbol,
              name: res.data[i].name
            })
          }
        });
        // 调用 callback 返回建议列表的数据
        cb(stockQuery);
      },
      handleSelect(item) {
        this.entrustForm.entrustCode = item.symbol;
        this.entrustForm.entrustCode1 = changeToStockCode1(item.symbol);
        this.getStockPriceInfo(this.entrustForm.entrustCode1);
      },

      getUserBalanceStatus() {
        this.$store.dispatch('trade/getCapitalStatus', this.userToken).then(res => {
          this.totalBalance = Number(res.total_balance);
          this.avlBalance = Number(res.avl_balance);
          this.hold_stocks = res.hold_stocks;
          this.getStocksNowPrice(res.hold_stocks);
          this.getTodayUserTradeOrderInfo();
          this.getStockPriceInfo(this.entrustForm.entrustCode1);
          this.listTimer = setInterval(() => {
            if (ifCurTimeIsTradeTime()) {
              this.getStockPriceInfo(this.entrustForm.entrustCode1);
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
          this.floatingPL = 0;
          for (let i = 0; i < data.length - 1; i++) {
            temp.push(data[i].split('~'));
            this.holdShares.push({
              stockCode: holdShare[i].stock_code,
              stockName: holdShare[i].stock_name,
              costPrice: holdShare[i].cost_price,
              totalNumber: holdShare[i].total_number,
              avlNumber: holdShare[i].avl_number,
              nowPrice: Number(temp[i][3]),   //该股票现价
              marketValue: Number((Number(temp[i][3]) * holdShare[i].total_number).toFixed(2)), //该股票持有总市值
              floatingPL: Number(((Number(temp[i][3]) - holdShare[i].cost_price) * holdShare[i].total_number).toFixed(2)), //浮动盈亏
              floatingPLChg: Number(((Number(temp[i][3]) - holdShare[i].cost_price) / Number(temp[i][3]) * 100).toFixed(2)), //浮动盈亏比
              floatingColor: getColor(Number(temp[i][3]), holdShare[i].cost_price),
              todayFloatingPLChg: Number(temp[i][32]), //今日浮动盈亏率
            });
            this.totalMarketValue += this.holdShares[i].marketValue;
          }
          for (let i = 0; i < data.length - 1; i++) {
            this.holdShares[i].todayFloatingPL = Number((this.holdShares[i].marketValue * this.holdShares[i].todayFloatingPLChg / 100).toFixed(2)) //今日浮动盈亏
            this.holdShares[i].storeRate = Number((this.holdShares[i].marketValue / (this.totalMarketValue + this.totalBalance) * 100).toFixed(2)) //仓位比重
            this.holdShares[i].todayFloatingColor = getColorByOne(this.holdShares[i].todayFloatingPLChg)
          }
        })
      },

      getTodayUserTradeOrderInfo() {
        let query = {
          token: this.userToken,
          station: this.station.entrust,
          page: this.listQuery.page,
          limit: this.listQuery.limit
        };
        this.entrustOrder = [];
        this.$store.dispatch('trade/getUserHistoryTradeOrderList', query).then(response => {
          this.listQuery.total = response.total;
          let res = response.items;
          for (let i = 0; i < res.length; i++) {
            this.entrustOrder.push({
              orderId: res[i].order_id,
              stockCode: res[i].stock_code,
              stockName: res[i].stock_name,
              station: handleOrderStation(res[i].station),
              entrustTime: handleTimestamp(res[i].entrust_time, 'hh:mm:ss'),
              entrustPrice: res[i].entrust_price,
              entrustNumber: res[i].number,
              donePrice: res[i].done_price === undefined ? "———" : res[i].done_price,
              cancelTime: handleTimestamp(res[i].cancel_time, 'hh:mm:ss'),
              doneTime: handleTimestamp(res[i].done_time, 'hh:mm:ss'),
              type: handleOrderType(res[i].type)
            })
          }
        })
      },

      //撤单
      cancelEntrustOrder(orderId, index) {
        this.$confirm('请确定是否要撤销该委托单？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let data = {token: this.userToken, orderId: orderId};
          console.log("data:");
          console.log(data);
          this.$store.dispatch('trade/cancelUserEntrustOrder', data).then(() => {
            this.$notify({
              title: 'Success',
              message: '撤单成功',
              type: 'success',
              duration: 2000
            });
            this.entrustOrder.splice(index, 1);
            this.getUserBalanceStatus();
          })
        })
      },

      //挂单
      entrustTradeOrder() {
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
                code: this.entrustForm.entrustCode1,
                price: this.entrustForm.entrustPrice.toFixed(2),
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

      //获取股票当前价格，并赋值可买、可卖的数量
      getStockPriceInfo(stockCode) {
        this.$store.dispatch('stock/getStockInfo', stockCode).then(res => {
          let stockInfo = res.data.split("~");
          this.entrustForm.entrustPrice = Number(stockInfo[3]);   //现价
          this.entrustForm.upLimitPrice = Number(stockInfo[47]);  //涨停价
          this.entrustForm.downLimitPrice = Number(stockInfo[48]);  //跌停价

          this.BSTradeInfo = getBSTradeInfo(stockInfo);
          this.BSTradeColorArr = getBSTradeInfoColor(Number(stockInfo[4]),this.BSTradeInfo);
          this.BSTradeHead = getBSTradeInfoHead(stockInfo);

          this.entrustForm.canSellNumber = 0;

          this.entrustPriceChange();
          this.actionTypeChange();
        })
      },

      entrustPriceChange() {
        this.entrustForm.canBuyNumber = Math.floor(this.avlBalance / (this.entrustForm.entrustPrice * 100)) * 100;
      },
      storeRateChange() {
        if (this.entrustForm.actionType === 'buy') {
          this.entrustForm.entrustNumber = Math.floor(this.entrustForm.canBuyNumber * this.entrustForm.storeRate / 100) * 100;
        } else {
          this.entrustForm.entrustNumber = Math.floor(this.entrustForm.canSellNumber * this.entrustForm.storeRate / 100) * 100;
        }
      },
      actionTypeChange() {
        for (let i = 0; i < this.holdShares.length; i++) {
          if (this.holdShares[i].stockCode === this.entrustForm.entrustCode1) {
            this.entrustForm.canSellNumber = this.holdShares[i].avlNumber;
          }
        }
        console.log(this.entrustForm.entrustNumber);
        if (isNaN(this.entrustForm.entrustNumber)) {
          this.entrustForm.entrustNumber = 0;
        }
      }
    }
  }
</script>
<style>
  .trade-container {
    margin: 50px 50px 50px 50px;
  }

  .trade-col {
    border: 1px solid #cbcdd1;
    background-color: rgb(245, 245, 245);
  }

  .trade-col-container {
    margin-top: 20px;
  }

  .BSInfo {
    width: 220px;
    margin-top: 20px;
    border: 1px solid #cbcdd1;
    background-color: rgb(245, 245, 245);
  }

  .BS-B {
    margin-top: -20px;
  }

  .BS-S {
    margin-bottom: -20px;
  }

  .BS-text {
    margin: 3px auto 3px auto;
    font-size: 17px;
  }

  .BSInfoHead {
    margin-top: 40px;
  }

  .BS-head-text {
    margin: 3px 5px 3px 5px;
    font-size: 17px;
  }

  .trade-hold-head-text {
    margin-left: 38%;
    font-size: 18px;
    font-weight: bold;
  }

  .trade-hold-head-btn {
    margin: 0 auto 5px 10%;
  }

  .trade-hold-shares-head {
    margin: 20px auto 15px auto;
  }
</style>
