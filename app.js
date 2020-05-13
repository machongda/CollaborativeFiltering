//app.js
const common = require("/module/common.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    
    //查看是否授权
   
  },
  globalData: {
    userInfo: null,
    isLogin:false,
    //记录从其他页面回来时，有需要刷新的页面
    refreshFlags:[false,false,false,false,false],

  }
})