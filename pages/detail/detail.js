// pages/detail/detail.js
const common = require("../../module/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {

    book: {},
    comment: [],
    activeNames: ['1'],

  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },


  previewImg: function (e) {
    var that = this;
    wx.previewImage({
      current: that.data.book.coverPath,     //当前图片地址
      urls: [that.data.book.coverPath],               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
      collect: false,
    })
  },

copy(event){
  wx.setClipboardData({
    data: event.currentTarget.dataset.text,
    success(res) {
      wx.getClipboardData({
        success(res) {
          console.log(res.data) // data
        }
      })
    }
  })
} ,
  /**
   * 生命周期函数--监听页面加载
   */
  collect() {
    if (this.data.collect) {

      this.setData({
        collect: false
      })
      var collectBookList;
      try {
        collectBookList = wx.getStorageSync('collectBookList') || [];
      } catch (e) {
        console.log(e)
        // Do something when catch error
      }
    
      for (var i in collectBookList) {
        if (collectBookList[i].bid == this.data.book.bid) {
          collectBookList.splice(i,1);
          break;
        }
      }
      wx.setStorageSync('collectBookList', collectBookList);


      common.Toast("取消收藏成功！");

    }
    else {

      var collectBookList;
      try {
        collectBookList = wx.getStorageSync('collectBookList') || [];
      } catch (e) {
        console.log(e)
        // Do something when catch error
      }
      collectBookList.unshift(this.data.book);
      wx.setStorageSync('collectBookList', collectBookList);
      this.setData({
        collect: true
      })
      common.Toast("收藏成功！");

    }




  },

  onLoad: function (options) {
    console.log(options.bId);
    var collectBookList;
    try {
      collectBookList = wx.getStorageSync('collectBookList') || [];
    } catch (e) {
      console.log(e)
      // Do something when catch error
    }

    for (var i of collectBookList) {

      if (i.bid == options.bId) {
        this.setData({
          collect: true
        })
        break;
      }
    }

    common.request("book/getBook", {
      bId: options.bId
    }).then((res) => {

      this.setData({
        book: res.data.book,
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


    common.request("book/getComment", {
      bId: options.bId,
    }).then((res) => {
      this.setData({
        comment: res.data.comment,
      });

    }, // 成功

    )





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