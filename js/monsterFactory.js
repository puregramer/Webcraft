/*
    file name : monsterFactory.js
    description : monsterFactory object
	create date : 2017-09-11
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['monster', 'timer', 'type'],
	function (Monster, Timer, type) {
	'use strict';
    var monsterFactory = {
        ORC: Monster.extend({
            init: function (id) {
                this._super(id, type.Entities.ORC);
                this.isAggressive = true;
                this.aggroRange = 2;
                this.moveSpeed = 300;
                this.atkSpeed = 150;
                this.idleSpeed = 250;
                this.walkSpeed = 100;
                this.setAttackRate(1600);
                this.weaponLevel = 1;
                this.armorLevel = 1;
                this.resetHitPoints(20); //50
                
            }
        })
    };
    
    return monsterFactory;
});