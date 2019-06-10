/*
    file name : entity.js
    description : entity object
	create date : 2017-07-24
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class', 'type'],
	function (Class, type) {
	'use strict';
     var entity = Class.extend({
        init: function (id, kind) {
    	    var self = this;
	    
            this.id = id;
            this.kind = kind;

            // Renderer
    		this.sprite = null;
    		this.flipSpriteX = false;
        	this.flipSpriteY = false;
    		this.animations = null;
    		this.currentAnimation = null;
            this.shadowOffsetY = 0;
		
    		// Position
    		this.setGridPosition(0, 0);
		
            // Modes
            this.isLoaded = false;
            this.visible = true;
            this.isFading = true;
            
            this.spawnPosition = {
                x: 0, y: 0  
            };
            
    	},
        setName: function (name) {
    		this.name = name;
    	},
        setGridPosition: function (x, y) {
    		this.gridX = x;
    		this.gridY = y;
		
    		this.setPosition(x * 32, y * 32);
    	},
        setPosition: function (x, y) {
    		this.x = x;
    		this.y = y;
    	},
        setSprite: function (sprite) {
    	    if (!sprite) {
                console.error('--> ' + this.id + ' : sprite is null', true);
    	        throw "Error";
    	    }
	    
    	    if (this.sprite && this.sprite.name === sprite.name) {
    	        return;
    	    }

    	    this.sprite = sprite;
            this.normalSprite = this.sprite;
            
            this.hurtSprite = sprite.getHurtSprite();
    		this.animations = sprite.createAnimations();
		
    		this.isLoaded = true;

    	},
        getSprite: function () {
    	    return this.sprite;
    	},
        getAnimationByName: function (name) {
            var animation = null;
//            console.log('--------------> animations : ', this.animations, name);
            if(name in this.animations) {
                animation = this.animations[name];
            } else {
                console.error('--> No animation called: ' + name);
            }
            return animation;
        },
        setAnimation: function (name, speed, count, onEndCount) {
    	    var self = this;
	    
            if (this.isLoaded) {
    		    if (this.currentAnimation && this.currentAnimation.name === name) {
    		        return;
    		    }
		    
    		    var s = this.sprite,
                    a = this.getAnimationByName(name);
		
    			if (a) {
    				this.currentAnimation = a;
    				if(name.substr(0, 3) === "atk") {
    				    this.currentAnimation.reset();
    				}
    				this.currentAnimation.setSpeed(speed);
    				this.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
    				    self.idle();
    				});
    			}
    		} else {
                console.error('--> ' + this.id + ' Not ready for animation!');
    		}
    	},
        getDistanceToEntity: function (entity) {
            var distX = Math.abs(entity.gridX - this.gridX),
                distY = Math.abs(entity.gridY - this.gridY);

            return (distX > distY) ? distX : distY;
        },
        isAdjacent: function (entity) {
            var adjacent = false;
        
            if (entity) {
                adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
            }
            return adjacent;
        },
        isAdjacentNonDiagonal: function (entity) {
            var result = false;

            if (this.isAdjacent(entity) && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)) {
                result = true;
            }
        
            return result;
        },
        isDiagonallyAdjacent: function (entity) {
            return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
        },
        fadeIn: function (currentTime) {
            this.isFading = true;
            this.startFadingTime = currentTime;
        },
        blink: function (speed, callback) {
            var self = this;
            this.blinking = setInterval(function() {
                self.toggleVisibility();
            }, speed);
        },
        stopBlinking: function() {
            if(this.blinking) {
                clearInterval(this.blinking);
            }
            this.setVisible(true);
        },
        setVisible: function (value) {
            this.visible = value;
        },
        isVisible: function () {
            return this.visible;
        },
        forEachAdjacentNonDiagonalPosition: function (callback) {
            callback(this.gridX - 1, this.gridY, type.Orientations.LEFT);
            callback(this.gridX, this.gridY - 1, type.Orientations.UP);
            callback(this.gridX + 1, this.gridY, type.Orientations.RIGHT);
            callback(this.gridX, this.gridY + 1, type.Orientations.DOWN);
            
        }
    
     
     });
    
    return entity;
});