from routes import (
    GuaTemplate,
    html_response,
    login_required,
)
from utils import log


def index(request):
    """
    weibo 首页的路由函数
    """
    # 替换模板文件中的标记字符串
    body = GuaTemplate.render('weibo_api_index.html')
    return html_response(body)


def route_dict():
    """
    路由字典
    key 是路由(路由就是 path)
    value 是路由处理函数(就是响应)
    """
    d = {
        '/weibo/index': login_required(index),
    }
    return d
