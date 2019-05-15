from utils import log
from routes import json_response, current_user
from models.comment import Comment
from models.weibo import Weibo


def index(request):
    weibo_id = int(request.query['id'])
    w = Weibo.find_by(id=weibo_id)
    log('api_comment_w', w)
    cs = w.comments()
    # 注意这里返回的不是cs对象，而是cs的数据，所以要进行转换。
    log('api_comment_cs', cs)
    cs = [c.json() for c in cs]
    return json_response(cs)


def add(request):
    form = request.json()
    # 创建一个 comment
    u = current_user(request)
    c = Comment(form)
    c.user_id = u.id
    c.save()
    # 把创建好的 comment 返回给浏览器
    return json_response(c.json())


def delete(request):
    comment_id = int(request.query['id'])
    Comment.delete(comment_id)
    d = dict(
        message="成功删除comment_id"
    )
    return json_response(d)


def update(request):
    form = request.json()
    log('api comment update form', form)
    c = Comment.update(form)
    return json_response(c.json())


def route_dict():
    d = {
        '/api/comment/all': index,
        '/api/comment/add': add,
        '/api/comment/delete': delete,
        '/api/comment/update': update,
    }
    return d
