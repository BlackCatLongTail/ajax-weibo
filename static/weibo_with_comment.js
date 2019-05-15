var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiweiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
// weibo DOM
    var w = `
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-content">${weibo.content}</span>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>

            <input id='id-input-comment'>
            <button class="comment-add" id='id-button-add-comment'>发表评论</button>
            <div class="comment-list-${weibo.id}">
            </div>
            </br>
        </div>
    `
    return w
}


var weiboUpdateTemplate = function(content) {
// weibo DOM
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${content}">
            <button class="weibo-update">更新微博</button>
        </div>
    `
    return t
}

var insertUpdateFormWeibo = function(content, weiboCell) {
    var updateForm = weiboUpdateTemplate(content)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}


var insertWeibo = function(weibo) {
    // 先插入 weibo-cell 到 weibo-list 中
    var weiboCell = weiboTemplate(weibo)
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
    // 找到weibo_id对应的weiboCell
    var commentList= document.querySelector(`.comment-list-${weibo.id}`)
    log('commentList', commentList)

    weibo_id = weibo.id
    apiCommentAll(weibo_id, function(r) {
        // 解析为 数组
        var comments = JSON.parse(r)
        console.log('load all comment', comments)
        // 循环添加到页面中
        for(var i = 0; i < comments.length; i++) {
            var comment = comments[i]
            insertComment(commentList, comment)
        }
    })


}


var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    // weibos = api_weibo_all()
    // process_weibos(weibos)
    apiWeiboAll(function(r) {
        console.log('load all', r)
        // 解析为 数组
        var weibos = JSON.parse(r)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            var weibo = weibos[i]
            insertWeibo(weibo)
        }
    })
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    // 注意, 第二个参数可以直接给出定义函数
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        input.value = null   // 获取值后，清空输入的内容
        apiWeiboAdd(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(r)
            insertWeibo(weibo)
        })
    })
}

var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        var weiboCell = self.parentElement
        weiboId = weiboCell.dataset['id']
        apiWeiboDelete(weiboId, function(response) {
            var r = JSON.parse(response)
            log('apiweiboDelete', r.message)
            // 删除 self 的父节点
            weiboCell.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-cell')
        // weiboId = weiboCell.dataset['id']
        var weiboSpan = weiboCell.querySelector('.weibo-content')
        var content = weiboSpan.innerText
        // 插入编辑输入框
        insertUpdateFormWeibo(content, weiboCell)
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    // 我们可以通过 event.target 来得到被点击的对象
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // 来判断元素是否是我们想要的
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('update weibo id', weiboId)
        input = weiboCell.querySelector('.weibo-update-input')
        content = input.value
        var form = {
            id: weiboId,
            content: content,
        }

        apiweiboUpdate(form, function(r) {
            // 收到返回的数据, 插入到页面中
            var weibo = JSON.parse(r)
            log('apiweiboUpdate', weibo)

            var weiboSpan = weiboCell.querySelector('.weibo-content')
            weiboSpan.innerText = weibo.content

            var updateForm = weiboCell.querySelector('.weibo-update-form')
            updateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()

}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()