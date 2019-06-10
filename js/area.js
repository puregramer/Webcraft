/*
    file name : area.js
    description : area object
	create date : 2017-11-03
	creator : saltgamer
*/
define([],
	function () {
	'use strict';
    var area = Class.extend({
        init: function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        },
    
        contains: function (entity) {
            if (entity) {
                return entity.gridX >= this.x
                    && entity.gridY >= this.y
                    && entity.gridX < this.x + this.width
                    && entity.gridY < this.y + this.height;
            } else {
                return false;
            }
        }
    });
    return area;
});