import Toast from '../miniprogram_npm/vant-weapp/toast/toast';
import Dialog from '../miniprogram_npm/vant-weapp/dialog/dialog';
async function request(url, data) {
  data = data ? data : {};
  // console.log("vis: " + url);
  return await new Promise((resolve, reject) => {
    wx.request({
     // url:"https://liuhuaqiang.cn/recommend/"+url,
      url: "http://127.0.0.1:8080/recommend/" + url,
      data,
      async success(res) {
        // console.log(res);
        // console.log(res.data);
        if (res.statusCode != 200) {
          //服务器发生未知错误,无法正常响应用户请求
          console.log(res);
          reject("服务器无法正常响应该请求，请稍后再试或者联系管理员,错误码:" + res.statusCode + "");
          return;
        }
        if (res.data.status == 'success') {
          resolve(res.data);
          return;
        }
        else{

          reject("网络连接异常或请求超时");
        }
    
      },
      fail(e) {
        reject("网络连接异常或请求超时");
      }
    });
  });
}


module.exports = {
  request,
  Toast,
  Dialog

}