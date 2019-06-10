/*
    file name : hero.js
    description : hero object
		create date : 2017-09-06
		creator : saltgamer

    reference: https://github.com/mozilla/BrowserQuest
*/

define(['player', 'type'],
    function(Player, type) {
        'use strict';
        var hero = Player.extend({
            init: function(id, name, entityCode) {
                this._super(id, name, entityCode);

                switch (entityCode) {
                    case type.Entities.HERO:
                        this.atkSpeed = 150;
                        this.moveSpeed = 250; // 300
                        this.walkSpeed = 100; // 100
                        this.idleSpeed = 250; // 450
                        this.setAttackRate(1400);
                        break;
                }
            }

        });

        return hero;
    });
