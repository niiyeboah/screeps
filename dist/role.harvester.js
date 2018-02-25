const util = require('util');
const roleHarvester = {
    run: function(creep, source) {
        if (creep.memory.transferring && creep.carry.energy == 0) {
            creep.memory.transferring = false;
        }
        if (!creep.memory.transferring && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transferring = true;
        }
        if (creep.memory.transferring) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: s => {
                    let structures = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];
                    return structures.indexOf(s.structureType) > -1 && s.energy < s.energyCapacity;
                }
            });
            if (targets.length) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleBuilder.run(creep, source);
            }
        } else {
            util.harvestSource(creep, source);
        }
    }
};

module.exports = roleHarvester;
