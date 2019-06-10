/*
    file name : player.js
    description : player object
	create date : 2017-07-24
	creator : saltgamer

    reference: https://github.com/mozilla/BrowserQuest

*/
define(['character', 'timer'],
    function (Character, Timer) {
        'use strict';
        var player = Character.extend({
            init: function (id, name, kind) {
                this._super(id, kind);

                this.name = name;

                // Renderer
                this.nameOffsetY = -10;

                // player sprite name
                this.spriteName = name;
                this.weaponLevel = 1;
                this.armorLevel = 1;

                // modes
                this.isLootMoving = false;

                // hater monster
                this.haters = {};
                this.removeResetAggroTimer();
                this.setResetAggroTimer(10000); // 20000

            },
            getSpriteName: function () {
                return this.spriteName;
            },
            setSpriteName: function (name) {
                this.spriteName = name;
            },
            isMovingToLoot: function () {
                return this.isLootMoving;
            },
            addHater: function (mob) {
                if (mob) {
                    if (!(mob.id in this.haters)) {
                        this.haters[mob.id] = mob;
                    }
                }
            },
            setResetAggroTimer: function (time) {
                this.resetAggroTimer = new Timer(time);
            },
            removeResetAggroTimer: function () {
                if (this.resetAggroTimer) delete this.resetAggroTimer;
            }


        });

        return player;
    });
