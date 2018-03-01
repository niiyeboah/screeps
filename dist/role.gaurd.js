const Worker = require('./base.worker');

/**
 * @description
 * Gaurd role.
 * TODO: default to healer.
 */
class Gaurd extends Worker {
    constructor(creep) {
        super(creep);
        this.work = this.gaurd;
    }
    gaurd() {
        const controller = this.room.controller;
        const target = Game.getObjectById(Memory.hostileId);
        if (target) this.perform('attack', target);
        else if (this.pos.getRangeTo(controller) > 1) this.tryMoveTo(controller);
    }
    static BODY(spawn) {
        const baseCost = 150;
        const baseBody = [TOUGH, TOUGH, MOVE, ATTACK];
        const energyCapacity = spawn.room.energyCapacityAvailable;

        let energy = energyCapacity - baseCost;
        let body = baseBody;
        while (energy >= baseCost) {
            body = body.concat(baseBody);
            energy -= baseCost;
        }

        return body;
    }
}

module.exports = Gaurd;
