import request from '@/utils/request'
import qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function register(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function getUncheckedList(query) {
  return request({
    url: '/user/getUncheckedList',
    method: 'get',
    params: query
  })
}

export function getUserList(query) {
  return request({
    url: '/user/getUserList',
    method: 'get',
    params: query
  })
}

export function updateUncheckedUser(user) {
  return request({
    url: '/user/updateUncheckedUser',
    method: 'post',
    data: qs.stringify(user)
  })
}

export function updateUser(user) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data: qs.stringify(user)
  })
}

export function deleteUncheckedUser(id) {
  return request({
    url: '/user/deleteUncheckedUser',
    method: 'post',
    data: qs.stringify(id)
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/deleteUser',
    method: 'post',
    data: qs.stringify(id)
  })
}

export function passUncheckedUser(user) {
  return request({
    url: '/user/passUncheckedUser',
    method: 'post',
    data: qs.stringify(user)
  })
}

export function updatePassword(data) {
  return request({
    url: '/user/updatePassword',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function upload(file) {
  return request({
    url: '/user/file',
    method: 'post',
    data: qs.stringify(file)
  })
}

export function updateUserAvatar(data) {
  return request({
    url: '/user/updateUserAvatar',
    method: 'post',
    data: qs.stringify(data)
  })
}
