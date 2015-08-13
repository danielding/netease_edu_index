var EDU = EDU || {};
(function(EDU){
    EDU.Util = {};
    var Cookie = {
        get : function (name) {
            var encodedName = encodeURIComponent(name) + '=',
                start = document.cookie.indexOf(encodedName),
                cookieValue = null;

            if (start > -1) {
                var end = document.cookie.indexOf(';', start);
                if (end === -1) { end = document.cookie.length; }
                cookieValue = decodeURIComponent(document.cookie.substring(start + encodedName.length, end));
            }

            return cookieValue;
        },
        set : function (name, value, expires, path, domain, secure) {
            var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

            if (expires instanceof Date) {
                cookieText += '; expires=' + expires.toGMTString();
            }
            if (path) {
                cookieText += '; path=' + path;
            }
            if (domain) {
                cookieText += '; domain=' + domain;
            }
            if (secure) {
                cookieText += '; secure';
            }

            document.cookie = cookieText;
        },
        unset : function (name, path, domain, secure) {
            this.set(name, '', new Date(0), path, domain, secure);
        }
    }
    EDU.Util.Cookie = Cookie;

    var DOM = {
        getElementsByClassName: function (root, className) {
          // 特性侦测
          if (root.getElementsByClassName) {
            // 优先使用 W3C 规范接口
            return root.getElementsByClassName(className);
          } else {
            // 获取所有后代节点
            var elements = root.getElementsByTagName('*');
            var result = [];
            var element = null;
            var classNameStr = null;
            var flag = null;

            className = className.split(' ');

            // 选择包含 class 的元素
            for (var i = 0, element; element = elements[i]; i++) {
              classNameStr = ' ' + element.getAttribute('class') + ' ';
              flag = true;
              for (var j = 0, name; name = className[j]; j++) {
                if (classNameStr.indexOf(' ' + name + ' ') === -1) {
                  flag = false;
                  break;
                }
              }
              if (flag) {
                result.push(element);
              }
            }
            return result;
          }
        }
    }
    EDU.Util.DOM = DOM;

    var Event = {
        addHandler: function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, handler);
            } else {
                element['on' + type] = handler;
            }
        },
        removeHandler: function(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler);
            } else if (element.detachEvent) {
                element.detachEvent('on' + type, handler);
            } else {
                element['on' + type] = handler;
            }
        },
        getEvent: function() {
            return event ? event : window.event;
        },
        getTarget: function(event) {
            return event.target || event.srcEvent;
        }
    }
    EDU.Util.Event = Event;

    var Ajax = {
        requestData: function(obj) {
            var url = obj.url,
                type = obj.requestType || 'get',
                callback = obj.callback || function() {},
                asyn = obj.asyn || true;

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status <=300) || xhr.status == 304) {
                        callback(JSON.parse(xhr.responseText));
                    } else {
                        console.error('failed:' + xhr.status);
                    }
                }
            };
            xhr.open(type, url, asyn);
            xhr.send(null);
        },
        getRequestData: function(url, callback) {
            this.requestData({
                url: url,
                requestType: 'get',
                callback: callback
            });
        },
        postRequestData: function(url, callback) {
            this.requestData({
                url: url,
                requestType: 'post',
                callback: callback
            });
        }
    };
    EDU.Util.Ajax = Ajax;
})(EDU);