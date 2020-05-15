// pages/doBooks/doBooks.js
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
const common = require("../../module/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    readingRecordList: new Set(),
    searchBookResult: [],
    activeNames: ['1'],
    show: false,
    bookName: "书籍名称",
    rateValue: 3,
    message: "",
    maskFlag: [],
    bId: 0,
    index: 0,
  },
  onChangeRate(event) {
    this.setData({
      rateValue: event.detail,
    });
  },
  onClickShow() {
    console.log("shoe");
    this.setData({ show: true });
  },
end(){
  wx.switchTab({
    url: '/pages/index/index'
  })


}
,
  onClickHide() {
    this.setData({ show: false });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },
  mark(event) {
    console.log(event.currentTarget.dataset.index);
    this.setData({
      show: true,
      bookName: this.data.searchBookResult[event.currentTarget.dataset.index].name,
      bId: this.data.searchBookResult[event.currentTarget.dataset.index].bid,
      index: event.currentTarget.dataset.index
    });
  },
  markConfirm() {
    common.Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    common.request("user/addReadingRecord", {
      uId: app.globalData.userInfo.openid,
      bId: this.data.bId,
      score: this.data.rateValue * 2,
      // uId: app.globalData.userInfo.openid

    }).then((res) => {
      this.data.readingRecordList.add(this.data.bId);
      this.setData({
        ['maskFlag[' + this.data.index + ']']: true,
      });
      app.globalData.refreshFlags[0] = true;
      common.Toast.clear();
      common.Toast("标记已读成功！");
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
  onChangeCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onSearch() {
    this.onClick();
  },

  clear() {
    this.setData({
      value: "",
      searchBookResult: []
    });
  },


  onClick() {


   


    if (this.data.value == "")
      return;
    common.Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    common.request("book/searchBook", {
      search: this.data.value,

      // uId: app.globalData.userInfo.openid

    }).then((res) => {

      console.log(res.data.searchBookResult);
      var searchBookResult = [];
      for (var i in res.data.searchBookResult) {
        if (this.data.readingRecordList.has(res.data.searchBookResult[i].bid))
          this.setData({
            ['maskFlag[' + i + ']']: true,
          });
      }
      var maskFlag = [];
      for (var i = 0; i < 50; i++) {
        maskFlag[i] = false;
      }
      this.setData({
        maskFlag: maskFlag,
      });

      if (res.data.searchBookResult.length == 0) {
        common.Toast.clear();
        common.Dialog.alert({
          title: '提示',
          message: "未找到书籍，请更换关键词后重试！",
        }).then(() => {
          // on close
        });
        return;
      }
      this.setData({
        searchBookResult: res.data.searchBookResult,
      });
      common.Toast.clear();

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

            // 用户没有授权成功，不需要改变 isHide 的值

            if (res.confirm) {
              // wx.navigateBack({
              //   delta: 1

              // })
            }

          }

        });
      } // 失败
    );



    console.log('搜索' + this.data.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var maskFlag = [];
    for (var i = 0; i < 50; i++) {
      maskFlag.push(false);
    }
    this.setData({
      maskFlag: maskFlag,
    });
    common.Dialog.alert({
      title: '提示',
      message: "这是你首次标记阅读记录,系统推荐你标记五本以上你阅读过的书籍，这样系统就能根据你的阅读记录为你推荐你可能感兴趣的书籍！",
    }).then(() => {
      // on close
    });
    common.request("user/getReadingRecordList", {
      uId: app.globalData.userInfo.openid,

      // uId: app.globalData.userInfo.openid

    }).then((res) => {


      var readingRecordList = new Set();
      for (var i of res.data.readingRecordList) {
        readingRecordList.add(i.bid);
      }

      this.setData({
        readingRecordList: readingRecordList,
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

            // 用户没有授权成功，不需要改变 isHide 的值

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