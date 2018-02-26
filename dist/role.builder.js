const roleUpgrader = require('./role.upgrader');
const util = require('util');
const roleBuilder = {
    run: function(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        if (creep.memory.building) {
            var target = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            util.harvestSource(creep);
        }
    }
};

module.exports = roleBuilder;
