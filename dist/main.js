const CreepManager = require('./creep.manager');
const tower = require('./structure.tower');
const util = require('util');

module.exports.loop = function() {
    const spawn = Game.spawns['Spawn1'];
    const creepManager = new CreepManager(spawn);

    util.clearMemory();

    tower(spawn);

    creepManager.run();

    util.info(spawn);
};
