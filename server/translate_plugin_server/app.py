import os
import os.path

import tornado.web
import tornado.ioloop
import tornado.httpserver

import web.web_utils

def main(port):
    app = web.web_utils.get_web_app()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(port)
   
    tornado.ioloop.IOLoop.current().start()

if __name__ == '__main__':
    print("start the service")
    main(port=12000)