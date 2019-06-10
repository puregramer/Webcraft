/*
    file name : updater.js
    description : updater object
	create date : 2017-08-02
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['class', 'timer', '$core', 'character', 'type'],
	function (Class, Timer, $core, Character, type) {
	'use strict';
    var updater = Class.extend({
        init: function () {
            this.playerAggroTimer = new Timer(1000);
        },
        update: function () {
            this.updateCharacters();
            this.updatePlayerAggro();
            this.updateTransitions();
            this.updateAnimations();
            
        },
        updateCharacters: function () {
            var self = this;
            $core.forEachEntity(function (entity) {
                var isCharacter = entity instanceof Character;
                if (entity.isLoaded) {
                    if (isCharacter) {
                        self.updateCharacter(entity);
                        $core.processCharacterUpdate(entity);
                        
                        
                        // all chracter die test
//                        $core.processDespawnEntity(entity);
                        
                        
                    }
                    self.updateEntityFading(entity);
                }
            });
            
        },
        updatePlayerAggro: function () {
            var t = $core.currentTime,
                player = $core.player;
            
            // Check player aggro every 1s when not moving nor attacking
            if (player && !player.isMoving() && !player.isAttacking() && this.playerAggroTimer.isOver(t)) {
                console.log('--> check PlayerAggro!');
                if (player.processCheckAggroCallBack) player.processCheckAggroCallBack();
            } 
            
            // reset aggro target -add by saltgamer
            this.resetAggroTarget(t, player);
            
        },
        updateCharacter: function (c) {
            var self = this,
                tick = Math.round(32 / Math.round((c.moveSpeed / (1000 / $core.renderer.FPS))));

            if(c.isMoving() && c.movement.inProgress === false) {
                if(c.orientation === type.Orientations.LEFT) {
                    c.movement.start($core.currentTime,
                                     function(x) {
                                        c.x = x;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.x = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.x - tick,
                                     c.x - 32,
                                     c.moveSpeed);
                } else if(c.orientation === type.Orientations.RIGHT) {
                    c.movement.start($core.currentTime,
                                     function(x) {
                                        c.x = x;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.x = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.x + tick,
                                     c.x + 32,
                                     c.moveSpeed);
                } else if(c.orientation === type.Orientations.UP) {
                    c.movement.start($core.currentTime,
                                     function(y) {
                                        c.y = y;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.y = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.y - tick,
                                     c.y - 32,
                                     c.moveSpeed);
                } else if(c.orientation === type.Orientations.DOWN) {
                    c.movement.start($core.currentTime,
                                     function(y) {
                                        c.y = y;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.y = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.y + tick,
                                     c.y + 32,
                                     c.moveSpeed);
                }
            } 
            
        },
        updateTransitions: function () {
            var self = this,
                m = null;

            $core.forEachEntity(function (entity) {
                m = entity.movement;
                if (m) {
                    if (m.inProgress) {
                        m.step($core.currentTime);
                    }
                }
            });
        },
        updateAnimations: function () {
            var t = $core.currentTime;
    
            $core.forEachEntity(function (entity) {
               var anim = entity.currentAnimation;
               if (anim) {
                   anim.update(t);
               }
            });
           
        },
        updateEntityFading: function (entity) {
            if (entity && entity.isFading) {
                var duration = 1000,
                    t = $core.currentTime,
                    dt = t - entity.startFadingTime;
            
                if (dt > duration) {
                    this.isFading = false;
                    entity.fadingAlpha = 1;
                } else {
                    entity.fadingAlpha = dt / duration;
                }
            }
        },
        resetAggroTarget: function (t, player) {
            
            if (player && player.resetAggroTimer) {
                if (player.resetAggroTimer.isOver(t) && player.attackers) {

                    var parseObject = Object.keys(player.attackers);
                    if (parseObject.length > 0 && !player.hasTarget()) {
                        console.log('- *** -> resetAggroTarget!');
                        player.forEachAttacker(function (attacker) {
                            // add by saltgamer 20171110 - go to spawn position
                            $core.makeCharacterGoTo(attacker, attacker.spawnPosition.x, attacker.spawnPosition.y, function () {
                                setTimeout(function () {
                                    attacker.unconfirmedTarget = null;
                                }, 1000);
                                
                            }); 
                            
                        });
                        player.removeResetAggroTimer();
                        player.setResetAggroTimer(10000);
                    }
                }
            }
        }
        
        
	});

    return updater;
});
