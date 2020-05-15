//index.js
//获取应用实例
const app = getApp()
const common = require("../../module/common.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    openid: "",
    session_key: "",
    isLogin: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  onLoad: function(options) {
    var that = this;
    wx.login({
      success: function(res) {
        if (res.code) {
          common.request("login/getOpenId", {
            code: res.code
          }).then((res) => {
            console.log(res);
              if (res.data.isLogin == false) {
                that.setData({
                  openid: res.data.api.openid,
                  session_key: res.data.api.session_key,
                  isLogin: false
                })
                console.log(res.data);
              } else {
                that.setData({
                  openid: res.data.api.openid,
                  session_key: res.data.api.session_key,
                  isLogin: true,
                  userInfo: res.data.userEntity,
                })
               
              }
            }, // 成功

            (err) => {
              console.log(err)
              wx.showModal({
                title: '警告',
                content: '抱歉，网络出错，请稍后再试!!!',

                showCancel: false,

                confirmText: '确认',

                success: function(res) {
                }

              });
            } // 失败
          );
          
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

  },

  bindGetUserInfo: function(res) {
    common.Toast.loading({
      mask: true,
      message: '请稍后，正在注册...',
      duration: 0
    });
    var that = this;
    setTimeout(function () {
      if (res.detail.userInfo) {
        //用户按了允许授权按钮
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(res.detail.userInfo);

        if (that.data.isLogin) {
          that.data.userInfo.gender = that.data.userInfo.sex;
          that.data.userInfo.nickName = that.data.userInfo.nickname;
          that.data.userInfo.openid = that.data.userInfo.uid;
          app.globalData.isLogin = true;
          app.globalData.userInfo = that.data.userInfo;
          wx.setStorage({
            key: "userInfo",
            data: that.data.userInfo,
            success: function () {
            }
          })

          app.globalData.refreshFlags[0] = true;
          wx.showToast({
            title: '使用微信登录成功!!!',
            icon: "success",
            duration: 1000, //显示时长 
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false        
            success: function () {
              wx.switchTab({
                url: '/pages/index/index'
              })


            }, //接口调用成功
            fail: function () {


            }, //接口调用失败的回调函数  



          });



        } else {
          
          var userInfo;
          userInfo = res.detail.userInfo;
          userInfo.isLogin = that.data.isLogin;
          userInfo.openid = that.data.openid;
          userInfo.session_key = that.data.session_key;
          userInfo.lebels = "文学,名著,历史,国学,古典文学";
          if (userInfo.gender == 1)
            userInfo.gender = "男";
          else if (userInfo.gender == 2)
            userInfo.gender = "女";
          else
            userInfo.gender = "未知";
          wx.setStorage({
            key: "userInfo",
            data: userInfo,
            success: function () {
            }
          })

          common.request("login/registered", {
            uId: userInfo.openid,
            imagePath: userInfo.avatarUrl,
            nickname: userInfo.nickName,
            sex: userInfo.gender,
            password: "wechatuser",
            lebels: userInfo.lebels,

          }).then((res) => {
            app.globalData.refreshFlags[0] = true;
            app.globalData.userInfo = userInfo;
            app.globalData.isLogin = true;
            wx.setStorage({
              key: "userInfo",
              data: userInfo,
              success: function () {
              }
            })
            app.globalData.refreshFlags[0] = true;
            console.log(res.data);
            wx.showToast({
              title: '使用微信登录成功!!!',
              icon: "success",
              duration: 1000, //显示时长 
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false        
              success: function () {
                wx.redirectTo({
                  url: '../doLebels/doLebels'
                })


              }, //接口调用成功
              fail: function () {


              }, //接口调用失败的回调函数  

            });
          }, // 成功

            (err) => {
              console.log(err)
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
      } else {

        //用户按了拒绝按钮

        wx.showModal({

          title: '警告',

          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',

          showCancel: false,

          confirmText: '返回授权',

          success: function (res) {

            // 用户没有授权成功，不需要改变 isHide 的值

            if (res.confirm) {

              console.log('用户点击了“返回授权”');

            }

          }

        });

      }

      

     }, 2000);   //1秒后执行

    setTimeout(function () { 
      common.Toast.clear();
    }, 2500);   //1秒后执行
    // if (res.detail.userInfo) {
    //   //用户按了允许授权按钮
    //   // 获取到用户的信息了，打印到控制台上看下
    //   console.log("用户的信息如下：");
    //   console.log(res.detail.userInfo);
      
    //   if (that.data.isLogin) {
    //     that.data.userInfo.gender = that.data.userInfo.sex;
    //     that.data.userInfo.nickName = that.data.userInfo.nickname;
    //     that.data.userInfo.openid = that.data.userInfo.uid;
    //     app.globalData.isLogin = true;
    //     app.globalData.userInfo = that.data.userInfo;
    //     wx.setStorage({
    //       key: "userInfo",
    //       data: that.data.userInfo,
    //       success: function () {
    //       }
    //     })

    //     app.globalData.refreshFlags[0] = true;
    //     wx.showToast({
    //       title: '使用微信登录成功!!!',
    //       icon: "success",
    //       duration: 1000, //显示时长 
    //       mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false        
    //       success: function () {
    //         wx.switchTab({
    //           url: '/pages/index/index'
    //         })


    //       }, //接口调用成功
    //       fail: function () {


    //       }, //接口调用失败的回调函数  



    //     });



    //   }else{
    //     var userInfo;
    //     userInfo = res.detail.userInfo;
    //     userInfo.isLogin = that.data.isLogin;
    //     userInfo.openid = that.data.openid;
    //     userInfo.session_key = that.data.session_key;
    //     userInfo.lebels = ['文学', '名著', '历史', '国学', '古典文学'];
    //     if (userInfo.gender == 1)
    //       userInfo.gender = "男";
    //     else if (userInfo.gender == 2)
    //       userInfo.gender = "女";
    //     else
    //       userInfo.gender = "未知";
    //     wx.setStorage({
    //       key: "userInfo",
    //       data: userInfo,
    //       success: function () {
    //       }
    //     })
       
    //     common.request("login/registered", {
    //       uId: userInfo.openid,
    //       imagePath: userInfo.avatarUrl,
    //       nickname: userInfo.nickName,
    //       sex: userInfo.gender,
    //       password: "wechatuser",
    //       lebels: userInfo.lebels,

    //     }).then((res) => {
    //       app.globalData.userInfo = userInfo;
    //       app.globalData.isLogin = true;
    //       wx.setStorage({
    //         key: "userInfo",
    //         data: userInfo,
    //         success: function () {
    //         }
    //       })
    //       console.log(res.data);
    //       wx.showToast({
    //         title: '使用微信登录成功!!!',
    //         icon: "success",
    //         duration: 1000, //显示时长 
    //         mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false        
    //         success: function () {
    //           wx.redirectTo({
    //             url: '../doLebels/doLebels'
    //           })


    //         }, //接口调用成功
    //         fail: function () {


    //         }, //接口调用失败的回调函数  

    //       });
    //     }, // 成功

    //       (err) => {
    //         console.log(err)
    //         wx.showModal({
    //           title: '警告',
    //           content: '抱歉，网络出错，请稍后再试!!!',
    //           showCancel: false,
    //           confirmText: '确认',
    //           success: function (res) {
    //           }
    //         });
    //       } // 失败
    //     );
    //   }
    // } else {

    //   //用户按了拒绝按钮

    //   wx.showModal({

    //     title: '警告',

    //     content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',

    //     showCancel: false,

    //     confirmText: '返回授权',

    //     success: function(res) {

    //       // 用户没有授权成功，不需要改变 isHide 的值

    //       if (res.confirm) {
    //         console.log('用户点击了“返回授权”');
    //       }

    //     }

    //   });

    // }

  }










})