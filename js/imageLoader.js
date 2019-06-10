/*
    file name : imageLoader.js
    description : imageLoader ui object
	create date : 2017-07-21
	creator : saltgamer
*/
define([],
	function () {
	'use strict';
    var imageLoader = {
        resourceCache: {},
        loading: [],
        readyCallbacks: [],
        load : function (urlOrArr) {
			if (urlOrArr instanceof Array) {
				for (var i = 0; i < urlOrArr.length; i++) {
					this.createResource(urlOrArr[i]);
				}
			} else {
				this.createResource(urlOrArr);
			}
		},
        isReady : function () {
			var ready = true;
			for (var k in this.resourceCache) {
				if (this.resourceCache.hasOwnProperty(k) && !this.resourceCache[k]) {
					ready = false;
				}
			}
			return ready;
		},
        createResource : function (url) {
			var self = this;
			console.log('-> url : ', url);

			if (this.resourceCache[url]) {
				return this.resourceCache[url];
			} else {
				var img = new Image();
				img.onload = function () {
					self.resourceCache[url] = img;
					if (self.isReady()) {
						self.readyCallbacks.forEach(function (func) {
							func();
						});
					}
				};
				this.resourceCache[url] = false;
				img.src = url;
			}
		},
        get : function (url) {
			console.log('-> resource get : ', url);
			return this.resourceCache[url];
		},
		onReady : function (func) {
			this.readyCallbacks.push(func);
		}
    };

    return imageLoader;
});
