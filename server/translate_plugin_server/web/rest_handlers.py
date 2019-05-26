import tornado.escape
import tornado.web
from web import http_codes

import utils.translate

class MyTranslator(tornado.web.RequestHandler):
    async def post(self, *args, **kwargs):
        data = tornado.escape.json_decode(self.request.body)
        text = data.get('text', '')
        src = data.get('src', '')
        dst = data.get('dst', 'en')

        successful = True

        if not text:
            successful = False
        else:
            try:
                res = utils.translate(text, src, dst)
            except:
                res = 'The query is not recognized.'
                successful = False
        if successful:
            self.set_status(http_codes.ok)
        else:
            self.set_status(http_codes.bad_request)
        self.write({'res': res})
        self.finish()


