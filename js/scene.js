/*
    file name : scene.js
    description : scene object
		create date : 2017-10-24
		creator : saltgamer
*/
define(['$core', 'world', 'map', 'loading', 'pathFinder', 'spawn', 'sprite', 'spriteData'],
    function($core, world, Map, loading, PathFinder, spawn, Sprite, spriteData) {
        'use strict';
        var scene = {
            init: function() {
                var map = new Map({
                    mapTileCol: world.map[0].mapTileCol,
                    mapTileRow: world.map[0].mapTileRow,
                    tileWidth: world.map[0].tileWidth,
                    tileHeight: world.map[0].tileHeight,
                    callBack: function() {
                        setTimeout(function() {
                            loading.hide();
                        }, 200);
                    }
                });
                map.spriteSheetLoaded = true;
                map.create(world.map[0].mapData);
                $core.map = map;
                $core.bgCanvas = map.canvas;
                $core.mapTileCol = map.mapTileCol;
                $core.mapTileRow = map.mapTileRow;

                var pathFinder = new PathFinder(map);
                $core.pathFinder = pathFinder;


                console.log('-> map: ', map);

            },
            start: function(params) {
                console.log('--> start WebCraft!');

                $core.player.id = params.id;
                $core.playerId = params.id;
                $core.player.name = params.name;

                $core.player.setGridPosition(params.x, params.y);
                $core.player.setMaxHitPoints(params.hp);
                $core.resetCamera();
                $core.addEntity($core.player);

                $core.player.addRequestPath(function(x, y) {
                    console.log('--> addRequestPath!');
                    var ignored = [$core.player];

                    if ($core.player.hasTarget()) {
                        ignored.push($core.player.target);
                    }

                    return $core.findPath($core.player, x, y, ignored);
                });

                $core.player.addStartPathing(function(path) {
                    var i = path.length - 1,
                        x = path[i][0],
                        y = path[i][1];

                    if ($core.player.isMovingToLoot()) {
                        $core.player.isLootMoving = false;
                    } else if (!$core.player.isAttacking()) {
                        $core.processEntityMove($core.playerId, x, y);
                    }

                    // Target cursor position
                    // $core.selectedX = x;
                    // $core.selectedY = y;
                    // $core.selectedCellVisible = true;

                });

                $core.player.addBeforeStep(function() {
                    var blockingEntity = $core.getEntityAt($core.player.nextGridX, $core.player.nextGridY);
                    if (blockingEntity && blockingEntity.id !== $core.playerId) {
                        console.log('--> Blocked by ' + blockingEntity.id);
                    }
                    $core.unregisterEntityPosition($core.player);
                });

                $core.player.addStep(function() {
                    if ($core.player.hasNextStep()) {
                        $core.registerEntityDualPosition($core.player);
                    }

                    $core.player.forEachAttacker(function(attacker) {
                        if (attacker.isAdjacent(attacker.target)) {
                            attacker.lookAtTarget();
                        } else {
                            attacker.follow($core.player);
                        }
                    });

                });

                $core.player.addStopPathing(function(x, y) {
                    if ($core.player.hasTarget()) {
                        $core.player.lookAtTarget();
                    }
                    $core.selectedCellVisible = false;

                    $core.player.forEachAttacker(function(attacker) {
                        if (!attacker.isAdjacentNonDiagonal($core.player)) {
                            attacker.follow($core.player);
                        }
                    });

                    $core.unregisterEntityPosition($core.player);
                    $core.registerEntityPosition($core.player);

                });

                $core.player.addDeath(function() {
                    console.log('-->' + $core.playerId + " is dead!");

                    $core.player.stopBlinking();
                    $core.player.setSprite(new Sprite(spriteData[$core.player.spriteName + '_death']));
                    $core.player.animate('death', 200, 1, function() {
                        console.log('--> ' + $core.playerId + ' was removed!');

                        $core.player.forEachAttacker(function(attacker) {
                            attacker.disengage();
                            attacker.idle();
                        });

                        $core.removeEntity($core.player);
                        $core.removeFromRenderingGrid($core.player, $core.player.gridX, $core.player.gridY);

                        $core.player = null;

                    });

                });

                $core.player.addCheckAggro(function() {
                    $core.forEachMob(function(mob) {
                        if (mob.isAggressive && !mob.isAttacking() && $core.player.isNear(mob, mob.aggroRange)) {
                            $core.player.aggro(mob);

                        }
                    });
                });

                $core.player.addAggro(function(mob) {
                    if (!mob.isWaitingToAttack($core.player) && !$core.player.isAttackedBy(mob)) {
                        console.log('--> Aggroed by ' + mob.id + ' at (' + $core.player.gridX + ', ' + $core.player.gridY + ')');
                        $core.handleMobHate(mob, $core.player, 5);
                        mob.waitToAttack($core.player);
                    }
                });

                spawn.eachSpawnCharacter();

                if (params.callBack) params.callBack();
            }

        };
        return scene;
    });
