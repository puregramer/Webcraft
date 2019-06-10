/*
    file name : sprite.js
    description : sprite object
	create date : 2017-07-21
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class', 'imageLoader', 'animation'],
	function (Class, imageLoader, Animation) {
	'use strict';
    var sprite = Class.extend({
		init : function (spriteData) {
			this.name = spriteData.name;
			this.isLoaded = false;
			this.filePath = spriteData.filePath;
			this.id = spriteData.id;
			this.animationData = spriteData.animations;
			this.width = spriteData.width;
			this.height = spriteData.height;
			this.offsetX = (spriteData.offset_x !== undefined) ? spriteData.offset_x : -24;
			this.offsetY = (spriteData.offset_y !== undefined) ? spriteData.offset_y : -24;


			// console.log('> this.filePath : ', this.filePath);
			this.load();
		},
		load: function () {
            
			this.image = imageLoader.get(this.filePath);
//            console.log('-> sprite.image: ', this.image);
            this.isLoaded = true;
            
           this.createHurtSprite();
		},
        createAnimations: function () {
            var animations = {};
        
            for(var name in this.animationData) {
                var a = this.animationData[name];
                animations[name] = new Animation(name, a.length, a.row, this.width, this.height);
            }
    	    return animations;
        },
        createHurtSprite: function() {
    	    var canvas = document.createElement('canvas'),
    	        ctx = canvas.getContext('2d'),
    	        width = this.image.width,
    		    height = this.image.height,
    	        spriteData, data;
            
    	    canvas.width = width;
    	    canvas.height = height;
    	    ctx.drawImage(this.image, 0, 0, width, height);
            
    	    try {
        	    spriteData = ctx.getImageData(0, 0, width, height);
                
        	    data = spriteData.data;
                
//                console.log('-spriteData: ', spriteData);

        	    for (var i=0; i < data.length; i += 4) {
        	        data[i] = 255;
        	        data[i+1] = data[i+2] = 75;
        	    }
//        	    spriteData.data = data;
//                console.log('-spriteData.data: ', spriteData.data);
        	    ctx.putImageData(spriteData, 0, 0);

        	    this.whiteSprite = { 
                    image: canvas,
            	    isLoaded: true,
            	    offsetX: this.offsetX,
            	    offsetY: this.offsetY,
            	    width: this.width,
            	    height: this.height
            	};
                
//                console.log('-whiteSprite: ', this.whiteSprite);
    	    } catch(e) {
    	        console.log('[!] Error getting image data for sprite : ' + this.name + ' / error: ' + e);
    	    }
        },
        getHurtSprite: function() {
            return this.whiteSprite;
        }
        

	});

    return sprite;
});
