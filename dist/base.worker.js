/**
 * @description
 * Creep base class and Upgrader role.
 */
class Worker extends Creep {
    constructor(creep) {
        super(creep.id);
        this.work = this.roomUpgrade;
    }
    update() {
        if (this.memory.working && this.carry.energy === 0) {
            this.memory.working = false;
            this.memory.sourceId = false;
            this.memory.path = false;
        }
        if (!this.memory.working && this.carry.energy === this.carryCapacity) {
            this.memory.working = true;
            this.memory.targetId = false;
            this.memory.path = false;
        }
    }
    perform(action, target) {
        if (this.memory.targetId !== target.id || !this.memory.targetId) {
            this.memory.targetId = target.id;
            this.memory.path = this.pos.findPathTo(target);
        }
        const memoryTarget = Game.getObjectById(this.memory.targetId);
        if (this[action](memoryTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            this.tryMoveTo(memoryTarget);
        }
    }
    harvestEnergy() {
        this.resetOnError(() => {
            let memorySource = Game.getObjectById(this.memory.sourceId);
            if (!memorySource || memorySource.energy === 0) {
                memorySource = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                this.memory.sourceId = memorySource.id;
                this.memory.path = this.pos.findPathTo(memorySource);
            }
            if (this.harvest(memorySource) === ERR_NOT_IN_RANGE) {
                this.tryMoveTo(memorySource);
            }
        });
    }
    roomUpgrade() {
        this.resetOnError(() => {
            this.update();
            if (this.memory.working) {
                this.perform('upgradeController', this.room.controller);
            } else {
                this.harvestEnergy();
            }
        });
    }
    /**
     * @description
     * Attempt move or reset path.
     * @param {RoomPosition} location
     */
    tryMoveTo(location) {
        const currentPos = this.pos;
        const move = this.moveByPath(this.memory.path) !== OK;
        if (move !== OK || currentPos.getRangeTo(this.pos) === 0) {
            this.memory.path = this.pos.findPathTo(location);
        }
    }
    /**
     * @description
     * Reset state and log error.
     * @param {function} fn
     */
    resetOnError(fn) {
        try {
            fn();
        } catch (e) {
            this.memory.sourceId = false;
            this.memory.targetId = false;
            this.memory.path = false;
            console.log(`${this.name} | ERROR: ${e.message}`);
        }
    }
    logStatus() {
        if (Game.time % 5 === 0) {
            let status = `${this.name} is `;
            if (this.memory.role === 'gaurd') status += this.work.name;
            else status += this.memory.working ? this.work.name : this.harvestEnergy.name;
            console.log(status);
        }
    }
    /**
     * @description
     * Shuffled body to allow creep to perfrom action when damaged.
     */
    static get BODY() {
        /**
         * WORK  | 4
         * MOVE  | 4
         * CARRY | 4
         */
        return [
            ...[WORK, CARRY, MOVE],
            ...[WORK, CARRY, MOVE],
            ...[WORK, CARRY, MOVE],
            ...[WORK, CARRY, MOVE]
        ];
    }
}

module.exports = Worker;
