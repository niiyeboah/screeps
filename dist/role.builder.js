const roleUpgrader = require('./role.upgrader');
const util = require('util');
const roleBuilder = {
    run: function(creep, source) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        if (creep.memory.building) {
            var targets = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            util.harvestSource(creep, source);
        }
    }
};

module.exports = roleBuilder;