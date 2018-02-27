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
        this.logError(() => {
            this.update();
            if (this.memory.working) {
                const target = Game.getObjectById(Memory.repairSiteId);
                if (target) this.perform('repair', target);
                else this.buildStructures();
            } else {
                this.harvestEnergy();
            }
        });
    }
    buildStructures() {
        this.logError(() => {
            this.update();
            if (this.memory.working) {
                const target = Game.getObjectById(Memory.constructionSiteId);
                if (target) this.perform('build', target);
                else this.roomUpgrade();
            } else {
                this.harvestEnergy();
            }
        });
    }
}

module.exports = Builder;
