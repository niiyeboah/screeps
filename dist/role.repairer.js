const roleBuilder = require('./role.builder');
const util = require('util');
const roleRepairer = {
    run: function(creep, source) {
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
        }
        if (creep.memory.repairing) {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax / 2 && s.structureType != STRUCTURE_WALL
            });
            if (target) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                roleBuilder.run(creep);
            }
        } else {
            util.harvestSource(creep, source);
        }
    }
};

module.exports = roleRepairer;
