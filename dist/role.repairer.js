const roleBuilder = require('./role.builder');
const roleRepairer = {
    run: function(creep, source) {
        if (creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }
        if (creep.memory.repairing) {
            var targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
            });
            if (targets.length) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
                }
            }
        } else {
            roleBuilder.run(creep, source);
        }
    }
};

module.exports = roleRepairer;
