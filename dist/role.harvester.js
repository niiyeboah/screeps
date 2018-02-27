const Worker = require('./base.worker');

/**
 * @description
 * Harvester role which defaults to Upgrader.
 */
class Harvester extends Worker {
    constructor(creep) {
        super(creep);
        this.work = this.transferEnergy;
    }
    transferEnergy() {
        this.resetOnError(() => {
            this.update();
            if (this.memory.working) {
                const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => {
                        const types = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION];
                        return types.indexOf(s.structureType) > -1 && s.energy < s.energyCapacity;
                    }
                });
                if (target) this.perform('transfer', target);
                else this.roomUpgrade();
            } else {
                this.harvestEnergy();
            }
        });
    }
}

module.exports = Harvester;
