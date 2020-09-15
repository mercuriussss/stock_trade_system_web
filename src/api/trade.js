import request from '@/utils/request'
import qs from 'qs'

export function getTodayUserTradeOrderInfo(query) {
  return request({
    url: '/trade/getTodayUserTradeOrderInfo',
    method: 'get',
    params: query
  })
}

export function cancelUserEntrustOrder(data) {
  return request({
    url: '/trade/cancelOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function entrustTradeOrder(data) {
  return request({
    url: '/trade/entrustOrder',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getUserHistoryTradeOrderList(query) {
  return request({
    url: '/trade/getUserHistoryTradeOrderList',
    method: 'get',
    params: query
  })
}


export function getCapitalStatus(token) {
  return request({
    url: '/trade/getCapitalStatus',
    method: 'get',
    params: { token }
  })
}

export function updateBalanceByBank(data) {
  return request({
    url: '/trade/updateBalanceByBank',
    method: 'post',
    data: qs.stringify(data)
  })
}
