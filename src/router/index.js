import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/market',
    component: Layout,
    redirect: '/market',
    children: [{
      path: 'market',
      name: 'Market',
      component: () => import('@/views/market/index'),
      meta: { title: '大盘指数', icon: 'market' }
    }]
  },

  {
    path: '/stock',
    component: Layout,
    redirect: '/stock/list',
    name:'Stock',
    meta: {
      title: '股票行情',
      icon: 'stock'
    },
    children: [
      {
        path: 'list',
        name: 'List',
        component: () => import('@/views/stock/list/index'),
        meta: { title: '股票列表', icon: 'list' }
      },
      {
        path: 'individual',
        name: 'Individual',
        component: () => import('@/views/stock/individual/index'),
        meta: { title: '个股详情', icon: 'individual' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

  {
    path: '/optional',
    component: Layout,
    redirect: '/optional',
    children: [{
      path: 'optional',
      name: 'Optional',
      component: () => import('@/views/optional/index'),
      meta: { title: '自选股票', roles: ['admin','user'], icon: 'optional' }
    }]
  },

  {
    path: '/trade',
    component: Layout,
    redirect: '/trade/trade',
    name: 'Trade',
    meta: {
      title: '委托交易',
      icon: 'trade1',
      roles: ['admin','user']
    },
    children: [
      {
        path: 'trade',
        name: 'TradePage',
        component: () => import('@/views/trade/trade/index'),
        meta: { title: '买卖交易', icon: 'trade2' }
      },
      {
        path: 'holdStock',
        name: 'HoldStock',
        component: () => import('@/views/trade/holdStock/index'),
        meta: { title: '持仓信息', icon: 'holdStock' }
      },
      {
        path: 'historyOrder',
        name: 'HistoryOrder',
        component: () => import('@/views/trade/historyOrder/index'),
        meta: { title: '历史查询', icon: 'historyOrder' }
      },
      {
        path: 'money',
        name: 'Money',
        component: () => import('@/views/trade/money/index'),
        meta: { title: '资金管理', icon: 'money' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/info',
    name: 'User',
    meta: {
      title: '个人中心',
      icon: 'user',
      roles: ['admin','user']
    },
    children: [
      {
        path: 'info',
        name: 'Info',
        component: () => import('@/views/user/info/index'),
        meta: { title: '个人中心', icon: 'info' }
      }
    ]
  },

  {
    path: '/administrate',
    component: Layout,
    redirect: '/administrate/check',
    name: 'Administrate',
    meta: {
      title: '管理中心',
      icon: 'administrate',
      roles: ['admin']
    },
    children: [
      {
        path: 'check',
        name: 'Check',
        component: () => import('@/views/administrate/check/index'),
        meta: { title: '用户审核', icon: 'checkUser' }
      },
      {
        path: 'manager',
        name: 'Manager',
        component: () => import('@/views/administrate/manager/index'),
        meta: { title: '用户管理', icon: 'manager' }
      }
    ]
  },

  {
    path: '/register',
    component: Layout,
    redirect: '/register',
    children: [{
      path: '',
      name: 'Register',
      component: () => import('@/views/register/index'),
      meta: { title: '注册账号', icon: 'register' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
