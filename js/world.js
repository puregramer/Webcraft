/*
    file name : world.js
    description : world object
	create date : 2017-09-08
	creator : saltgamer
*/
define(['type'],
	function (type) {
	'use strict';
    var world = {
        map: [
            { mapTileCol: 50, mapTileRow: 50, tileWidth: 32, tileHeight: 32, mapData: [] }
        ],
        moster: [
            {id: 'orc1', spriteName: 'orc', kind: type.Entities.ORC, name: 'Orc Fighter1', x: 5, y: 5, orientation: type.Orientations.DOWN},
            {id: 'orc2', spriteName: 'orc', kind: type.Entities.ORC, name: 'Orc Fighter2', x: 3, y: 3, orientation: type.Orientations.DOWN}
        ]
      
    };
    return world;
});