/*
    file name : timer.js
    description : timer object
	create date : 2017-07-26
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class'],
	function (Class) {
	'use strict';
    var timer = Class.extend({
        init: function (duration, startTime) {
            this.lastTime = startTime || 0;
            this.duration = duration;
        },
        isOver: function (time) {
            var over = false;
       
            if ((time - this.lastTime) > this.duration) {
                over = true;
                this.lastTime = time;
            }
            return over;
        }
	});

    return timer;
});
