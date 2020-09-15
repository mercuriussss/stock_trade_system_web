<template>
  <div class="list-container">
    <MinMarketChart/>
    <div class="stockSearch">
      <el-autocomplete
        class="inline-input"
        v-model="state"
        :fetch-suggestions="querySearch"
        placeholder="请输入股票代码或名称"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <el-button type="primary" @click="getSearchStockList">
        查询
      </el-button>
    </div>
    <div class="stockList">
      <el-table
        :key="tableKey"
        :data="stockList"
        border
        fit
        highlight-current-row
        :header-cell-style="{color: '#000000'}"
        :cell-style="{color: '#000000'}"
      >

        <el-table-column  v-if="userRole !== 'visitor'" label="添加自选股" align="center" width="100px" class-name="small-padding fixed-width" >
          <template slot-scope="{row,$index}">
            <el-button type="info" size="mini" @click="updateUserOptional(row.code,row.name,'delete',$index)"
                       v-if="row.ifOptional">
              已添加
            </el-button>
            <el-button type="primary" size="mini" @click="updateUserOptional(row.code,row.name,'add',$index)" v-else>
              添加
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="代码" prop="code" align="center" width="90px">
          <template slot-scope="{row}">
            <el-link type="primary" @click="jumpToStock(row.code,row.name)">{{ row.code }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="名称" min-width="110px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最新价" width="90px" align="center">
          <template slot-scope="{row}">
            <span :style="row.nowColor">{{ row.nowPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="涨跌幅" width="70px" align="center">
          <template slot-scope="{row}">
            <span :style="row.nowColor">{{ row.nowChg }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="涨跌额" width="70px" align="center">
          <template slot-scope="{row}">
            <span :style="row.nowColor">{{ row.nowChange }}</span>
          </template>
        </el-table-column>
        <el-table-column label="换手率" width="70px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.turnRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="振幅" width="70px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.amplitude }}%</span>
          </template>
        </el-table-column>
        <el-table-column label="成交量" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.vol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交额" width="100px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="昨收" width="90px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.preClose }}</span>
          </template>
        </el-table-column>
        <el-table-column label="今开" width="90px" align="center">
          <template slot-scope="{row}">
            <span :style="row.openColor">{{ row.open }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最高" width="90px" align="center">
          <template slot-scope="{row}">
            <span :style="row.highColor">{{ row.high }}</span>
          </template>
        </el-table-column>
        <el-table-column label="最低" width="90px" align="center">
          <template slot-scope="{row}">
            <span :style="row.lowColor">{{ row.low }}</span>
          </template>
        </el-table-column>
        <el-table-column label="市净率" width="90px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.PBR }}</span>
          </template>
        </el-table-column>
        <el-table-column label="流通值" width="90px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.cirMV }}亿</span>
          </template>
        </el-table-column>
        <el-table-column label="总市值" width="90px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.totalMV }}亿</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  :pageSizes.sync="pageSizes" @pagination="getStockList"/>
    </div>
  </div>
</template>
<script>

  import IndexHead from "@/components/Charts/IndexHead";
  import MinMarketChart from "@/components/Charts/MinMarketChart"
  import Pagination from '@/components/Pagination'
  import {
    handleAmount,
    handleVol,
    getColor,
    handleCode,
    changeToStockCode1,
    changeToStockCode2, ifCurTimeIsTradeTime
  } from "../../../utils/stockUtils";

  export default {
    name: 'stockList',
    components: {
      IndexHead,
      MinMarketChart,
      Pagination
    },
    data() {
      return {
        userRole: this.$store.getters.roles,
        state: '',
        stockList: [],
        stockListCode: '',
        colorArr: [],
        tableKey: 0,
        total: 0,
        userOptional: [],
        stockListTimer: '', //定时刷新器
        listQuery: {
          page: 1,
          limit: 10,
          keyword: undefined
        },
        pageSizes: [10, 15, 20, 25, 30, 50]
      }
    },
    mounted() {
      this.getStockListStart();
    },
    beforeDestroy() {
      this.$once('hook:beforeDestroy', () => {
        clearInterval(this.stockListTimer);
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
              ts_code: res.data[i].ts_code,
              name: res.data[i].name
            })
          }
        });
        // 调用 callback 返回建议列表的数据
        cb(stockQuery);
      },
      getStockListStart() {
        this.getUserOptional();
        this.getStockList();
        this.stockListTimer = setInterval(() => {
          if (ifCurTimeIsTradeTime()) {
            this.getStockListInfo(this.stockListCode)
          }
        }, 3000);
      },
      getStockList() {
        this.$store.dispatch('stock/getStockList', this.listQuery).then(res => {
          console.log(res);
          this.total = res.data.total;
          this.stockListCode = handleCode(res.data.items);
          this.getStockListInfo(this.stockListCode);
        });
      },
      getStockListInfo(stockCode) {
        this.$store.dispatch('stock/getStockInfo', stockCode).then(res => {
          let data = res.data.split(';');
          let temp = [];
          this.stockList = [];
          for (let i = 0; i < data.length - 1; i++) {
            temp.push(data[i].split('~'));
            this.stockList.push({
              name: temp[i][1],       //股票名称
              code: temp[i][2],       //代码
              nowPrice: temp[i][3],   //现价
              nowChg: temp[i][32],    //涨跌幅
              nowChange: temp[i][31], //涨跌额
              amplitude: temp[i][43], //振幅
              turnRate: temp[i][38],  //换手率
              vol: handleVol(temp[i][36]),       //成交量
              amount: handleAmount(temp[i][37]),    //成交额
              preClose: temp[i][4],   //昨收
              open: temp[i][5],       //今开
              high: temp[i][41],      //最高
              low: temp[i][42],       //最低
              PBR: temp[i][46],       //市净率
              cirMV: temp[i][44],     //流通市值
              totalMV: temp[i][45],   //总市值
              nowColor: getColor(Number(temp[i][3]), Number(temp[i][4])),
              openColor: getColor(Number(temp[i][5]), Number(temp[i][4])),
              highColor: getColor(Number(temp[i][41]), Number(temp[i][4])),
              lowColor: getColor(Number(temp[i][42]), Number(temp[i][4])),
              ifOptional: this.ifAddOptional(temp[i][2])
            });
          }
        })
      },
      getUserOptional() {
        this.$store.dispatch('stock/getUserAllOptionalCode',this.$store.getters.token).then(res => {
          console.log(res);
          this.userOptional = res.data.items;
        })
      },
      handleSelect(item) {
        let stockCode1 = changeToStockCode1(item.ts_code.split('.')[0]);
        let stockCode2 = changeToStockCode2(item.ts_code.split('.')[0]);
        let query = {stockCode1: stockCode1, stockCode2: stockCode2, stockName: item.name};
        this.$store.dispatch('stock/saveStockCodeToIndividual', query);
        this.$router.push({ path: '/stock/individual'});
      },
      jumpToStock(code,name) {
        let stockCode1 = changeToStockCode1(code);
        let stockCode2 = changeToStockCode2(code);
        let query = {stockCode1: stockCode1, stockCode2: stockCode2, stockName: name};
        this.$store.dispatch('stock/saveStockCodeToIndividual', query);
        this.$router.push({ path: '/stock/individual'});
      },
      ifAddOptional(code) {
        if(this.userOptional === null || this.userOptional === undefined){
          return false;
        }
        return (this.userOptional.indexOf(changeToStockCode1(code)) > -1);
      },
      updateUserOptional(code, name, type, index) {
        let data = {token: this.$store.getters.token, code: changeToStockCode1(code), name: name, type: type};
        this.$store.dispatch('stock/updateUserOptional', data).then(() => {
          let optional = changeToStockCode1(code);
          if (type === 'add') {
            this.userOptional.push(optional);
            this.stockList[index].ifOptional = (this.userOptional.indexOf(optional) > -1);
          } else if (type === 'delete') {
            let i = this.userOptional.indexOf(optional);
            this.userOptional.splice(i, 1);
            this.stockList[index].ifOptional = (this.userOptional.indexOf(optional) > -1);
          } else {

          }
        })
      },
      getSearchStockList() {
        this.listQuery.keyword = this.state;
        this.getStockList();
      }
    }
  }
</script>
<style>
  .list-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .stockSearch {
    margin-top: 20px;
    margin-left: 40px;
  }

  .stockList {
    margin: 20px 40px auto 40px;
    text-decoration-color: #000000;
  }

  .el-table th {
    display: table-cell !important;
  }
</style>
