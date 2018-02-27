module.exports = {
    info: function(spawn) {
        if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x - 2,
                spawn.pos.y - 2,
                {
                    align: 'top',
                    opacity: 0.8
                }
            );
        }
    },
    clearMemory: function() {
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
            }
        }
    }
};
