const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  sex: state => state.user.sex,
  roles: state => state.user.roles,
  stockName: state => state.stock.stockName,
  stockCode1: state => state.stock.stockCode1,
  stockCode2: state => state.stock.stockCode2,
  indexCode1: state => state.stock.indexCode1,
  indexCode2: state => state.stock.indexCode2,
  introduction: state => state.user.introduction,
  permission_routes: state => state.permission.routes
}
export default getters
