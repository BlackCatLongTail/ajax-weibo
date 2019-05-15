from utils import log
from routes import json_response, current_user
from models.weibo import Weibo


def all(request):
    weibos = Weibo.all_json()
    return json_response(weibos)


def add(request):
    form = request.json()
    u = current_user(request)
    w = Weibo(form)
    w.user_id = u.id
    w.save()
    # 把创建好的 weibo 返回给浏览器
    return json_response(w.json())


def delete(request):
    weibo_id = int(request.query['id'])
    weibo = Weibo.find_by(id=weibo_id)
    weibo.delete_weibo_comment()
    d = dict(
        message="成功删除 weibo"
    )

    return json_response(d)


def update(request):
    form = request.json()
    log('api weibo update form', form)
    w = Weibo.update(form)
    return json_response(w.json())


def route_dict():
    d = {
        '/api/weibo/all': all,
        '/api/weibo/add': add,
        '/api/weibo/delete': delete,
        '/api/weibo/update': update,
    }
    return d

