/*
    file name : spriteData.js
    description : spriteData object
		create date : 2017-07-21
		creator : saltgamer
*/
define([],
    function() {
        'use strict';

        var spriteData = {
            orc: {
                id: 'orc',
                name: 'orc',
                width: 75,
                height: 65,
                animations: {
                    atk_right: {
                        length: 4,
                        row: 0
                    },
                    walk_right: {
                        length: 5,
                        row: 1
                    },
                    idle_right: {
                        length: 4,
                        row: 2
                    },
                    atk_up: {
                        length: 4,
                        row: 3
                    },
                    walk_up: {
                        length: 5,
                        row: 4
                    },
                    idle_up: {
                        length: 4,
                        row: 5
                    },
                    atk_down: {
                        length: 4,
                        row: 6
                    },
                    walk_down: {
                        length: 5,
                        row: 7
                    },
                    idle_down: {
                        length: 4,
                        row: 8
                    }
                },
                offset_x: -24,
                offset_y: -24,
                filePath: './images/orcSprite.png'
            },
            orc_death: {
                id: 'orc_death',
                name: 'orc_death',
                width: 75,
                height: 65,
                animations: {
                    death: {
                        length: 6,
                        row: 0
                    }
                },
                offset_x: -14,
                offset_y: -14,
                filePath: './images/orc_death.png'
            },
            knight: {
                id: 'knight',
                name: 'knight',
                width: 75,
                height: 65,
                animations: {
                    atk_right: {
                        length: 4,
                        row: 0
                    },
                    walk_right: {
                        length: 5,
                        row: 1
                    },
                    idle_right: {
                        length: 4,
                        row: 2
                    },
                    atk_up: {
                        length: 4,
                        row: 3
                    },
                    walk_up: {
                        length: 5,
                        row: 4
                    },
                    idle_up: {
                        length: 4,
                        row: 5
                    },
                    atk_down: {
                        length: 4,
                        row: 6
                    },
                    walk_down: {
                        length: 5,
                        row: 7
                    },
                    idle_down: {
                        length: 4,
                        row: 8
                    }
                },
                offset_x: -24,
                offset_y: -24,
                filePath: './images/knightSprite.png'
            },
            knight_death: {
                id: 'knight_death',
                name: 'knight_death',
                width: 75,
                height: 65,
                animations: {
                    death: {
                        length: 6,
                        row: 0
                    }
                },
                offset_x: -14,
                offset_y: -14,
                filePath: './images/knight_death.png'
            }

        };

        return spriteData;
    });
