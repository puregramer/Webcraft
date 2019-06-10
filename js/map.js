/*
    file name: map.js
    description: map object
	create date: 2017-10-23
	creator: saltgamer
*/
define(['class', '$alt', 'imageLoader'],
	function (Class, $alt, imageLoader) {
	'use strict';
    var map = Class.extend({
        init: function (params) {
            console.log('-> init map...');
            this.canvas = $alt.ce({
                tag: 'canvas',
                id: 'bgCanvas',
                targetElement: $alt.qs('#gameScene')
            });
            this.ctx = (this.canvas && this.canvas.getContext) ? this.canvas.getContext('2d') : null;
            this.mapTileCol = params.mapTileCol;
            this.mapTileRow = params.mapTileRow;
            this.tileWidth = params.tileWidth;
            this.tileHeight = params.tileHeight;
            this.mapWidth = params.mapTileCol * params.tileWidth;
            this.mapHeight = params.mapTileRow * params.tileHeight;
            this.canvas.width = this.mapWidth;
            this.canvas.height = this.mapHeight;
            this.spriteSheetLoaded = false;
            this.tileList = [[]];
            this.spriteSheet = imageLoader.get('./images/mapSprite.png');
            this.callBack = params.callBack;  
            
        },
        create: function (mapData) {
            for (var x = 0; x < this.mapTileCol; x++) {
				this.tileList[x] = [];
              
                for (var y = 0; y < this.mapTileRow; y++) {
                    
                    if (mapData.length > 0) {
                        this.tileList[x][y] = mapData[x][y];
                    } else {
                        // create random map
                        if (Math.random() > 0.75) {
                            var rnd = Math.random() * 6;
                            this.tileList[x][y] = parseInt(rnd.toFixed(0));
                        } else {
                            this.tileList[x][y] = 0;	
                        } 
                    }
                    
                    // this.tileList[x][y] = 0;	
				}
                
                
			}
            this.draw();
        },
        draw: function () {
            console.log('-> spriteSheetLoaded : ', this.spriteSheetLoaded);
			if (!this.spriteSheetLoaded) {
                alert('[!] spriteSheet not loaded!');
                return;
            }
			this.spriteIndex = 0;
			this.ctx.fillStyle = '#ccc';
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			
            for (var x = 0; x < this.mapTileCol; x++) {
				for (var y = 0; y < this.mapTileRow; y++) {
					this.spriteIndex = this.tileList[x][y];
					this.ctx.drawImage(this.spriteSheet, this.spriteIndex * this.tileWidth, 0, 
					this.tileWidth, this.tileHeight, x * this.tileWidth, y * this.tileHeight, 
					this.tileWidth, this.tileHeight);
				}	
			}
            
            if (this.callBack) this.callBack();
            
		},
        isOutOfBounds: function (x, y) {
            return $alt.isInt(x) && $alt.isInt(y) && (x < 0 || x >= this.mapTileCol || y < 0 || y >= this.mapTileRow);
        },
        isColliding: function (x, y) { 
            if(this.isOutOfBounds(x, y) || !this.tileList) {
                return false;
            }
            return (this.tileList[y][x] === 1);
        },
        
    });

    return map;
});
