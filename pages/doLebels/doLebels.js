// pages/doLebels.js

const app = getApp()
const common = require("../../module/common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: [],
    literature: ["小说", "外国文学", "文学", "经典", "中国文学", "随笔", "日本文学", "散文", "村上春树", "诗歌", "童话", "名著", "儿童文学", "古典文学", "余华", "王小波", "杂文", "当代文学", "张爱玲", "外国名著", "钱钟书", "鲁迅", "诗词", "茨威格", "米兰·昆德拉", "杜拉斯", "港台"],

    popular: ["漫画", "推理", "绘本", "青春", "东野圭吾", "悬疑", "科幻", "言情", "推理小说", "奇幻", "武侠", "日本漫画", "耽美", "韩寒", "网络小说", "三毛", "科幻小说", "亦舒", "阿加莎·克里斯蒂", "金庸", "安妮宝贝", "穿越", "郭敬明", "轻小说", "魔幻", "青春文学", "几米", "J.K.罗琳", "幾米", "张小娴", "古龙", "校园", "高木直子", "沧月", "余秋雨", "落落"],
    culture: ["历史", "心理学", "哲学", "社会学", "传记", "文化", "艺术", "社会", "政治", "设计", "宗教", "政治学", "建筑", "电影", "数学", "中国历史", "回忆录", "思想", "国学", "人物传记", "艺术史", "人文", "音乐", "绘画", "戏剧", "西方哲学", "近代史", "二战", "军事", "佛教", "考古", "自由主义", "美术"],
    life: ["爱情", "成长", "生活", "旅行", "心理", "女性", "励志", "摄影", "教育", "职场", "美食", "游记", "灵修", "健康", "情感", "人际关系", "两性", "手工", "养生", "家居", "自助游"],
    manage: ["经济学", "管理", "经济", "商业", "金融", "投资", "营销", "理财", "创业", "股票", "广告", "企业史", "策划"],
    technology: ["科普", "互联网", "编程", "科学", "交互设计", "用户体验", "算法", "科技", "web", "交互", "通信", "UE", "神经网络", "UCD", "程序"],
    literatureFlag: [],
    popularFlag: [],
    cultureFlag: [],
    lifeFlag: [],
    manageFlag: [],
    technologyFlag: [],

  },
  onChange(event) {
    console.log(event.detail);
    this.setData({
      activeNames: event.detail
    });
  },
  addSelect(event) {
    this.setData({
      [event.currentTarget.dataset.name + 'Flag' + '[' + event.currentTarget.dataset.index + ']']: !this.data[event.currentTarget.dataset.name + 'Flag'][event.currentTarget.dataset.index]
    });


  },
  next() {
    var lebels = [];
    for (var i in this.data.literatureFlag) {

      if (this.data.literatureFlag[i] == true)
        lebels.push(this.data.literature[i]);
    }



    for (var i in this.data.popularFlag) {

      if (this.data.popularFlag[i] == true)
        lebels.push(this.data.popular[i]);
    }
    for (var i in this.data.cultureFlag) {

      if (this.data.cultureFlag[i] == true)
        lebels.push(this.data.culture[i]);
    }
    for (var i in this.data.lifeFlag) {

      if (this.data.lifeFlag[i] == true)
        lebels.push(this.data.life[i]);
    }

    for (var i in this.data.manageFlag) {

      if (this.data.manageFlag[i] == true)
        lebels.push(this.data.manage[i]);
    }

    for (var i in this.data.technologyFlag) {
      if (this.data.technologyFlag[i] == true)
        lebels.push(this.data.technology[i]);
    }
    console.log(lebels);
    if (lebels.length == 0) {
      common.Toast('你还没有标记兴趣标签，请标记后再下一步！');
      return;
    }
    else {

      var lebelsString = "";
      for (var i = 0; i < lebels.length - 1; i++)
        lebelsString += lebels[i] + ",";
    
      lebelsString += lebels[lebels.length - 1];
      if (lebelsString.length>150){
        wx.showModal({

          title: '警告',

          content: '标签过多，请减少几个!!!',

          showCancel: false,

          confirmText: '确认',

          success: function (res) {
          }

        });
   return;
      }

      common.Toast.loading({
        mask: true,
        message: '添加用户标签中...',
        duration: 2
      });

      common.request("user/updateUserLebels", {
        lebels: lebelsString,
        uId: app.globalData.userInfo.openid
      }).then((res) => {

        try {
          const userInfo = wx.getStorageSync('userInfo') || {};
          userInfo.lebels = lebelsString;
          app.globalData.userInfo.lebels = lebelsString;
          wx.setStorage({
            key: "userInfo",
            data: userInfo,
            success: function () {
              wx.redirectTo({
                url: '/pages/doBooks/doBooks'
              })



            }


          })
        } catch (e) {
          console.log(e)
          // Do something when catch error
        }

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


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for (var i in this.data.literature)
      this.data.literatureFlag.push(false);

    for (var i in this.data.popular)
      this.data.popularFlag.push(false);

    for (var i in this.data.culture)
      this.data.cultureFlag.push(false);

    for (var i in this.data.life)
      this.data.lifeFlag.push(false);

    for (var i in this.data.manage)
      this.data.manageFlag.push(false);

    for (var i in this.data.technology)
      this.data.technologyFlag.push(false);






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