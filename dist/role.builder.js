const Worker = require('./base.worker');

/**
 * @description
 * Builder/Repairer role which defaults to Upgrader.
 */
class Builder extends Worker {
    constructor(creep) {
        super(creep);
        this.work = this.repairStructures;
    }
    repairStructures() {
        this.resetOnError(() => {
            this.update();
            if (this.memory.working) {
                const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => s.hits < s.hitsMax / 2 && s.structureType != STRUCTURE_WALL
                });
                if (target) this.perform('repair', target);
                else this.buildStructures();
            } else {
                this.harvestEnergy();
            }
        });
    }
    buildStructures() {
        this.resetOnError(() => {
            this.update();
            if (this.memory.working) {
                const target = this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if (target) this.perform('build', target);
                else this.roomUpgrade();
            } else {
                this.harvestEnergy();
            }
        });
    }
}

module.exports = Builder;
