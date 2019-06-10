/*
    file name : monster.js
    description : monster object
	create date : 2017-09-06
	creator : saltgamer
    
    reference: https://github.com/mozilla/BrowserQuest
    
*/
define(['character'],
	function (Character) {
	'use strict';
     var monster = Character.extend({
        init: function (id, kind) {
            this._super(id, kind);
            this.isDead = false;
            this.hatelist = [];
    
        },
        receiveDamage: function (points) {
            this.hitPoints -= points;
            console.log('- hitPoints: ', this.hitPoints);
            
        },
        hates: function (playerId) {
            return this.hatelist.forEach(function (value, idx) {
               return  value.id === playerId;
            });
            
        },
        increaseHateFor: function (playerId, points) {
            var player = this.hates(playerId);
            
            if (player) {
                player.hate += points;
            }
            else {
                this.hatelist.push({ id: playerId, hate: points });
            }
            console.log('--> Hatelist : ', this.id);
            this.hatelist.forEach(function (value, idx) {
                console.log('- ' + value.id + ' : ' + value.hate);
            });

//            if (this.returnTimeout) {
//                // Prevent the mob from returning to its spawning position
//                // since it has aggroed a new player
//                clearTimeout(this.returnTimeout);
//                this.returnTimeout = null;
//            }
        },
        getHatedPlayerId: function (hateRank) {
            var i, playerId,
                sorted = this.hatelist.sort(function (a, b) {
                    if (a.hate > b.hate) return 1;
                    if (b.hate > a.hate) return -1;
                    return 0;
                }),
                size = this.hatelist.length;
            
            console.log('- sorted hatelist: ', sorted);
            
            if (hateRank && hateRank <= size) {
                i = size - hateRank;
            } else {
                i = size - 1;
            }
            if (sorted && sorted[i]) {
                playerId = sorted[i].id;
            }

            return playerId;
        },
     
     });
    
    return monster;
});