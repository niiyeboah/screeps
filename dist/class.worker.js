class Worker extends Creep {
    constructor(creeo) {
        super(creep.id);
        this.working = this.memory.working = false;
        this.source = this.memory.source = null;
        this.target = this.memory.target = null;
        this.path = this.memory.path = null;
        this.energy = this.carry.energy;
        this.work = this.update;
    }
    update() {
        if (this.working && this.energy === 0) {
            this.working = false;
            this.source = null;
            this.path = null;
        }
        if (!this.working && this.energy === this.carryCapacity) {
            this.working = true;
            this.target = null;
            this.path = null;
        }
    }
    harvest() {
        this.resetOnError(() => {
            if (this.source === null) {
                this.source = this.creep.pos.findClosestByRange(FIND_SOURCES);
                this.path = this.pos.findPathTo(this.source);
            }
            if (this.pos.getRangeTo(this.source) > 1) this.moveByPath(this.path);
            else this.harvest(this.source);
        });
    }
    upgrade() {
        this.resetOnError(() => {
            this.update();
            if (this.working) {
                if (this.path === null) {
                    this.path = this.room.findPath(this.pos, this.room.controller.pos);
                }
                if (this.pos.getRangeTo(this.source) > 3) this.moveByPath(this.path);
                else this.upgradeController(this.room.controller);
            } else {
                this.harvest();
            }
        });
    }
    resetOnError(fn) {
        try {
            fn();
        } catch (e) {
            this.source = null;
            this.target = null;
            this.path = null;
            console.log(e.message);
        }
    }
}

module.exports = Worker;
