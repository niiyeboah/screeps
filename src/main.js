const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const util = require('util');

module.exports.loop = function() {
    const spawn = Game.spawns['Spawn1'];
    const sources = spawn.room.find(FIND_SOURCES);
    const body = [WORK, CARRY, MOVE, MOVE];

    util.clearMemory();

    util.spawn(
        spawn,
        {
            harvester: 4,
            upgrader: 2,
            repairer: 4,
            builder: 4
        },
        body
    );

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        const { role } = creep.memory;
        if (role == 'harvester') roleHarvester.run(creep, sources[0]);
        if (role == 'upgrader') roleUpgrader.run(creep, sources[0]);
        if (role == 'builder') roleBuilder.run(creep, sources[0]);
        if (role == 'repairer') roleRepairer.run(creep, sources[0]);
    }
};
