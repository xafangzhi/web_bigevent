// 注意每次调用$.get(),$.post() 和$.ajax()请求的时候，
// 会先调用ajaxPrefilter()这个函数
// 在这个函数中，我们可以拿到ajax()的配置对象
$.ajaxPrefilter(function(options) {
    // 发起真正的ajax请求之前，统一拼接根目录
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    // 统一为有权限的接口，设置 headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
      options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载complete回调函数
  options.complete = function (res) {
    // console.log('执行了回调函数')
            // console.log(res)
            // 在complete回调函数中，可以用res.responseJSON拿到响应到的数据
            if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
              // 1.强制清空token
              localStorage.removeItem('token')
              // 2.强制跳转链接到登录页
              location.href = '/login.html'
          }

  }
})
