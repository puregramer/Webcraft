/*
    file name : renderer.js
    description : renderer object
	create date : 2017-07-25
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class', '$alt', '$core', 'camera'],
	function (Class, $alt, $core, Camera) {
	'use strict';
     var renderer = Class.extend({
        init: function () {
            this.playCanvas = $alt.ce({
                tag: 'canvas',
                id: 'playCanvas',
                targetElement: $alt.qs('#gameScene')
            });
            $core.playCanvas = this.playCanvas;
            this.bgCanvas = $core.bgCanvas;
            this.context = (this.playCanvas && this.playCanvas.getContext) ? this.playCanvas.getContext("2d") : null;
            this.FPS = 50;
            this.tilesize = 32;
            this.lastTime = new Date();
            this.frameCount = 0;
            this.maxFPS = this.FPS;
            this.realFPS = 0;
            this.createCamera();
    	},
        createCamera: function() {
            this.camera = new Camera(this);
        
            this.playCanvas.width = this.camera.gridW * this.tilesize;
            this.playCanvas.height = this.camera.gridH * this.tilesize;
            console.log('--> set camera: ' + this.playCanvas.width + ' x ' + this.playCanvas.height);
            
        },
        renderFrame: function () {
            this.clearScreen(this.context);
            this.context.save();
            
            this.setCameraView(this.context);
            this.drawEntities();
            
            this.context.restore();
            
        },
        getWidth: function() {
            return this.playCanvas.width;
        },
    
        getHeight: function() {
            return this.playCanvas.height;
        },
        clearScreen: function (ctx) {
            ctx.clearRect(0, 0, this.playCanvas.width, this.playCanvas.height);
        },
        setCameraView: function (ctx) {
            ctx.translate(-this.camera.x, -this.camera.y);
        },
        initFont: function () {
            var fontsize = 15;
            this.setFontSize(fontsize);
        },
        setFontSize: function (size) {
            var font = size + "px GraphicPixel";
            this.context.font = font;
        },
        drawText: function (text, x, y, centered, color, strokeColor) {
            var ctx = this.context,
                strokeSize = 3;
            
            if (text && x && y) {
                ctx.save();
                if(centered) {
                    ctx.textAlign = "center";
                }
                ctx.strokeStyle = strokeColor || "#373737";
                ctx.lineWidth = strokeSize;
                ctx.strokeText(text, x, y);
                ctx.fillStyle = color || "white";
                ctx.fillText(text, x, y);
                ctx.restore();
            }
        },
        drawEntities: function () {
            var self = this;
            this.camera.forEachVisiblePosition(function(x, y) {
                if(!$core.map.isOutOfBounds(x, y)) {
                    if ($core.renderingGrid[y][x]) {
//                        console.log('--> x : ', x, ' / y : ', y);
                        
                        var parseObject = Object.keys($core.renderingGrid[y][x]);
//                        console.log('---> parseObject: ', parseObject);
                        if (parseObject.length > 0) {
                            for (var i = 0; i < parseObject.length; i++) {
                                self.drawEntity($core.renderingGrid[y][x][parseObject[i]]);
                            }    
                        }
                        
                    }
                }
            }, 0);
            
        },
        drawEntity: function (entity) {
            var sprite = entity.sprite,
                anim = entity.currentAnimation,
                os = 1,
                ds = 1;
        
            if (anim && sprite) {
                var	frame = anim.currentFrame,
                    s = 1,
                    x = frame.x * os,
                    y = frame.y * os,
                    w = sprite.width * os,
                    h = sprite.height * os,
                    ox = sprite.offsetX * s,
                    oy = sprite.offsetY * s,
                    dx = entity.x * s,
                    dy = entity.y * s,
                    dw = w * ds,
                    dh = h * ds;
            
                if (entity.isFading) {
                    this.context.save();
                    this.context.globalAlpha = entity.fadingAlpha;
                }
            
                this.context.save();
                if (entity.flipSpriteX) {
                    this.context.translate(dx + this.tilesize*s, dy);
                    this.context.scale(-1, 1);
                } else if (entity.flipSpriteY) {
                    this.context.translate(dx, dy + dh);
                    this.context.scale(1, -1);
                } else {
                    this.context.translate(dx, dy);
                }
            
                if (entity.isVisible()) {
                    this.context.drawImage(sprite.image, x, y, w, h, ox, oy, dw, dh);
                }
            
                this.context.restore();
            
                if(entity.isFading) {
                    this.context.restore();
                }
            }
        },
        
     
     });
    
    return renderer;
});
