/*
    file name : $core.js
    description : core object
	create date : 2017-10-24
	creator : saltgamer
*/
define(['player', 'character', 'monster', 'type', 'formula'],
	function (Player, Character, Monster, type, formula) {
	'use strict';
    var core = {
        gameStarted: false,
        gamePause: false,
        
        map: null,
        bgCanvas: null,
        playCanvas: null,
        pathFinder: null,
        renderer: null,
        player: null,
        updater: null,
        mapTileCol: null, 
        mapTileRow: null,
        entities: {},
        deathpositions: {},
        previousClickPosition: {},
        
        entityGrid: null,
        initEntityGrid: function () {
            this.entityGrid = [];
            for(var i=0; i < this.map.mapTileRow; i += 1) {
                this.entityGrid[i] = [];
                for(var j=0; j < this.map.mapTileCol; j += 1) {
                    this.entityGrid[i][j] = {};
                }
            }
            console.log('--> Initialized the entity grid: ', this.entityGrid);
        },
        pathingGrid: null,
        initPathingGrid: function () {
            this.pathingGrid = [];
            for (var i = 0; i < this.map.mapTileRow; i += 1) {
                this.pathingGrid[i] = [];
                for (var j = 0; j < this.map.mapTileCol; j += 1) {
                    this.pathingGrid[i][j] = this.map.tileList[i][j];
                }
            }
            console.log('--> Initialized the pathing grid with static colliding cells.');
        },
        renderingGrid: null,
        initRenderingGrid: function () {
            this.renderingGrid = [];
            for(var i=0; i < this.map.mapTileRow; i += 1) {
                this.renderingGrid[i] = [];
                for(var j=0; j < this.map.mapTileCol; j += 1) {
                    this.renderingGrid[i][j] = {};
                }
            }
            console.log('--> Initialized the rendering grid: ', this.renderingGrid);
        },
        getEntityById: function (id) {
            if (id in this.entities) {
                return this.entities[id];
            } else {
                console.log('[!] Unknown entity id: ' + id);
            }
        },
        entityIdExists: function (id) {
            return id in this.entities;
        },
        addEntity: function (entity) {
            if (this.entities[entity.id] === undefined) {
                this.entities[entity.id] = entity;
                this.registerEntityPosition(entity);
            } else {
                console.error('--> This entity already exists : ' + entity.id + ' (' + entity.kind + ')');
            }
        },
        removeEntity: function (entity) {
            if (entity.id in this.entities) {
                this.unregisterEntityPosition(entity);
                delete this.entities[entity.id];
            } else {
                console.log('- Cannot remove entity. Unknown ID : ' + entity.id);
            }
        },
        createAttackLink: function (attacker, target) {
            if (attacker.hasTarget()) {
                attacker.removeTarget();
            }
            attacker.engage(target);
            
             if (attacker.id !== this.playerId) {
                target.addAttacker(attacker);
             } 
      
               
        },
       
        resetCamera: function() {
            this.renderer.camera.focusEntity(this.player);
        },
        
        tick: function () {
//            console.log('-> tick!');
            this.currentTime = new Date().getTime();
            if (this.gameStarted) {
                this.updater.update();
                this.renderer.renderFrame();
            }
            if (!this.gamePause) {
                window.requestAFrame(this.tick.bind(this));
            }
            
        },
        pause: function () {
            console.log('--> pause game!');
            this.gamePause = true;
        },
        forEachEntity: function (callBack) {
            var self = this,
                parseObject = Object.keys(self.entities);
            if (parseObject.length > 0) {
                parseObject.forEach(function (value, idx) {
                    var entity = self.entities[value];
                    callBack(entity);
                });
            } else {
                console.log('[!] entities is empty!');
            }
            
        },
        forEachMob: function (callBack) {
            var self = this,
                parseObject = Object.keys(self.entities);
            if (parseObject.length > 0) {
                parseObject.forEach(function (value, idx) {
                    var entity = self.entities[value];
                    if (entity instanceof Monster) {
                        callBack(entity);
                    }
                    
                });
            } else {
                console.log('[!] entities is empty!');
            }
        },
        addToRenderingGrid: function (entity, x, y) {
           if (!this.map.isOutOfBounds(x, y)) {
                this.renderingGrid[y][x][entity.id] = entity;
           }
        },
        
        
        //========== process start =================================================================================
        processCharacterUpdate: function (character) {
            var time = this.currentTime;
            
            // If mob has finished moving to a different tile in order to avoid stacking, attack again from the new position.
            if(character.previousTarget && !character.isMoving()) {
                var t = character.previousTarget;
                
                if (this.getEntityById(t.id)) { // does it still exist?
                    character.previousTarget = null;
                    this.createAttackLink(character, t);
                    return;
                }
            }
        
            if (character.isAttacking() && !character.previousTarget) {
                var isMoving = this.tryMovingToADifferentTile(character); // Don't let multiple mobs stack on the same tile when attacking a player.
                
                if(character.canAttack(time)) {
                    if(!isMoving) { // don't hit target if moving to a different tile.
                        if(character.hasTarget() && character.getOrientationTo(character.target) !== character.orientation) {
                            character.lookAtTarget();
                        }
                        character.hit();
                        
                        if (character.id === this.playerId) {
                            this.processHit(character.target);
                        }
                        
                        if (character instanceof Player && this.renderer.camera.isVisible(character)) {
//                            this.audioManager.playSound("hit"+Math.floor(Math.random()*2+1));
                        }
                        
                        if (character.hasTarget() && character.target.id === this.playerId && this.player) {
//                            this.client.sendHurt(character);
//                            console.log('-----------------sendHurt---');
                            this.processHurt(character);
                        }
                    }
                } else {
                    if(character.hasTarget() && character.isDiagonallyAdjacent(character.target) 
                    && character.target instanceof Player && !character.target.isMoving()) {
                        character.follow(character.target);
                    }
                }
            }
        },
        processEntityAttack: function (attackerId, targetId) {
            var attacker = this.getEntityById(attackerId),
                target = this.getEntityById(targetId);

             if (attacker && target && attacker.id !== this.playerId) {
//            if (attacker && target) {
                console.log('[!] ' + attacker.id + ' attacks ' + target.id);
                this.createAttackLink(attacker, target);
            }

            console.log('---------------------------------------');
            console.log('-> attacker: ', attacker);
            console.log('-> target: ', target);
            console.log('---------------------------------------');
        },
 
        processEntityMove: function(id, x, y) {
            var entity = null;

            if (id !== this.playerId) {
                entity = this.getEntityById(id);
        
                if (entity) {
                    entity.disengage();
                    entity.idle();
                    this.makeCharacterGoTo(entity, x, y);
                    console.log('--> entity move: ', entity, x, y);

                }
            }
        },
        processPlayerChangeHealth: function (points) {
            var player = this.player,
                diff, isHurt;

            if (player && !player.isDead && !player.invincible) {
//                isHurt = points <= player.hitPoints;
                diff = points - player.hitPoints;
                player.hitPoints = points;
                
                console.log('- player hitPoints: ', player.hitPoints);
                if (player.hitPoints <= 0) {
//                    console.log('- ** player.attackers: ', player.attackers);
                    var parseObject = Object.keys(player.attackers);
                    if (parseObject.length > 0) {
                        var attacker = player.attackers[parseObject[0]];
                        console.log('- ** attacker ', attacker.atkSpeed * attacker.animations.atk_down.length);
                        setTimeout(function () {
                            attacker.hit();
                        }, 100);
                        setTimeout(function () {
                            player.die();
                        }, attacker.atkSpeed * attacker.animations.atk_down.length);
                    }
                    
                }
//                if (isHurt) {
//                    player.hurt();
//                    this.audioManager.playSound("hurt");
                   
//                } 
            } 
        },
        processDespawnEntity: function (entity) {
            if(entity) {
                console.log('--> Despawning: ' + entity.id);

                if(entity.gridX === this.previousClickPosition.x
                && entity.gridY === this.previousClickPosition.y) {
                    this.previousClickPosition = {};
                }

                if (entity instanceof Character) {
                    entity.forEachAttacker(function (attacker) {
                        if (attacker.canReachTarget()) {
                            attacker.hit();
                        }
                    });
                    if (entity instanceof Monster) {
                        if (entity.target) {
                            setTimeout(function () {
                                entity.die();
                            }, entity.target.atkSpeed * entity.target.animations.atk_down.length);
                        }
                      
                    }
                    
                }
                entity.clean();
            }
        },
        processHit: function (monster) {
            if (monster) {
                var dmg = formula.damage(this.player.weaponLevel, monster.armorLevel);
                    
                if (dmg > 0) {
                    monster.receiveDamage(dmg);
                    this.handleMobHate(monster, this.player, dmg);
                    this.handleHurtEntity(monster, this.player, dmg);
                }
            }
        },
        processHurt: function (mob) {
            if (mob && this.player.hitPoints > 0) {
                this.player.hitPoints -= formula.damage(mob.weaponLevel, this.player.armorLevel);
                this.handleHurtEntity(this.player);

                if (this.player.hitPoints <= 0) {
                    this.player.isDead = true;
                    
                }
            }
        },
        processPlayerKillMob: function (mob) {
            
            console.log('--> you killed ' + mob.id + '!');
        },

        
        //========== process end ===================================================================================
        
        
        //========== aggro start ===================================================================================
        handleMobHate: function (mob, player, hatePoints) {
            if (player && mob) {
                mob.increaseHateFor(player.id, hatePoints);
                player.addHater(mob);

                if (mob.hitPoints > 0) { // only choose a target if still alive
                    this.chooseMobTarget(mob);
                }
            }
            
        },
        chooseMobTarget: function (mob, hateRank) {
            var player = this.getEntityById(mob.getHatedPlayerId(hateRank));
            
            console.log('- chooseMobTarget player: ', player);
            // If the mob is not already attacking the player, create an attack link between them.
            if(player && !(mob.id in player.attackers)) {
                this.clearMobAggroLink(mob);

                player.addAttacker(mob);
                mob.setTarget(player);

                this.processEntityAttack(mob.id, player.id);
                
                console.log('--> ' + mob.id + ' is now attacking ' + player.id);
            }
        },
        clearMobAggroLink: function (mob) {
            var player = null;
            if (mob.target) {
                player = this.getEntityById(mob.target);
                if (player) {
                    player.removeAttacker(mob);
                }
            }
        },
        handleHurtEntity: function (entity, attacker, damage) {
            var self = this;

            if (entity instanceof Player) {
                // A player is only aware of his own hitpoints
                this.processPlayerChangeHealth(entity.hitPoints);
            }

            if (entity instanceof Monster) {
                // Let the mob's attacker (player) know how much damage was inflicted
                //----------------------
//                    var mob = self.getEntityById(mobId);
//                    if(mob && points) {
//                        self.infoManager.addDamageInfo(points, mob.x, mob.y - 15, "inflicted");
//                    }
                //----------------------
            }

            // If the entity is about to die
            if (entity.hitPoints <= 0) {
                if (entity instanceof Monster) {
                    var mob = entity;
//                        item = this.getDroppedItem(mob);
                    this.processPlayerKillMob(mob);
                    this.processDespawnEntity(entity);
//                    if(item) {
//                        this.pushToAdjacentGroups(mob.group, mob.drop(item));
//                        this.handleItemDespawn(item);
//                    }
                }

                if (entity instanceof Player) {
                     this.processDespawnEntity(entity);
                }
                // 20171102 saltgamer
//                this.removeEntity(entity);
            }
        },
        
        
        
        //========== aggro end =====================================================================================

        
        makeCharacterGoTo: function (character, x, y, callBack) {
            if (!this.map.isOutOfBounds(x, y)) {
                character.go(x, y);
            }
            if (callBack) callBack();
        },
        makePlayerGoTo: function (x, y) {
            this.makeCharacterGoTo(this.player, x, y);
        },
        makePlayerAttack: function (mob) {
            this.createAttackLink(this.player, mob);
            this.processEntityAttack(this.playerId, mob.id);
        },
        
        getEntityAt: function (x, y) {
            if (this.map.isOutOfBounds(x, y) || !this.entityGrid) {
                return null;
            }
            var entities = this.entityGrid[y][x],
                entity = null;
            
            if (entities) {
                var parseObject = Object.keys(entities);
                if (parseObject.length > 0) {
                    entity = entities[parseObject[0]];
                    
                }

            }
            
            return entity;
            
        },
        findPath: function (character, x, y, ignoreList) {
            var self = this,
                grid = this.pathingGrid,
                path = [],
                isPlayer = (character === this.player);
        
            if (this.map.isColliding(x, y)) {
                return path;
            }
            
            if (this.pathFinder && character) {
                if (ignoreList) {
                    var parseObject = Object.keys(ignoreList);
                    if (parseObject.length > 0) {
                        parseObject.forEach(function (value, idx) {
                            self.pathFinder.ignoreEntity(ignoreList[value]);
                        });
                    } else {
                        console.log('[!] ignoreList is empty!');
                    }
                }
            
                path = this.pathFinder.findPath(grid, character, x, y, false);
            
                if (ignoreList) {
                    this.pathFinder.clearIgnoreList();
                }
            } else {
                console.log('[!] Error while finding the path to ' + x + ', ' + y + ' for ' + character.id);
            }
            return path;
        },
        unregisterEntityPosition: function (entity) {
            if (entity) {
                this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                this.removeFromPathingGrid(entity.gridX, entity.gridY);
                this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
            
                if (entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                    this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
                    this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
                }
            }
        },
        registerEntityPosition: function (entity) {
            var x = entity.gridX,
                y = entity.gridY;
        
            if (entity) {
                if(entity instanceof Character) {
                    this.entityGrid[y][x][entity.id] = entity;
                    if(!(entity instanceof Player)) {
                        this.pathingGrid[y][x] = 1;
                    }
                }
                this.addToRenderingGrid(entity, x, y);
            }
        },
        registerEntityDualPosition: function (entity) {
            if (entity) {
                this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;
            
                this.addToRenderingGrid(entity, entity.gridX, entity.gridY);
            
                if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                    this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
                    if(!(entity instanceof Player)) {
                        this.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
                    }
                }
            }
        },
        removeFromRenderingGrid: function (entity, x, y) {
            if(entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
                delete this.renderingGrid[y][x][entity.id];
            }
        },
        removeFromEntityGrid: function (entity, x, y) {
            if(this.entityGrid[y][x][entity.id]) {
                delete this.entityGrid[y][x][entity.id];
            }
        },
        removeFromPathingGrid: function (x, y) {
            this.pathingGrid[y][x] = 0;
        },

        
        tryMovingToADifferentTile: function (character) {
            var attacker = character,
                target = character.target;
            
            if (attacker && target && target instanceof Player) {
                if(!target.isMoving() && attacker.getDistanceToEntity(target) === 0) {
                    var pos;
                    
                    switch(target.orientation) {
                        case type.Orientations.UP:
                            pos = {x: target.gridX, y: target.gridY - 1, o: target.orientation}; break;
                        case type.Orientations.DOWN:
                            pos = {x: target.gridX, y: target.gridY + 1, o: target.orientation}; break;
                        case type.Orientations.LEFT:
                            pos = {x: target.gridX - 1, y: target.gridY, o: target.orientation}; break;
                        case type.Orientations.RIGHT:
                            pos = {x: target.gridX + 1, y: target.gridY, o: target.orientation}; break;
                    }
                    
                    if (pos) {
                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;
                        
                        return true;
                    }
                }
            
                if (!target.isMoving() && attacker.isAdjacentNonDiagonal(target) && this.isMobOnSameTile(attacker)) {
                    var pos = this.getFreeAdjacentNonDiagonalPosition(target);
            
                    // avoid stacking mobs on the same tile next to a player
                    // by making them go to adjacent tiles if they are available
                    if (pos && !target.adjacentTiles[pos.o]) {
                        if(this.player.target && attacker.id === this.player.target.id) {
                            return false; // never unstack the player's target
                        }
                        
                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;
                        
                        return true;
                    }
                }
            }
            return false;
        },
        isMobOnSameTile: function (mob, x, y) {
            var X = x || mob.gridX,
                Y = y || mob.gridY,
                list = this.entityGrid[Y][X],
                result = false;
            var parseObject = Object.keys(list);
            if (parseObject.length > 0) {
                parseObject.forEach(function (value, idx) {
                    var entity = list[value];
                    if(entity instanceof Monster && entity.id !== mob.id) {
                        result = true;
                    }
                    
                });
            } else {
                console.log('[!] isMobOnSameTile list is empty!');
            }
            
            
            return result;
        },
        getFreeAdjacentNonDiagonalPosition: function (entity) {
            var self = this,
                result = null;
            
            entity.forEachAdjacentNonDiagonalPosition(function (x, y, orientation) {
                if(!result && !self.map.isColliding(x, y) && self.getMobAt(x, y) !== null) {
                    result = {x: x, y: y, o: orientation};
                }
            });
            return result;
        },
        getMobAt: function (x, y) {
            var entity = this.getEntityAt(x, y);
            if (entity && (entity instanceof Monster)) {
                return entity;
            }
            return null;
        }
        
        
    };
    
    return core;
});