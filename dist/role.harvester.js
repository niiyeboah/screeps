const Worker = require('./class.worker');

class Harvester extends Worker {
    constructor(creep) {
        super(creep);
    }
    work() {
        this.resetOnError(() => {
            this.update();
            if (this.working) {
                const target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => {
                        const types = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_TOWER];
                        return types.indexOf(s.structureType) > -1 && s.energy < s.energyCapacity;
                    }
                });
                if (target) {
                    if (this.target !== target || this.path === null) {
                        this.path = this.pos.findPathTo(this.target);
                    }
                    if (this.pos.getRangeTo(this.source) > 1) this.moveByPath(this.path);
                    else this.transfer(this.target);
                } else {
                    this.upgrade();
                }
            } else {
                this.harvest();
            }
        });
    }
}

module.exports = Harvester;
