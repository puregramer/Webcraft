/*
    file name : entityFactory.js
    description : element object
	create date : 2017-09-06
	creator : saltgamer

*/
define(['type', 'hero', 'monsterFactory'],
	function (type, Hero, MonsterFactory) {
	'use strict';
        var entityFactory = {
            builders: [],
            createEntity: function (kind, id, name) {
                if (!kind) {
                    console.log('[!] undefined kind');
                    return;
                }   

                return entityFactory.builders[kind](id, name);
            }

        };
        
        entityFactory.builders[type.Entities.HERO] = function (id, name) {
            return new Hero(id, name);
        };

        entityFactory.builders[type.Entities.ORC] = function (id, name) {
            return new MonsterFactory.ORC(id, name);
        };


    

    return entityFactory;
    
});