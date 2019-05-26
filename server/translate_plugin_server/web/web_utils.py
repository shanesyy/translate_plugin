"""
    Functions to create the web application.
"""
import tornado.web

from . import rest_handlers


def get_handlers():
    """
        Returns the default handlers for the web application.

        :return: the list of handler tuples.
        :rtype: type list
    """
    return [
        (r'/translate_service', rest_handlers.MyTranslator),
    ]


def get_web_app():
    """
        Creates and returns the tornado web application with default settings.

        :return: the tornado web application.
        :rtype: type tornado.web.Application
    """
    handlers = get_handlers()
    return tornado.web.Application(handlers, xheaders=True)
