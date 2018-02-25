const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const util = require('util');

module.exports.loop = function() {
    const spawn = Game.spawns['Spawn1'];
    const sources = spawn.room.find(FIND_SOURCES);
    const body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];

    util.clearMemory();

    util.spawn(
        spawn,
        {
            harvester: 5,
            upgrader: 5,
            repairer: 5,
            builder: 5
        },
        body
    );

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        const { role } = creep.memory;
        if (role == 'harvester') roleHarvester.run(creep, sources[0]);
        if (role == 'upgrader') roleUpgrader.run(creep, sources[0]);
        if (role == 'builder') roleBuilder.run(creep, sources[1]);
        if (role == 'repairer') roleRepairer.run(creep, sources[1]);
    }
};
