// 注意每次调用$.get(),$.post() 和$.ajax()请求的时候，
// 会先调用ajaxPrefilter()这个函数
// 在这个函数中，我们可以拿到ajax()的配置对象
$.ajaxPrefilter(function(options) {

    // 发起真正的ajax请求之前，统一拼接根目录
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    console.log(options.url)
})
