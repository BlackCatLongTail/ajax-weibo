var apiCommentAll = function(weibo_id, callback) {
    var path = `/api/comment/all?id=${weibo_id}`
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/comment/delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentUpdate = function(form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}


var commentTemplate = function(comment) {
// comment DOM
    var c = `
        <div class="comment-cell" data-id="${comment.id}">
            <span class="comment-content">${comment.content}</span>
            <button class="comment-delete">删除评论</button>
            <button class="comment-edit">编辑评论</button>
        </div>
    `
    return c
}

var commentUpdateTemplate = function(content) {
// comment DOM
    var c = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新评论</button>
        </div>
    `
    return c
}


var insertComment = function(commentList, comment) {
    var commentCell = commentTemplate(comment)
    // 在comment-list中插入 comment-cell
    commentList.insertAdjacentHTML('beforeend', commentCell)
}

var insertUpdateFormComment = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    // 注意, 第二个参数可以直接给出定义函数
    weiboList.addEventListener('click', function(event) {
        // 添加评论也要进行事件委托。
        // 需要判断点击到的按钮是否为'添加评论'按钮
        var self = event.target
        log('被点击的元素', self)
        log('self.classList', self.classList)
        if (self.classList.contains('comment-add')) {
            log('点到了添加评论按钮')
            var weiboCell = self.parentElement
            var input = weiboCell.querySelector('#id-input-comment')
            var content = input.value
            log('click add', content)
            input.value = null   // 获取值后，清空输入的内容
            var weibo_id = weiboCell.dataset['id']
            var commentList = weiboCell.querySelector(`.comment-list-${weibo_id}`)
            var form = {
                weibo_id: weibo_id,
                content: content
            }

            apiCommentAdd(form, function(r) {
                // 收到返回的数据, 插入到页面中
                var comment = JSON.parse(r)
                insertComment(commentList, comment)
            })
        }

        else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentDelete = function() {
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
        if (self.classList.contains('comment-delete')) {
            log('点到了删除评论按钮')
            commentCell = self.parentElement
            commentId = commentCell.dataset['id']
            apiCommentDelete(commentId, function(response) {
                var r = JSON.parse(response)
                log('apiCommentDelete', r.message)
                // 删除 self 的父节点
                commentCell.remove()
            })
        }
        else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentEdit = function() {
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
        if (self.classList.contains('comment-edit')) {
            log('点到了编辑按钮')
            commentCell = self.closest('.comment-cell')
            // weiboId = weiboCell.dataset['id']
            var commentSpan = commentCell.querySelector('.comment-content')
            var content = commentSpan.innerText
            // 插入编辑输入框
            insertUpdateFormComment(content, commentCell)
        }
        else {
            log('点到了 weibo cell')
        }
    })
}

var bindEventCommentUpdate = function() {
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
        if (self.classList.contains('comment-update')) {
            log('点到了更新按钮')
            var commentCell = self.closest('.comment-cell')
            var commentId = commentCell.dataset['id']
            log('update comment id', commentId)
            var commentUpdateForm = commentCell.querySelector('.comment-update-form')
            var input = commentUpdateForm.querySelector('.comment-update-input')
            var content = input.value
            var form = {
                id: commentId,
                content: content,
            }

            apiCommentUpdate(form, function(r) {
                // 收到返回的数据, 插入到页面中
                var comment = JSON.parse(r)
                log('apicommentUpdate', comment)

                var commentSpan = commentCell.querySelector('.comment-content')
                commentSpan.innerText = comment.content

                commentUpdateForm.remove()
            })
        }
        else {
            log('点到了 weibo cell')
        }
    })
}

var bindEvents = function() {
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentEdit()
    bindEventCommentUpdate()

}

var __main = function() {
    bindEvents()
}

__main()