/*
    file name : camera.js
    description : camera object
	create date : 2017-07-25
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class', '$core'],
	function (Class, $core) {
	'use strict';
     var camera = Class.extend({
        init: function (renderer) {
            this.renderer = renderer;
            this.x = 0;
            this.y = 0;
            this.gridX = 0;
            this.gridY = 0;
            this.offset = 0.5;
            this.gridW = $core.mapTileCol;
            this.gridH = $core.mapTileRow;
    	},
        setPosition: function (x, y) {
            this.x = x;
            this.y = y;
    
            this.gridX = Math.floor(x / 32);
            this.gridY = Math.floor(y / 32);
        },
        setGridPosition: function (x, y) {
            this.gridX = x;
            this.gridY = y;
        
            this.x = this.gridX * 32;
            this.y = this.gridY * 32;
        },
        forEachVisiblePosition: function (callback, extra) {
            var extra = extra || 0;
            for (var y = this.gridY - extra, maxY = this.gridY + this.gridH + (extra * 2); y < maxY; y += 1) {
                for(var x = this.gridX - extra, maxX = this.gridX + this.gridW + (extra * 2); x < maxX; x += 1) {
                    callback(x, y);
                }
            }
        },
        isVisible: function (entity) {
            return this.isVisiblePosition(entity.gridX, entity.gridY);
        },
        isVisiblePosition: function (x, y) {
            if(y >= this.gridY && y < this.gridY + this.gridH && x >= this.gridX && x < this.gridX + this.gridW) {
                return true;
            } else {
                return false;
            }
        },
        focusEntity: function (entity) {
            var w = this.gridW - 2,
                h = this.gridH - 2,
                x = Math.floor((entity.gridX - 1) / w) * w,
                y = Math.floor((entity.gridY - 1) / h) * h;

            this.setGridPosition(x, y);
        }
      
      
        
         
     
     });
    
    return camera;
});