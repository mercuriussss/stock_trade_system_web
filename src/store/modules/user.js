import {login, logout, getInfo, register, getUncheckedList, updateUncheckedUser, deleteUncheckedUser,
  passUncheckedUser, getUserList, updateUser, deleteUser, updatePassword, upload,
  } from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import {updateUserAvatar} from "../../api/user";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    sex: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SEX: (state, sex) => {
    state.sex = sex
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response
        // console.log("login2")
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response
        //console.log(response)
        const {roles, name, avatar, sex} = data
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_SEX', sex)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        sessionStorage.clear()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  register({commit}, userInfo) {
    //console.log("register-start")
    //console.log(userInfo)
    return new Promise((resolve, reject) => {
      register(userInfo).then(response => {

        //console.log("register-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUncheckedList({commit}, query) {
    //console.log("getUncheckedList-start")
    //console.log(query)
    return new Promise((resolve, reject) => {
      getUncheckedList(query).then(response => {
        const {data} = response
        //console.log(response)
        //console.log("getUncheckedList-end")
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserList({commit}, query) {
    //console.log("getUserList-start")
    //console.log(query)
    return new Promise((resolve, reject) => {
      getUserList(query).then(response => {
        //console.log(response)
        //console.log("getUserList-end")
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUncheckedUser({commit}, user) {
    //console.log("updateUncheckedUser-start")
    //console.log(user)
    // 去掉用不上的password、username、registerDate项
    const {id, name, sex, birth, phone, card} = user
    return new Promise((resolve, reject) => {
      updateUncheckedUser({id: id, name: name, sex: sex, birth: birth, phone: phone, card: card}).then(response => {
        //console.log(response)
        //console.log("updateUncheckedUser-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUser({commit}, user) {
    //console.log("updateUser-start")
    //console.log(user)
    // 去掉用不上的几项
    const {id, name, sex, birth, phone, card, roles} = user
    return new Promise((resolve, reject) => {
      updateUser({id: id, name: name, sex: sex, birth: birth, phone: phone, card: card, roles: roles}).then(response => {
        //console.log(response)
        //console.log("updateUser-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteUncheckedUser({commit}, id) {
    //console.log("deleteUncheckedUser-start")
    //console.log(id)
    return new Promise((resolve, reject) => {
      deleteUncheckedUser({id: id}).then(response => {
        //console.log(response)
        //console.log("deleteUncheckedUser-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  deleteUser({commit}, id) {
    //console.log("deleteUser-start")
    //console.log(id)
    return new Promise((resolve, reject) => {
      deleteUser({id: id}).then(response => {
        //console.log(response)
        //console.log("deleteUser-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  passUncheckedUser({commit}, user) {
    //console.log("passUncheckedUser-start")
    //console.log(user)
    return new Promise((resolve, reject) => {
      passUncheckedUser(user).then(response => {
        //console.log(response)
        //console.log("passUncheckedUser-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updatePassword({commit}, data) {
    //console.log("updatePassword-start")
    //console.log(data)
    return new Promise((resolve, reject) => {
      updatePassword(data).then(response => {
        //console.log(response)
        //console.log("updatePassword-end")
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  upload({commit}, file) {
    //console.log("upload-start")
    //console.log(file)
    return new Promise((resolve, reject) => {
      upload(file).then(response => {
        const {data} = response
        //console.log(response)
        //console.log("upload-end")
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateUserAvatar({commit}, data) {
    //console.log("updateUserAvatar-start")
    //console.log(file)
    return new Promise((resolve, reject) => {
      updateUserAvatar(data).then(response => {
        //console.log(response)
        //console.log("updateUserAvatar-end")
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

