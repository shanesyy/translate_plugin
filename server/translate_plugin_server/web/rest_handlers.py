import tornado.escape
import tornado.web
from web import http_codes
import sys
from hyper.http20.exceptions import StreamResetError
import utils.translate
import redis
import json

redis_client = redis.Redis(host='redis', port=6379, password=None)

class MyTranslator(tornado.web.RequestHandler):
    async def post(self, *args, **kwargs):
        print(self.request.body)

        data = tornado.escape.json_decode(self.request.body)
        print(data)
        text = data.get('text', '')
        src = data.get('src', '')
        dst = data.get('dst', 'en')
        successful = True
        res = ''
        if not text:
            successful = False
        else:
            key = 'text:{}, src:{}, dest:{}'.format(text, src, dst)
            res = redis_client.get(key)
            if not res:
                try:
                    res = utils.translate.get_translation(text, src, dst)
                except StreamResetError as e:
                    print(e)
                    res = utils.translate.get_translation(text, src, dst)
                except:
                    res = 'The query is not recognized.'
                    print(sys.exc_info()[0])
                    successful = False
                finally:
                    redis_client.set(key, json.dumps(res))
            else:
                print("Get from cache")
                res = json.loads(res.decode('ascii'))
        if successful:
            self.set_status(http_codes.ok)
        else:
            self.set_status(http_codes.bad_request)
        self.write({'res': res})
        self.finish()

    def set_default_headers(self):
        super(MyTranslator, self).set_default_headers()

        self.set_header('Access-Control-Allow-Origin', '*')
        self.set_header('Access-Control-Allow-Methods', 'POST')
        self.set_header('Access-Control-Allow-Headers', 'x-requested-with')

        self.set_header('Content-Type', 'application/json')


