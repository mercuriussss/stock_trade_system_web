import {
  cancelUserEntrustOrder, entrustTradeOrder, getCapitalStatus, getTodayUserTradeOrderInfo,
  getUserHistoryTradeOrderList, updateBalanceByBank
} from "../../api/trade";

const actions = {
  getTodayUserTradeOrderInfo({commit},query) {
    //console.log("getTodayUserTradeOrderInfo-start");
    //console.log(query);
    return new Promise((resolve, reject) => {
      getTodayUserTradeOrderInfo(query).then(response => {
        //console.log(response);
        //console.log("getTodayUserTradeOrderInfo-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  cancelUserEntrustOrder({commit},data) {
    //console.log("cancelUserEntrustOrder-start");
    //console.log(data);
    return new Promise((resolve, reject) => {
      cancelUserEntrustOrder(data).then(response => {
        //console.log(response);
        //console.log("cancelUserEntrustOrder-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  entrustTradeOrder({commit},data) {
    //console.log("entrustTradeOrder-start");
    //console.log(data);
    return new Promise((resolve, reject) => {
      entrustTradeOrder(data).then(response => {
        //console.log(response);
        //console.log("entrustTradeOrder-end");
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserHistoryTradeOrderList({commit},query) {
    //console.log("getUserHistoryTradeOrderList-start");
    //console.log(query);
    return new Promise((resolve, reject) => {
      getUserHistoryTradeOrderList(query).then(response => {
        //console.log(response);
        //console.log("getUserHistoryTradeOrderList-end");
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },


  getCapitalStatus({commit},token) {
    //console.log("getCapitalStatus-start")
    return new Promise((resolve, reject) => {
      getCapitalStatus(token).then(response => {
        const {data} = response
        //console.log(response)
        //console.log("getCapitalStatus-end")
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateBalanceByBank({commit}, data) {
    //console.log("updateBalanceByBank-start")
    //console.log(data)
    return new Promise((resolve, reject) => {
      updateBalanceByBank(data).then(response => {
        //console.log(response)
        //console.log("updateBalanceByBank-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
