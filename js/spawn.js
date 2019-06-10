/*
    file name : spawn.js
    description : spawn object
		create date : 2017-10-25
		creator : saltgamer
*/
define(['$core', 'world', 'sprite', 'spriteData', 'entityFactory', 'character', 'monster', 'player'],
    function($core, world, Sprite, spriteData, EntityFactory, Character, Monster, Player) {
        'use strict';
        var spawn = {
            eachSpawnCharacter: function() {
                var self = this;
                world.moster.forEach(function(value, idx) {
                    var kind = value.kind,
                        id = value.id,
                        name = value.name,
                        character = EntityFactory.createEntity(kind, id, name);

                    self.processSpawnCharacter({
                        entity: character,
                        spriteName: value.spriteName,
                        x: value.x,
                        y: value.y,
                        orientation: value.orientation,
                        targetId: ''
                        // targetId: 'saltgamer'
                    });

                });
            },
            processSpawnCharacter: function(params) {
                var entity = params.entity;
                if (!$core.entityIdExists(entity.id)) {

                    try {
                        // console.log('---------------------------------------', params.entity.id);

                        if (entity.id !== $core.playerId) {
                            //entity.setSprite(self.sprites[entity.getSpriteName()]);
                            entity.setSprite(new Sprite(spriteData[params.spriteName]));
                            entity.setGridPosition(params.x, params.y);

                            // add by saltgamer 20171110
                            entity.spawnPosition.x = params.x;
                            entity.spawnPosition.y = params.y;

                            entity.setOrientation(params.orientation);
                            entity.sprite.createHurtSprite();
                            entity.idle();

                            $core.addEntity(entity);

                            console.log('--> Spawned ' + entity.kind + ' (' + entity.id + ') at ' + entity.gridX + ', ' + entity.gridY);

                            if (entity instanceof Character) {
                                entity.addBeforeStep(function() {
                                    $core.unregisterEntityPosition(entity);
                                });

                                entity.addStep(function() {
                                    if (!entity.isDying) {
                                        $core.registerEntityDualPosition(entity);

                                        entity.forEachAttacker(function(attacker) {
                                            if (attacker.isAdjacent(attacker.target)) {
                                                attacker.lookAtTarget();
                                            } else {
                                                attacker.follow(entity);
                                            }
                                        });
                                    }
                                });

                                entity.addStopPathing(function(x, y) {
                                    if (!entity.isDying) {
                                        if (entity.hasTarget() && entity.isAdjacent(entity.target)) {
                                            entity.lookAtTarget();
                                        }

                                        if (entity instanceof Player) {
                                            var gridX = entity.destination.gridX,
                                                gridY = entity.destination.gridY;


                                        }

                                        entity.forEachAttacker(function(attacker) {
                                            if (!attacker.isAdjacentNonDiagonal(entity) && attacker.id !== $core.playerId) {
                                                attacker.follow(entity);

                                            }

                                        });

                                        $core.unregisterEntityPosition(entity);
                                        $core.registerEntityPosition(entity);
                                    }
                                });

                                entity.addRequestPath(function(x, y) {
                                    var ignored = [entity], // Always ignore self
                                        ignoreTarget = function(target) {
                                            ignored.push(target);

                                            // also ignore other attackers of the target entity
                                            target.forEachAttacker(function(attacker) {
                                                ignored.push(attacker);
                                            });
                                        };

                                    if (entity.hasTarget()) {
                                        ignoreTarget(entity.target);
                                    } else if (entity.previousTarget) {
                                        // If repositioning before attacking again, ignore previous target
                                        // See: tryMovingToADifferentTile()
                                        ignoreTarget(entity.previousTarget);
                                    }

                                    return $core.findPath(entity, x, y, ignored);
                                });

                                entity.addDeath(function() {
                                    console.log('- ' + entity.id + ' is dead!');
                                    if (entity instanceof Monster) {
                                        // Keep track of where mobs die in order to spawn their dropped items
                                        // at the right position later.
                                        $core.deathpositions[entity.id] = {
                                            x: entity.gridX,
                                            y: entity.gridY
                                        };
                                    }

                                    entity.isDying = true;
                                    entity.setSprite(new Sprite(spriteData[params.spriteName + '_death']));

                                    entity.animate('death', 200, 1, function() {
                                        console.log('- ' + entity.id + ' was removed!');

                                        $core.removeEntity(entity);
                                        $core.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                                    });


                                    entity.forEachAttacker(function(attacker) {
                                        attacker.disengage();
                                    });

                                    if ($core.player.target && $core.player.target.id === entity.id) {
                                        $core.player.disengage();
                                    }

                                    // Upon death, this entity is removed from both grids, allowing the player
                                    // to click very fast in order to loot the dropped item and not be blocked.
                                    // The entity is completely removed only after the death animation has ended.
                                    $core.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                                    $core.removeFromPathingGrid(entity.gridX, entity.gridY);

                                    // if($core.camera.isVisible(entity)) {
                                    // $core.audioManager.playSound("kill"+Math.floor(Math.random()*2+1));
                                    // }

                                });

                                if (entity instanceof Monster) {
                                    console.log('--> targetId: ', params.targetId);
                                    if (params.targetId) {
                                        var player = $core.getEntityById(params.targetId);
                                        console.log('-> player: ', player);
                                        if (player) {
                                            $core.createAttackLink(entity, player);
                                        }
                                    }
                                }
                            }


                        }

                    } catch (e) {
                        console.log('[!] error: ', e);
                    }

                } else {
                    console.log('--> Character ' + entity.id + ' already exists. Dont respawn.');
                }
            }

        };
        return spawn;
    });
