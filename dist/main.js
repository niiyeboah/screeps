const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const tower = require('structure.tower');
const util = require('util');

module.exports.loop = function() {
    const spawn = Game.spawns['Spawn1'];
    const body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];

    util.clearMemory();

    util.spawn(
        spawn,
        {
            harvester: 4,
            upgrader: 4,
            repairer: 4,
            builder: 4
        },
        body
    );

    util.info(spawn);

    tower();

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        const { role } = creep.memory;
        if (role == 'harvester') roleHarvester.run(creep, 0);
        if (role == 'upgrader') roleUpgrader.run(creep, 0);
        if (role == 'builder') roleBuilder.run(creep, 0);
    }
};
