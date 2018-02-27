const Harvester = require('./role.harvester');
const Upgrader = require('./base.worker');
const Gaurd = require('./role.gaurd');
const Builder = require('./role.builder');

class CreepManager {
    /**
     * @param {StructureSpawn} spawn
     */
    constructor(spawn) {
        this.spawn = spawn;
        /**
         * @property {Object} roles
         * @description
         * List of roles and minimum counts.
         * Order of roles dictates the hierarchy of importance and spawning.
         */
        this.roles = {
            harvester: { min: 5, class: Harvester },
            upgrader: { min: 5, class: Upgrader },
            gaurd: { min: 3, class: Gaurd },
            builder: { min: 2, class: Builder }
        };
    }
    run() {
        const creeps = Game.creeps;
        const room = this.spawn.room;
        const dropped = room.find(FIND_DROPPED_RESOURCES);
        const hostile = room.find(FIND_HOSTILE_CREEPS);
        const constructionSite = room.find(FIND_CONSTRUCTION_SITES);
        const repairSite = room.find(FIND_STRUCTURES, {
            filter: s => s.hits < s.hitsMax / 2 && s.structureType != STRUCTURE_WALL
        });

        if (dropped.length) Memory.droppedId = dropped[0].id;
        else Memory.droppedId = false;

        if (hostile.length) Memory.hostileId = hostile[0].id;
        else Memory.hostileId = false;

        if (constructionSite.length) Memory.constructionSiteId = constructionSite[0].id;
        else Memory.constructionSiteId = false;

        if (repairSite.length) Memory.repairSiteId = repairSite[0].id;
        else Memory.repairSiteId = false;

        this.respawn();

        // Extend creep with role class and then do work.
        for (let name in creeps) {
            let creep = creeps[name];
            if (!creep.spawning) {
                const role = creep.memory.role;
                const roleClass = this.roles[role].class;
                creep = new roleClass(creep);
                creep.work();
            }
        }
    }
    /**
     * @description
     * Respawns creep if below minimum.
     * Follows role hierarchy.
     */
    respawn() {
        for (let role in this.roles) {
            if (this.creepCount(role) < this.roles[role].min) {
                this.spawnCreep(role);
                break;
            }
        }
    }
    /**
     * @param {String} role
     */
    spawnCreep(role) {
        const body = this.roles[role].class.BODY;
        this.spawn.spawnCreep(body, `${role} | ${body.length} | ${Game.time}`, {
            memory: { role }
        });
    }
    /**
     * @param {String} role
     */
    creepCount(role) {
        return _.sum(Game.creeps, creep => creep.memory.role === role);
    }
}

module.exports = CreepManager;
