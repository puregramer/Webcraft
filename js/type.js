/*
    file name : type.js
    description : type object
	create date : 2017-08-23
	creator : saltgamer
*/
define([],
	function () {
	'use strict';
    var type = {
        Orientations: {
            UP: 1,
            DOWN: 2,
            LEFT: 3,
            RIGHT: 4
        },
        getOrientationAsString: function (orientation) {
            switch(orientation) {
                case this.Orientations.LEFT: return "left"; break;
                case this.Orientations.RIGHT: return "right"; break;
                case this.Orientations.UP: return "up"; break;
                case this.Orientations.DOWN: return "down"; break;
            } 
        },
        Messages: {
            
        },
        Entities: {
            HERO: 1,
            // monster
            ORC: 2
            
            
        }
    };
    return type;
});