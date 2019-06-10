/*
    file name : character.js
    description : character object
	create date : 2017-07-24
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['type', 'entity', 'transition', 'timer'],
    function (type, Entity, Transition, Timer) {
        'use strict';
        var Character = Entity.extend({
            init: function (id, kind) {
                var self = this;

                this._super(id, kind);

                // Position and orientation
                this.nextGridX = -1;
                this.nextGridY = -1;
                this.orientation = type.Orientations.DOWN;
//            this.orientation = type.Orientations.RIGHT;

                // Speeds
                this.atkSpeed = 150;
//    		this.moveSpeed = 120;
                this.moveSpeed = 300; // 240
//    		this.walkSpeed = 100;
                this.walkSpeed = 100; // 100
                this.idleSpeed = 250; // 450
                this.setAttackRate(1600);

                // Pathing
                this.movement = new Transition();
                this.path = null;
                this.newDestination = null;
                this.adjacentTiles = {};

                // Combat
                this.target = null;
                this.unconfirmedTarget = null;
                this.attackers = {};

                // Health
                this.hitPoints = 0;
                this.maxHitPoints = 0;
//            this.preHitPoints = 0;

                // Modes
                this.isDead = false;
                this.attackingMode = false;
                this.followingMode = false;

            },
            setMaxHitPoints: function (hp) {
                this.maxHitPoints = hp;
                this.hitPoints = hp;
            },
            resetHitPoints: function (maxHitPoints) {
                this.maxHitPoints = maxHitPoints;
                this.hitPoints = this.maxHitPoints;

            },
            animate: function (animation, speed, count, onEndCount) {
                var oriented = ['atk', 'walk', 'idle'],
                    o = this.orientation;

                if (!(this.currentAnimation && this.currentAnimation.name === this.spriteName + "_death")) { // don't change animation if the character is dying
                    this.flipSpriteX = false;
                    this.flipSpriteY = false;

                    for (var i = 0; i < oriented.length; i++) {
                        if (oriented[i].indexOf(animation) >= 0) {
                            animation += "_" + (o === type.Orientations.LEFT ? "right" : type.getOrientationAsString(o));
                            this.flipSpriteX = (this.orientation === type.Orientations.LEFT) ? true : false;
                        }
                    }

                    this.setAnimation(animation, speed, count, onEndCount);
                }
            },
            setOrientation: function (orientation) {
                if (orientation) {
                    this.orientation = orientation;
                }
            },
            idle: function (orientation) {
                this.setOrientation(orientation);
                this.animate("idle", this.idleSpeed);
//             this.animate("walk", this.walkSpeed);
            },
            walk: function (orientation) {
                this.setOrientation(orientation);
                this.animate("walk", this.walkSpeed);
            },
            hit: function (orientation) {
                var self = this;
                this.setOrientation(orientation);
                this.animate("atk", this.atkSpeed, 1);

                if (this.target) {
                    setTimeout(function () {
                        if (self.target) {
                            self.target.hurt();
                            //this.audioManager.playSound("hurt");
                        }
                    }, this.atkSpeed * this.animations.atk_down.length);

                }

            },
            setAttackRate: function (rate) {
                this.attackCooldown = new Timer(rate);
            },
            isMoving: function () {
                return !(this.path === null);
            },
            hasNextStep: function () {
                return (this.path.length - 1 > this.step);
            },
            hasChangedItsPath: function () {
                return !(this.newDestination === null);
            },
            onHasMoved: function (callback) {
                this.hasmoved_callback = callback;
            },
            hasMoved: function () {
                if (this.hasmoved_callback) {
                    this.hasmoved_callback(this);
                }
            },
            isAttacking: function () {
                return this.attackingMode;
            },
            getOrientationTo: function (character) {
                if (this.gridX < character.gridX) {
                    return type.Orientations.RIGHT;
                } else if (this.gridX > character.gridX) {
                    return type.Orientations.LEFT;
                } else if (this.gridY > character.gridY) {
                    return type.Orientations.UP;
                } else {
                    return type.Orientations.DOWN;
                }
            },
            turnTo: function (orientation) {
                this.orientation = orientation;
                this.idle();
            },
            lookAtTarget: function () {
                if (this.target) {
                    this.turnTo(this.getOrientationTo(this.target));
                }
            },
            go: function (x, y) {
                if (this.isAttacking()) {
                    this.disengage();
                } else if (this.followingMode) {
                    this.followingMode = false;
                    this.target = null;
                }
                this.moveTo_(x, y);
            },
            stop: function () {
                if (this.isMoving()) {
                    this.interrupted = true;
                }
            },
            follow: function (entity) {
                if (entity) {
                    this.followingMode = true;
                    this.moveTo_(entity.gridX, entity.gridY);
                }
            },
            moveTo_: function (x, y) {
                this.destination = {gridX: x, gridY: y};
//            this.adjacentTiles = {};

                if (this.isMoving()) {
                    this.continueTo(x, y);
                } else {
                    var path = this.requestPathfindingTo(x, y);

                    this.followPath(path);
                }

            },

            requestPathfindingTo: function (x, y) {
                try {
                    return this.processRequestPathCallBack(x, y);
                } catch (e) {
                    console.log('--> [!] ' + this.id + ' could not request pathfinding to ' + x + ', ' + y + ' error: ' + e);
                    return [];
                }
            },


            //=== add callBack event ===============================
            addRequestPath: function (callBack) {
                this.processRequestPathCallBack = callBack;
            },
            addStartPathing: function (callback) {
                this.processStartPathingCallBack = callback;
            },
            addBeforeStep: function (callBack) {
                this.processBeforeStepCallBack = callBack;
            },
            addStep: function (callBack) {
                this.processStepCallBack = callBack;
            },
            addStopPathing: function (callBack) {
                this.processStopPathingCallBack = callBack;
            },
            addDeath: function (callBack) {
                this.processDeathCallBack = callBack;
            },
            addCheckAggro: function (callBack) {
                this.processCheckAggroCallBack = callBack;
            },
            addAggro: function (callBack) {
                this.processAggroCallBack = callBack;
            },

            //=== add callBack event ===============================

            aggro: function (character) {
                if (this.processAggroCallBack) {
                    this.processAggroCallBack(character);
                }
            },
            continueTo: function (x, y) {
                this.newDestination = {x: x, y: y};
            },
            updatePositionOnGrid: function () {
                this.setGridPosition(this.path[this.step][0], this.path[this.step][1]);
            },
            updateMovement: function () {
                var p = this.path,
                    i = this.step;

                if (p[i][0] < p[i - 1][0]) {
                    this.walk(type.Orientations.LEFT);
                }
                if (p[i][0] > p[i - 1][0]) {
                    this.walk(type.Orientations.RIGHT);
                }
                if (p[i][1] < p[i - 1][1]) {
                    this.walk(type.Orientations.UP);
                }
                if (p[i][1] > p[i - 1][1]) {
                    this.walk(type.Orientations.DOWN);
                }
            },
            nextStep: function () {
                var stop = false,
                    x, y, path;

                if (this.isMoving()) {
                    if (this.processBeforeStepCallBack) {
                        this.processBeforeStepCallBack();
                    }

                    this.updatePositionOnGrid();
                    if (this.processCheckAggroCallBack) this.processCheckAggroCallBack();

                    if (this.interrupted) { // if Character.stop() has been called
                        stop = true;
                        this.interrupted = false;
                    } else {
                        if (this.hasNextStep()) {
                            this.nextGridX = this.path[this.step + 1][0];
                            this.nextGridY = this.path[this.step + 1][1];
                        }

                        if (this.processStepCallBack) {
                            this.processStepCallBack();
                        }

                        if (this.hasChangedItsPath()) {
                            x = this.newDestination.x;
                            y = this.newDestination.y;
                            path = this.requestPathfindingTo(x, y);

                            this.newDestination = null;
                            if (path.length < 2) {
                                stop = true;
                            } else {
                                this.followPath(path);
                            }
                        }
                        else if (this.hasNextStep()) {
                            this.step += 1;
                            this.updateMovement();
                        }
                        else {
                            stop = true;
                        }
                    }

                    if (stop) { // Path is complete or has been interrupted
                        this.path = null;
                        this.idle();

                        if (this.processStopPathingCallBack) {
                            this.processStopPathingCallBack(this.gridX, this.gridY);
                        }
                    }
                }
            },
            followPath: function (path) {
                if (path.length > 1) { // Length of 1 means the player has clicked on himself
                    this.path = path;
                    this.step = 0;

                    if (this.followingMode) { // following a character
                        path.pop();
                    }

                    if (this.processStartPathingCallBack) {
                        this.processStartPathingCallBack(path);
                    }
                    this.nextStep();
                }
            },
            engage: function (character) {
                this.attackingMode = true;
                this.setTarget(character);
                this.follow(character);
            },
            disengage: function () {
                this.attackingMode = false;
                this.followingMode = false;
                this.removeTarget();
            },
            setTarget: function (character) {
                if (this.target !== character) { // If it's not already set as the target
                    if (this.hasTarget()) {
                        this.removeTarget(); // Cleanly remove the previous one
                    }
                    this.unconfirmedTarget = null;
                    this.target = character;
                } else {
                    console.log('[!] ' + character.id + ' is already the target of ' + this.id);
                }
            },
            hasTarget: function () {
                return !(this.target === null);
            },
            waitToAttack: function (character) {
                this.unconfirmedTarget = character;
//            console.log('-*** unconfirmedTarget: ', this.unconfirmedTarget);
            },
            isWaitingToAttack: function (character) {
//            console.log('-*** isWaitingtoAttack');
//            console.log('-*** this.unconfirmedTarget: ', this.unconfirmedTarget);
//            console.log('-*** character: ', character);
                return (this.unconfirmedTarget === character);
            },
            removeTarget: function () {
                var self = this;

                if (this.target) {
                    if (this.target instanceof Character) {
                        this.target.removeAttacker(this);
                    }
                    this.target = null;
                }
            },
            addAttacker: function (character) {
                if (!this.isAttackedBy(character)) {
                    this.attackers[character.id] = character;
                } else {
                    console.log('[!]' + this.id + ' is already attacked by ' + character.id);
                }
            },
            removeAttacker: function (character) {
                if (this.isAttackedBy(character)) {
                    delete this.attackers[character.id];
                } else {
                    console.log('[!] ' + this.id + ' is not attacked by ' + character.id);
                }
            },
            isAttackedBy: function (character) {
                return (character.id in this.attackers);
            },
            isNear: function (character, distance) {
                var dx, dy, near = false;

                dx = Math.abs(this.gridX - character.gridX);
                dy = Math.abs(this.gridY - character.gridY);

                if (dx <= distance && dy <= distance) {
                    near = true;
                }
                return near;
            },
            forEachAttacker: function (callBack) {
                var self = this,
                    parseObject = Object.keys(this.attackers);
                if (parseObject.length > 0) {
                    parseObject.forEach(function (value, idx) {
                        console.log('- value: ', value);
                        callBack(self.attackers[value]);
                    });
                } else {
                    console.log('[!] attackers is empty!');
                }
            },
            canAttack: function (time) {
                if (this.canReachTarget() && this.attackCooldown.isOver(time)) {
                    return true;
                }
                return false;
            },
            canReachTarget: function () {
                if (this.hasTarget() && this.isAdjacentNonDiagonal(this.target)) {
                    return true;
                }
                return false;
            },
            die: function () {
                this.removeTarget();
                this.isDead = true;
                if (this.processDeathCallBack) {
                    this.processDeathCallBack();
                }
            },
            hurt: function () {
                var self = this;
                this.stopHurting();
//            console.log('- this.hurtSprite: ', this.hurtSprite);
//            console.log('- this.normalSprite: ', this.normalSprite);
                this.sprite = this.hurtSprite;
                this.hurting = setTimeout(this.stopHurting.bind(this), 75);

            },
            stopHurting: function () {
                this.sprite = this.normalSprite;
                clearTimeout(this.hurting);
            },
            clean: function () {
                this.forEachAttacker(function (attacker) {
                    attacker.disengage();
                    attacker.idle();
                });
            },


        });

        return Character;
    });