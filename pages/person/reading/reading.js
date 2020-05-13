// pages/person/reading/reading.js
const app = getApp()
const common = require("../../../module/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    readingBookList: [],
    readingRecordList: [],
    activeNames: ['1'],
  },
  onChangeCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  add() {
   wx.redirectTo({
     url: './addReadingRecord/addReadingRecord',
   })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    common.request("user/getReadingBookList", {
      uId: app.globalData.userInfo.openid,
    }).then((res) => {

      var readingBookList = res.data.readingBookList;
      for (var i of this.data.readingRecordList) {
        for (var j in readingBookList) {
          if (i.bid == readingBookList[j].bid)
            readingBookList[j].myscore = i.score;
        }
      }
      this.setData({
        readingBookList: readingBookList,
      });






    }, // 成功

      (err) => {
        console.log(err)
        wx.showModal({

          title: '警告',

          content: '抱歉，网络出错，请稍后再试!!!',

          showCancel: false,

          confirmText: '返回',

          success: function (res) {

            if (res.confirm) {
              wx.navigateBack({
                delta: 1

              })
            }

          }
        });
      } // 失败
    );

    common.request("user/getReadingRecordList", {
      uId: app.globalData.userInfo.openid,
    }).then((res) => {
      this.setData({
        readingRecordList: res.data.readingRecordList,
      });

    }, // 成功

      (err) => {
        console.log(err)
        wx.showModal({

          title: '警告',

          content: '抱歉，网络出错，请稍后再试!!!',

          showCancel: false,

          confirmText: '返回',

          success: function (res) {

            if (res.confirm) {
              wx.navigateBack({
                delta: 1

              })
            }

          }
        });
      } // 失败
    );







  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})