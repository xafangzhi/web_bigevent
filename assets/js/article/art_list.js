$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
      const dt = new Date(date)
      var y = dt.getFullYear()
      var m = padZero(dt.getMonth() + 1)
      var d = padZero(dt.getDate())

      var hh = padZero(dt.getHours())
      var mm = padZero(dt.getMinutes())
      var ss = padZero(dt.getSeconds())
      return y + '-' + m + '-' + d + '' + hh + ':' + mm + ':' + ss 
    }

      // 时间补零
      function padZero() {
        return n > 9 ? n : '0' + n
      }

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
      }
 
    
    initTable()
    initCate() 
  
    // 获取文章列表数据的方法
    function initTable() {
      $.ajax({
        method: 'GET',
        url: '/my/article/list',
        data: q,
        success: function(res) {
          if (res.status !== 0) {
            return layer.msg('获取文章列表失败！')
          }
          // 使用模板引擎渲染页面的数据
          var htmlStr = template('tpl-table', res)
          $('tbody').html(htmlStr)
          // 调用渲染分页的方法
          renderPage(res.total)
        }
      })
    }
    // 调用模板引擎获取列表分类
    function initCate() {
      $.ajax({
        method: 'GET',
        url: '/my/article/cates',
        success: function(res) {
          if(res.status !== 0) {
            return layer.msg('获取列表失败！')
          }
          // 调用模板引擎渲染数据
          var htmlStr = template('tpl-cate', res)
          $('[name=cate_id]').html(htmlStr)
          form.render()
        }
      })
    }
   // 为筛选表单绑定 submit 事件
   $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })
  // 定义渲染数据的方法
  function renderPage(total) {
   laypage.render({
    elem: 'pageBox',
    count: total,
    limit: q.pagesize,
    limits: q.pagenum,
    layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
    limits: [2 , 3, 5, 10],
    // 分页发生切换时，触发jump回调
    jump: function(obj, first) {
      console.log(first)
      // 把最新的页码值，赋值给q这个查询参数中
      q.pagenum = obj.curr
      //把最新的条目数赋值给q
      q. pagesize = obj.limit
      if(!first) {
        initTable()
      }

    }

   })

  }
  // 通过代理的形式为删除按钮绑定点击事件
  $('tbody').on('click', 'btn-delete', function() {
    // 拿到删除按钮的个数
    var len = $('.btn-delete').length
    // 确认删除提示框
    ayer.confirm(' 确认删除?', {icon: 3, title:'提示'}, function(index){
      var id = $(this).attr('data-id')
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function(res) {
          if(res.status !== 0) {

            return layer.msg ('删除数据失败！')
          }
          layer.msg ('删除数据成功！')

          if(len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index);
    });

  })
})