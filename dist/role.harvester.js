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
        this.logError(() => {
            this.update();
            if (this.memory.working) {
                let target = false;
                const hostile = Game.getObjectById(Memory.hostileId);
                if (hostile) {
                    const towers = this.room.find(FIND_STRUCTURES, {
                        filter: s => {
                            s.structureType === STRUCTURE_TOWER && s.energy < s.energyCapacity;
                        }
                    });
                    if (towers.length) target = towers[0];
                }
                if (!target) {
                    target = this.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: s => {
                            const types = [STRUCTURE_SPAWN, STRUCTURE_EXTENSION];
                            return (
                                types.indexOf(s.structureType) > -1 && s.energy < s.energyCapacity
                            );
                        }
                    });
                }
                if (target) this.perform('transfer', target);
                else this.roomUpgrade();
            } else {
                this.harvestEnergy();
            }
        });
    }
}

module.exports = Harvester;
