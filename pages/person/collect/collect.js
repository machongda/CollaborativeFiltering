// pages/person/reading/reading.js
const app = getApp()
const common = require("../../../module/common.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectBookList: [],
    haveCollect:false,
    activeNames: ['1'],
  },
  onChangeCollapse(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  delete(event) {
    var collectBookList = this.data.collectBookList;
    collectBookList.splice(event.currentTarget.dataset.index, 1);
    this.setData({
      collectBookList: collectBookList,
    });
    if (collectBookList.length==0){
      this.setData({
        haveCollect: false,
      });
    }
    wx.setStorageSync("collectBookList", collectBookList);
    common.Toast("取消收藏成功！");
  
  },
  onLoad: function (options) {
    var collectBookList;
    try {
      collectBookList = wx.getStorageSync('collectBookList')||[];
    } catch (e) {
      console.log(e)
      // Do something when catch error
    }

    if (collectBookList.length>0){

      this.setData(
        {
          collectBookList: collectBookList,
          haveCollect:true,
        }
      )
    }





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