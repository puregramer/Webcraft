/*
    file name : game.js
    description : AMD starting point
		create date : 2017-10-23
		creator : saltgamer
*/

'use strict';

require.config({
    baseUrl: './js',
    shim: {
        class: {
            deps: [],
                exports: 'Class'
        },
        $alt: {
            deps: [],
            exports: '$alt'
        }

    },
    paths: {
        class: '../libs/class',
        $core: '$core',
        $alt: '$alt',
        animation: 'animation',
        loading: 'loading',
        imageLoader: 'imageLoader',
        notice: 'notice',
        scene: 'scene',
        world: 'world',
        map: 'map',
        renderer: 'renderer',
        camera: 'camera',
        timer: 'timer',
        transition: 'transition',
        pathfinder: 'pathfinder',
        entitiy: 'entity',
        character: 'character',
        player: 'player',
        hero: 'hero',
        type: 'type',
        sprite: 'sprite',
        spriteData: 'spriteData',
        monster: 'monster',
        selector: 'selector',
        spawn: 'spawn',
        formula: 'formula',
        area: 'area',
        sound: 'sound'

    }
});

require([
    '$core',
    'imageLoader',
    'scene',
    'updater',
    'renderer',
    'hero',
    'sprite',
    'spriteData',
    'selector'

], function(
    $core,
    imageLoader,
    scene,
    Updater,
    Renderer,
    Hero,
    Sprite,
    spriteData,
    selector

) {
    console.log('--> start WEBCRAFT ... ');
    $alt.initRequestAnimationFrame();

    imageLoader.load([
        './images/mapSprite.png',
        './images/orcSprite.png',
        './images/orc_death.png',
				'./images/knightSprite.png',
				'./images/knight_death.png'
    ]);
    imageLoader.onReady(function() {
        console.log('--> image resource loaded!');

        scene.init();

        var updater = new Updater();
        $core.updater = updater;

        var renderer = new Renderer();
        $core.renderer = renderer;

        $core.initEntityGrid();
        $core.initPathingGrid();
        $core.initRenderingGrid();

        console.log('1-> $core: ', $core);

        var player = new Hero('player', 'knight', 1);
        // $core.player = player;
        player.setSprite(new Sprite(spriteData[player.getSpriteName()]));
        player.idle();

        // console.log('-> $core: ', $core);
        selector.selectPlayer(player);
        scene.start({
            id: 'player_knight',
            name: 'drakle',
            x: 10,
            y: 10,
            hp: 100,
            callBack: function() {
                $core.gameStarted = true;
                $core.tick();
            }
        });

        selector.init();


    });


});
