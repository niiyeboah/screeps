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
    static get BODY() {
        /**
         * TOUGH  | 7
         * MOVE   | 5
         * ATTACK | 6
         */
        return [
            ...[TOUGH, TOUGH, TOUGH],
            ...[TOUGH, TOUGH, TOUGH],
            ...[TOUGH, MOVE, ATTACK],
            ...[MOVE, ATTACK, MOVE],
            ...[ATTACK, MOVE, ATTACK],
            ...[ATTACK, MOVE, ATTACK]
        ];
    }
}

module.exports = Gaurd;
