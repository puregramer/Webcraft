/*
    file name : selector.js
    description : selector object
		create date : 2017-10-25
		creator : saltgamer
*/
define(['$core', 'monster', 'player'],
    function($core, Monster, Player) {
        'use strict';
        var selector = {
            mouse: {
                x: 0,
                y: 0
            },
            init: function() {
                var self = this;
                $core.playCanvas.addEventListener('mousedown', function(e) {
                    // e.preventDefault();
                    self.setMouseCoordinates(e);
                }, false);
                $core.playCanvas.addEventListener('touchstart', function(e) {
                    // e.preventDefault();
                    self.setMouseCoordinates(e.touches[0]);
                }, false);

                $core.playCanvas.addEventListener('click', function(e) {
                    e.preventDefault();
                    console.log('--> playCanvas Click!');

                    // self.clickEvent();

                    self.select();
                    // $core.pathFinder.drawPath();

                }, false);
            },
            clickEvent: function() {
                var pos = this.getMouseGridPosition(),
                    entity;
                console.log('-*-----------------------------------------------------*-');
                console.log('--> pos: ', pos);
                console.log('-*-----------------------------------------------------*-');

                if (pos.x === $core.previousClickPosition.x && pos.y === $core.previousClickPosition.y) {
                    return;
                } else {
                    $core.previousClickPosition = pos;
                }

                if ($core.gameStarted && $core.player && !$core.player.isDead) {
                    entity = $core.getEntityAt(pos.x, pos.y);

                    if (entity instanceof Monster) {
                        $core.makePlayerAttack(entity);
                    } else {
                        $core.makePlayerGoTo(pos.x, pos.y);
                    }

                }

            },
            setMouseCoordinates: function(event) {
                var width = $core.renderer.getWidth(),
                    height = $core.renderer.getHeight(),
                    mouse = this.mouse;

                mouse.x = event.pageX;
                mouse.y = event.pageY;

                if (mouse.x <= 0) {
                    mouse.x = 0;
                } else if (mouse.x >= width) {
                    mouse.x = width - 1;
                }

                if (mouse.y <= 0) {
                    mouse.y = 0;
                } else if (mouse.y >= height) {
                    mouse.y = height - 1;
                }
								// console.log('-*----------------------------------------------*-');
								// console.log('- mouse: ', mouse);
								// console.log('-*----------------------------------------------*-');
            },
            getMouseGridPosition: function() {
                var mx = this.mouse.x,
                    my = this.mouse.y,
                    c = $core.renderer.camera,
                    s = 1,
                    ts = $core.renderer.tilesize,
                    offsetX = mx % (ts * s),
                    offsetY = my % (ts * s),
                    x = ((mx - offsetX) / (ts * s)) + c.gridX,
                    y = ((my - offsetY) / (ts * s)) + c.gridY;

                return {
                    x: x,
                    y: y
                };
            },
            select: function() {
                var pos = this.getMouseGridPosition(),
                    entity;
                console.log('-*-------------------------*-');
                console.log('--> pos: ', pos);
                console.log('-*-------------------------*-');

                if (pos.x === $core.previousClickPosition.x && pos.y === $core.previousClickPosition.y) {
                    return;
                } else {
                    $core.previousClickPosition = pos;
                }

                if ($core.gameStarted) {
                    entity = $core.getEntityAt(pos.x, pos.y);

                    if (entity instanceof Player) {
                        console.log('- select entity: ', entity);
                        this.selectPlayer(entity);
                    }

                    if ($core.player && !$core.player.isDead) {
                        if (entity instanceof Monster) {
                            $core.makePlayerAttack(entity);
                        } else {
                            $core.makePlayerGoTo(pos.x, pos.y);
                        }
                    }

                }

            },
            selectPlayer: function(player) {
                $core.player = player;
            }

        };
        return selector;
    });
