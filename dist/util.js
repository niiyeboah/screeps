module.exports = {
    spawn: function(spawn, roleMininums, defaultBody) {
        const gaurdBody = [TOUGH, TOUGH, TOUGH, WORK, CARRY, MOVE, ATTACK, ATTACK, ATTACK, ATTACK];

        const numHarvesters = _.sum(Game.creeps, creep => creep.memory.role == 'harvester');
        const numGaurds = _.sum(Game.creeps, creep => creep.memory.role == 'gaurd');
        const numUpgraders = _.sum(Game.creeps, creep => creep.memory.role == 'upgrader');
        const numBuilders = _.sum(Game.creeps, creep => creep.memory.role == 'builder');
        const numRepairers = _.sum(Game.creeps, creep => creep.memory.role == 'repairer');

        const spawnCreep = (role, body) => {
            spawn.spawnCreep(body, `${role} | ${body.length} | ${Game.time}`, {
                memory: { role }
            });
        };

        if (numHarvesters < roleMininums.harvester) spawnCreep('harvester', defaultBody);
        else if (numGaurds < roleMininums.gaurd) spawnCreep('gaurd', gaurdBody);
        else if (numUpgraders < roleMininums.upgrader) spawnCreep('upgrader', defaultBody);
        else if (numBuilders < roleMininums.builder) spawnCreep('builder', defaultBody);
        else if (numRepairers < roleMininums.repairer) spawnCreep('repairer', defaultBody);
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
    harvestSource: function(creep) {
        var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES);
        if (droppedEnergy.length) {
            if (creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(droppedEnergy[0]);
            }
        } else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};
