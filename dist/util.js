module.exports = {
    spawn: function(spawn, roleMininums, body) {
        const minHarvesters = roleMininums.harvester;
        const minUpgraders = roleMininums.upgrader;
        const minBuilders = roleMininums.builder;
        const minRepairers = roleMininums.repairer;
        const numHarvesters = _.sum(Game.creeps, creep => creep.memory.role == 'harvester');
        const numUpgraders = _.sum(Game.creeps, creep => creep.memory.role == 'upgrader');
        const numBuilders = _.sum(Game.creeps, creep => creep.memory.role == 'builder');
        const numRepairers = _.sum(Game.creeps, creep => creep.memory.role == 'repairer');
        const spawnCreep = role => {
            spawn.spawnCreep(body, `${role}|${body.length}|${Game.time}`, {
                memory: { role }
            });
        };
        if (numHarvesters < minHarvesters) spawnCreep('harvester');
        else if (numUpgraders < minUpgraders) spawnCreep('upgrader');
        else if (numRepairers < minRepairers) spawnCreep('repairer');
        else spawnCreep('builder');
    },
    info: function(spawn) {
        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text('🛠️' + spawningCreep.memory.role, spawn.pos.x, spawn.pos.y - 1, {
                align: 'top',
                opacity: 0.8
            });
        }
    },
    clearMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    },
    harvestSource: function(creep, source) {
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
        if (droppedEnergy.length) {
            if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
        } else {
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};
