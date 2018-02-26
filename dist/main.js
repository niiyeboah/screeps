const roleHarvester = require('role.harvester');
const roleGaurd = require('role.gaurd');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const util = require('util');

module.exports.loop = function() {
    const spawn = Game.spawns['Spawn1'];
    const body = [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];

    util.clearMemory();

    util.spawn(
        spawn,
        {
            harvester: 5,
            gaurd: 3,
            upgrader: 5,
            repairer: 2,
            builder: 5
        },
        body
    );

    for (let name in Game.creeps) {
        const creep = Game.creeps[name];
        const { role } = creep.memory;
        if (role == 'harvester') roleHarvester.run(creep);
        if (role == 'gaurd') roleGaurd.run(creep);
        if (role == 'upgrader') roleUpgrader.run(creep);
        if (role == 'builder') roleBuilder.run(creep);
        if (role == 'repairer') roleRepairer.run(creep);
    }
};
