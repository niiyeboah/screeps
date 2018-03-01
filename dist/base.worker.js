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
        this.logError(() => {
            let memorySource = Game.getObjectById(this.memory.sourceId);
            if (Memory.droppedId) {
                memorySource = Game.getObjectById(Memory.droppedId);
                if (this.pickup(memorySource) === ERR_NOT_IN_RANGE) {
                    this.tryMoveTo(memorySource);
                }
            } else {
                if (!memorySource || memorySource.energy === 0) {
                    memorySource = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                    this.memory.sourceId = memorySource.id;
                    this.memory.path = this.pos.findPathTo(memorySource);
                }
                if (this.harvest(memorySource) === ERR_NOT_IN_RANGE) {
                    this.tryMoveTo(memorySource);
                }
            }
        });
    }
    roomUpgrade() {
        this.logError(() => {
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
        const move = this.moveByPath(this.memory.path);
        let prevPos = false;
        let pathBlocked = false;

        if (this.memory.x && this.memory.y) {
            prevPos = this.room.getPositionAt(this.memory.x, this.memory.y);
        }

        if (prevPos && typeof this.memory.move !== 'undefined') {
            pathBlocked = this.memory.move === OK && prevPos.getRangeTo(this.pos) === 0;
        }

        this.memory.move = move;
        this.memory.x = this.pos.x;
        this.memory.y = this.pos.y;

        if (pathBlocked || move === ERR_NOT_FOUND || move === ERR_INVALID_ARGS) {
            this.memory.path = this.pos.findPathTo(location);
        } else if (move === ERR_NO_BODYPART) {
            this.suicide();
        } else if (location.room.name !== this.room.name) {
            this.moveTo(location);
            this.memory.path = false;
        }
    }
    /**
     * @description
     * Reset state and log error.
     * @param {function} fn
     */
    logError(fn) {
        try {
            fn();
        } catch (e) {
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
     * Scale up body according to energy capacity if at least one harvester is present.
     * @param {StructureSpawn} spawn
     */
    static BODY(spawn) {
        const baseCost = 200;
        const baseBody = [WORK, CARRY, MOVE];
        const numHarvesters = _.sum(Game.creeps, creep => creep.memory.role === 'harvester');
        const energyCapacity = spawn.room.energyCapacityAvailable;

        let energy = energyCapacity - baseCost;
        let body = baseBody;

        if (numHarvesters > 0) {
            while (energy >= baseCost) {
                body = body.concat(baseBody);
                energy -= baseCost;
            }
        }

        return body;
    }
}

module.exports = Worker;
