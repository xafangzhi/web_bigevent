$(function () {
    var form = layui.form
    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '昵称的长度必须在1-6个字符之间！'
            }
        }
    })
    inituserInfo()
    // 初始化用户的基本信息
    function  inituserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                console.log(res)
                // 调用form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单的数据
    $('#btnReset').on('click', function(e) {
        // 阻止表单的默认重置
        e.preventDefault()
        inituserInfo()
    })
    // 更新表单用户信息
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        // 发起ajax()请求
        $.ajax({
            method:'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新信息失败')
                }
                layer.msg('更新信息成功！')
                // 调用父页面的方法，重新渲染用户的信息和头像
                window.parent.getUserInfo()
            }

        })

    })

})