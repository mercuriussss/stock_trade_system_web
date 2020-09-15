<template>
  <div style="padding:30px;">
    <div class="searchSelect">
      <el-date-picker
        v-model="listQuery.selectTime"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        :picker-options="timeOptions">
      </el-date-picker>
      <el-select v-model="listQuery.selectStation" placeholder="请选择">
        <el-option
          v-for="item in stationOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" @click="getTradeOrderList">
        查询
      </el-button>
    </div>
    <div class="historyOrderList">
      <el-table
        :data="historyOrderList"
        border
        height="520"
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'#606266'}"
        style="width: 100%;left: 20px"
      >

        <el-table-column label="股票代码" prop="stockCode" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.stockCode.substr(2,6) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="股票名称" prop="stockName" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.stockName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托价格" prop="totalNumber" align="center" width="95">
          <template slot-scope="{row}">
            <span>{{ row.entrustPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托数量" prop="avlNumber" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.entrustNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托类型" prop="floatingPL" align="center" width="90">
          <template slot-scope="{row}">
            <span :style="row.typeColor">{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托时间" prop="costPrice" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.entrustTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="撤单时间" prop="floatingPLChg" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.cancelTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交时间" prop="nowPrice" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.doneTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交价格" prop="nowChg" align="center" width="94">
          <template slot-scope="{row}">
            <span>{{ row.donePrice }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托单状态" prop="marketValue" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.station }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="listQuery.total>0" :total="listQuery.total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                  :pageSizes.sync="pageSizes" @pagination="getTradeOrderList"/>
    </div>
  </div>
</template>
<script>

  import Pagination from '@/components/Pagination'
  import {
    getDownColor,
    getUpColor,
    handleOrderStation,
    handleOrderType,
    handleTimestamp
  } from "../../../utils/stockUtils";

  export default {
    name: "historyOrder",
    components: {
      Pagination
    },
    data() {
      return {
        timeOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        },
        stationOptions: [{
          value: null,
          label: "历史委托"
        }, {
          value: 1,        //1对应委托单station的成交
          label: "历史成交"
        }],

        userToken: this.$store.getters.token,

        listQuery: {
          page: 1,
          limit: 10,
          total: 0,
          selectTime: undefined,
          selectStation: null,
        },
        pageSizes: [10, 15, 25, 20, 30, 50],

        upColor: getUpColor(),
        downColor: getDownColor(),

        activeName: "entrust-order-list",

        historyOrderList: [],
      }
    },
    created(){
      this.getTradeOrderList();
    },
    methods: {
      getTradeOrderList() {
        console.log(this.listQuery.selectTime);
        console.log(this.listQuery.selectStation);
        let query = '';
        if (this.listQuery.selectTime === undefined) {
          query = {
            token: this.userToken,
            start: null,
            end: null,
            station: this.listQuery.selectStation,
            page: this.listQuery.page,
            limit: this.listQuery.limit
          };
        } else {
          query = {
            token: this.userToken,
            start: this.listQuery.selectTime[0] + " 00:00:00",
            end: this.listQuery.selectTime[1] + " 23:59:59",
            station: this.listQuery.selectStation,
            page: this.listQuery.page,
            limit: this.listQuery.limit
          };
        }
        this.$store.dispatch('trade/getUserHistoryTradeOrderList', query).then(res => {
          this.listQuery.total = res.total;
          this.historyOrderList = [];
          for (let i = 0; i < res.items.length; i++) {
            this.historyOrderList.push({
              stockCode: res.items[i].stock_code,
              stockName: res.items[i].stock_name,
              station: handleOrderStation(res.items[i].station),
              entrustTime: handleTimestamp(res.items[i].entrust_time, 'yyyy-MM-dd hh:mm:ss'),
              entrustPrice: res.items[i].entrust_price,
              entrustNumber: res.items[i].number,
              donePrice: res.items[i].done_price === undefined ? "———" : res.items[i].done_price,
              doneTime: res.items[i].done_time === undefined ? "———" : handleTimestamp(res.items[i].done_time, 'yyyy-MM-dd hh:mm:ss'),
              cancelTime: res.items[i].cancel_time === undefined ? "———" : handleTimestamp(res.items[i].cancel_time, 'yyyy-MM-dd hh:mm:ss'),
              type: handleOrderType(res.items[i].type),
              typeColor: res.items[i].type === 'buy' ? this.upColor: this.downColor,
            })
          }
        })
      }
    }
  }
</script>
<style>

  .searchSelect {
    margin: 50px 5% 50px 10%;
  }

  .historyOrderList {
    margin: 50px 50px 50px 50px;
  }

  .el-table th {
    display: table-cell !important;
  }
</style>
