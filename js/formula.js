/*
    file name : formula.js
    description : formula object
	create date : 2017-09-22
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['type'], function (type) {
    'use strict';
    var formula = {
        random: function (range) {
            return Math.floor(Math.random() * range);  
        },
        randomRange: function (min, max) {
            return min + (Math.random() * (max - min));
        },
        randomInt: function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));  
        },
        randomOrientation: function () {
            var orientation, rnd = this.random(4);
            if(rnd === 0)
                orientation = type.Orientations.LEFT;
            if(rnd === 1)
                orientation = type.Orientations.RIGHT;
            if(rnd === 2)
                orientation = type.Orientations.UP;
            if(rnd === 3)
                orientation = type.Orientations.DOWN;

            return orientation;   
        },
        damage: function (weaponLevel, armorLevel) {
            var dealt = weaponLevel * this.randomInt(5, 10),
                absorbed = armorLevel * this.randomInt(1, 3),
                dmg =  dealt - absorbed;

            console.log('[damage] absorbed: ' + absorbed + '   dealt: ' + dealt + '   dmg: ' + dmg);
            if (dmg <= 0) {
                return this.randomInt(0, 3);
            } else {
                return dmg;
            }
        },
        hitPoint: function (armorLevel) {
            var hp = 80 + ((armorLevel - 1) * 30);
            return hp; 
        }
        
        
    };
    
    return formula;
});