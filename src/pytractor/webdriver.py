# Copyright 2014 Konrad Podloucky
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""
Selenium webdrivers with added angular.js awareness.
"""

from selenium import webdriver as selenium_webdriver
from selenium.webdriver import Android, BlackBerry, Chrome, Edge, Firefox, Ie, Opera, PhantomJS, Remote, Safari, \
    WebKitGTK
from selenium.webdriver.remote.webdriver import WebDriver

from .mixins import WebDriverMixin


class Android(WebDriverMixin, Android):
    pass


class BlackBerry(WebDriverMixin, BlackBerry):
    pass


class Chrome(WebDriverMixin, Chrome):
    pass


class Edge(WebDriverMixin, Edge):
    pass


class Firefox(WebDriverMixin, Firefox):
    pass


class Ie(WebDriverMixin, Ie):
    pass


class Opera(WebDriverMixin, Opera):
    pass


class PhantomJS(WebDriverMixin, PhantomJS):
    pass


class Remote(WebDriverMixin, Remote):
    pass


class Safari(WebDriverMixin, Safari):
    pass


class WebKitGTK(WebDriverMixin, WebKitGTK):
    pass


__all__ = ['Android',
           'BlackBerry',
           'Chrome',
           'Edge',
           'Firefox',
           'Ie',
           'Opera',
           'PhantomJS',
           'Remote',
           'Safari',
           'WebKitGTK']
