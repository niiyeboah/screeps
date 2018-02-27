/**
 * @param {StructureSpawn} spawn
 */
module.exports = function(spawn) {
    const towers = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_TOWER
    });
    if (towers.length) {
        for (let tower of towers) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
};
