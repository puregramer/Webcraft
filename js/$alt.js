/*
    file name: $alt.js
    description: custom javascript library $alt object
	create date: 2017-10-23
	creator: saltgamer
	version: 0.0
*/

'use strict';

var $alt = $alt || {};
$alt = (function () {
    var salt = {
        qs: function (selector) {
            return document.querySelector(selector);
        },
        qsa: function (selector) {
            return document.querySelectorAll(selector);
        },
        ce: function (params) {
            var newElement = document.createElement(params.tag);

            if (params.id) newElement.setAttribute('id', params.id);
            if (params.class) newElement.className = params.class;
            if (params.src) newElement.src = params.src;
            if (params.html) newElement.innerHTML = params.html;
            // console.log('$> targetElement : ', params.targetElement);

            params.targetElement.appendChild(newElement);
            if (params.callBack) params.callBack();
            return newElement;
        },
        cn: function (params) {
            var newTextNode = document.createTextNode(params.text);
            params.targetElement.appendChild(newTextNode);
            if (params.callBack) params.callBack();
            return newTextNode;
        },
        cuttingString: function (limit, string) {
            if (string.length > limit) {
                string = string.substring(0, limit) + '...';
            }
            return string;
        },
        getURLParameter: function (sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&');

            for (var i = 0; i < sURLVariables.length; i++) {
                var sParameterName = sURLVariables[i].split('=');
                if (sParameterName[0] == sParam) {
                    return sParameterName[1];
                }
            }
        },
        initRequestAnimationFrame: function () {

            // handle multiple browsers for requestAnimationFrame()
            window.requestAFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    // if all else fails, use setTimeout
                    function (callback) {
                        return window.setTimeout(callback, 1000 / 60); // shoot for 60 fps
                    };
            })();
            // handle multiple browsers for cancelAnimationFrame()
            window.cancelAFrame = (function () {
                return window.cancelAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.mozCancelAnimationFrame ||
                    window.oCancelAnimationFrame ||
                    function (id) {
                        window.clearTimeout(id);
                    };
            })();
            console.log('$> init requestAnimationFrame : ', window.requestAFrame);
        },
        initLocalStorage: function (params) {
            try {
                var localStorageObj = window.localStorage.getItem(params.localStorageName);
                if (!localStorageObj) {
                    var tempObj = {};
                    tempObj[params.localStorageName] = [];
                    window.localStorage.setItem(params.localStorageName, JSON.stringify(tempObj));
                }

            } catch (e) {
                console.log(e);
            }
        },
        removeLocalStorage: function (params) {
            try {
                var localStorageObj = window.localStorage.getItem(params.localStorageName);
                if (!localStorageObj) window.localStorage.removeItem(params.localStorageName);
            } catch (e) {
                console.log(e);
            }
        },
        insertLocalStorageData: function (params) {
            try {
                var localStorageObj = JSON.parse(window.localStorage.getItem(params.localStorageName));
                localStorageObj[params.localStorageName].push({
                    uid: params.uid,
                    frameType: params.frameType,
                    page: params.page,
                    // left: params.left / parent.ZOOMVALUE,
                    // top: params.top / parent.ZOOMVALUE
                });
                window.localStorage.setItem("dataLink", JSON.stringify(localStorageObj));
            } catch (e) {
                console.log(e);
            }
        },
        openWindowByparam: function (params) {
            // use sample code
            // var params = {
            // 	url: 'http://www.google.com',
            // 	winOptions: 'toolbar=no,scrollbars=no,resizable=no,top=500,left=500,width=1024,height=630'
            // };

            var newWindow = window.open(params.url, '_blank', params.winOptions);
        },
        generateUID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now();
                ; //use high-precision timer if available
            }
            var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uid;
        },
        getTimeZoneDate: function () {
            var d = new Date();
            d = d.toISOString();
            d = d.split('.');
            return d[0] + 'Z';

        },
        detect: {
            regexCheck: function (regexString) {
                return (regexString).test(navigator.userAgent);
            },
            isWindows: function () {
                return this.regexCheck(/(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i);
            },
            isWinRT: function () {
                return this.regexCheck(/(windows)\snt\s6\.2;\s(arm)/i);
            },
            isWin10: function () {
                return this.regexCheck(/(edge)\/((\d+)?[\w\.]+)/i);
            },
            isiOS: function () {
                return this.regexCheck(/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i);
            },
            isMac: function () {
                return this.regexCheck(/(macintosh|mac(?=_powerpc)\s)/i);
            },
            isAndroid: function () {
                return this.regexCheck(/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i);
            },
            isLinux: function () {
                return this.regexCheck(/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?([\w\.-]+)*/i);
            },
            getPlatform: function () {
                var platform;
                if (this.isWindows()) {
                    platform = 'WIN';
                }
                if (this.isWin10()) {
                    platform = 'WIN10';
                }
                if (this.isWinRT()) {
                    platform = 'RT';
                }
                if (this.isiOS()) {
                    platform = 'IOS';
                }
                if (this.isMac()) {
                    platform = 'MAC';
                }
                if (this.isAndroid()) {
                    platform = 'ANDROID';
                }
                if (this.isLinux()) {
                    platform = 'LINUX';
                }
                return platform;
            }
        },
        toDateTimeString: function (oDate) {
            oDate = oDate instanceof Date ? oDate : this.parseDate(oDate);
            var h = oDate.getHours(),
                m = oDate.getMinutes(),
                s = oDate.getSeconds();
            return this.toDateString(oDate) + " " + (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
            ;
        },
        isInt: function (n) {
            return (n % 1) === 0;
        }

    };

    return salt;

})();
