//index.js
//获取应用实例
const app = getApp()
const common = require("../../module/common.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bookList: [],
    recommendBookList: [],
    isLogin: false,
  },
  detail(event) {
    console.log(event.currentTarget.dataset.bId);
    wx.navigateTo({
      url: '/pages/detail/detail?bId=' + event.currentTarget.dataset.bId,
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },
  change() {

    if (this.data.recommendBookList.length == 0) {
      this.getRecommendBook();
      return;
    }
    else {
      common.Toast.loading({
        mask: true,
        message: '稍后，正在生成推荐列表...',
        duration: 0
      });
      var bookList = [];
      for (var i = 0; i < 10 && this.data.recommendBookList.length > 0; i++) {
        bookList.push(this.data.recommendBookList.pop());
      }

      this.setData({
        bookList: bookList,
      })

      common.Toast.clear();
    }
  },


  onLoad: function (options) {
    var that = this;
    //查看是否授权

    common.request("user/getMessage", {
    }).then((res) => {

      var message;
      try {
        message = wx.getStorageSync('message');
      } catch (e) {
        console.log(e)
        // Do something when catch error
      }
      if (message) {
        if (message.messageDate!= res.data.message.messageDate) {
          common.Dialog.alert({
            title: '通知',
            message: res.data.message.content,
          }).then(() => {
            // on close
          });

          wx.setStorage({
            key: "message",
            data: res.data.message,
          })
        }
       
      }
      else {
        wx.setStorage({
          key: "message",
          data: res.data.message,
        })
        common.Dialog.alert({
          title: '通知',
          message: res.data.message.content,
        }).then(() => {
          // on close
        });
      }
      
  }, // 成功

      (err) => {
    wx.showModal({
      title: '警告',
      content: '抱歉，网络出错，请稍后再试!!!',

      showCancel: false,

      confirmText: '确认',

      success: function (res) {
      }

    });
  } // 失败
);


wx.getSetting({
  success: function (res) {
    if (res.authSetting['scope.userInfo']) {
      console.log("用户授权了");
      var userInfo;
      try {
        userInfo = wx.getStorageSync('userInfo');
      } catch (e) {
        console.log(e)
        // Do something when catch error
      }
      if (userInfo) {
        app.globalData.userInfo = userInfo;
        app.globalData.isLogin = true;

        that.setData({
          isLogin: true,
        })

        var recommendBookList;
        try {
          recommendBookList = wx.getStorageSync('recommendBookList');
        } catch (e) {
          console.log(e)
          // Do something when catch error
        }
        if (recommendBookList) {
          var bookList = [];
          that.data.recommendBookList = recommendBookList;
          for (var i = 0; i < 10 && that.data.recommendBookList.length > 0; i++) {
            bookList.push(that.data.recommendBookList.pop());
          }
          that.setData({
            bookList: bookList,
          })

        }
        else {

        }
      }
      else {
        wx.navigateTo({
          url: '/pages/login/login'
        })
      }


    } else {
      //用户没有授权
      console.log("用户没有授权");
      common.Dialog.confirm({
        title: '提示',
        message: '这是一个基于协同过滤算法为用户推荐书籍的小程序，你点击确认后，将会用微信登录并记录你的阅读记录从而为你推荐你可能感兴趣的书籍，如果你取消，你也可以在搜索页面搜索你感兴趣的书籍！',
      })
        .then(() => {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/login/login',
            })
            common.Dialog.close();
          }, 10);
        })
        .catch(() => {
          common.Dialog.close();
        });


     
     


    }

  }

});

  },
getRecommendBook() {
  var refresh = app.globalData.refreshFlags[0];
  app.globalData.refreshFlags[0] = false;
  var lebels = app.globalData.userInfo.lebels;
  common.request("user/getReadingRecordListCount", {
     uId: app.globalData.userInfo.openid
  }).then((res) => {

    if (res.data.readingRecordListCount<5){
      common.Toast.loading({
        mask: true,
        message: '你的阅读记录少于5条，我们已根据你的兴趣标签为你推荐，想要获得更好的推荐，请添加更多的阅读记录！',
        duration: 0
      });
      common.request("book/getRecommendBook", {
        lebels: lebels,
        // uId: app.globalData.userInfo.openid
      }).then((res) => {
        wx.setStorage({
          key: "recommendBookList",
          data: res.data.recommendBookResult,
          success: function () {
          }
        })
        this.data.recommendBookList = res.data.recommendBookResult;
        var bookList = [];
        for (var i = 0; i < 10 && this.data.recommendBookList.length > 0; i++) {
          bookList.push(this.data.recommendBookList.pop());
        }
        this.setData({
          bookList: bookList,
        })
        common.Toast.clear();
        console.log(bookList);
      }, // 成功

        (err) => {
          console.log(err)
          common.Toast.clear();
          wx.showModal({
            title: '警告',
            content: '抱歉，网络出错，请稍后再试!!!',
            showCancel: false,
            confirmText: '确认',
            success: function (res) {
            }

          });
        } // 失败
      );
    }
    else{
      common.Toast.loading({
        mask: true,
        message: '请稍后，正在为你推荐,推荐过程可能持续25-40s，请耐心等待！',
        duration: 0
      });
      common.request("user/getRecommendBook", {
       uId: app.globalData.userInfo.openid,
        refresh: refresh,
      }).then((res) => {

        if(res.data.show){
          common.Toast.clear();
          common.Dialog.alert({
            title: '提示',
            message: res.data.showMessage,
          }).then(() => {
            // on close
          });
        

        }
        wx.setStorage({
          key: "recommendBookList",
          data: res.data.recommendBookResult,
          success: function () {
          }
        })
        this.data.recommendBookList = res.data.recommendBookResult;
        var bookList = [];
        for (var i = 0; i < 10 && this.data.recommendBookList.length > 0; i++) {
          bookList.push(this.data.recommendBookList.pop());
        }
        this.setData({
          bookList: bookList,
        })

        common.Toast.clear();
        console.log(bookList);
      }, // 成功

        (err) => {
          console.log(err)
          common.Toast.clear();
          wx.showModal({

            title: '警告',

            content: '抱歉，网络出错，请稍后再试!!!',

            showCancel: false,

            confirmText: '确认',

            success: function (res) {
            }

          });
        } // 失败
      );

    }

  }, // 成功

    (err) => {
      console.log(err)
      common.Toast.clear();
      wx.showModal({

        title: '警告',

        content: '抱歉，网络出错，请稍后再试!!!',

        showCancel: false,

        confirmText: '确认',

        success: function (res) {
        }

      });
    } // 失败
  );
},
onShow() {
  //查看是否授权

  if (app.globalData.isLogin && app.globalData.refreshFlags[0]) {
    this.getRecommendBook();
  }
  if (app.globalData.isLogin && app.globalData.refreshFlags[1]) {



    common.request("user/getReadingRecordListCount", {
      uId: app.globalData.userInfo.openid
    }).then((res) => {

      if (res.data.readingRecordListCount < 5) {
        common.Dialog.alert({
          title: '提示',
          message: "检测到你添加了新的阅读记录，但是你的阅读记录仍少于5条，当你的阅读记录大于5条时系统会询问为你是否重新推荐",
        }).then(() => {
          // on close
        });
       app.globalData.refreshFlags[1]=false;
        return;
      }
      else {
        common.Dialog.confirm({
          title: '提示',
          message: '检测到你添加了新的阅读记录，点击确认将重新计算推荐结果！',
        })
          .then(() => {
            setTimeout(() => {
              app.globalData.refreshFlags[0]=true;
              this.getRecommendBook();
              common.Dialog.close();
            }, 10);
          })
          .catch(() => {
            common.Dialog.close();
          });
    

      }

    }, // 成功

      (err) => {
        console.log(err)
      } // 失败
    );


  
   
  }
  if (app.globalData.isLogin != this.data.isLogin) {
    this.setData({
      isLogin: app.globalData.isLogin,
    })
  }

}

})
