const base = require('./role.base');

module.exports = {
    run: function(creeps) {
        const roleExists = role => {
            try {
                require('roles.' + role);
                return true;
            } catch (e) {
                return false;
            }
        };
        const getRole = role => {
            if (!this.roleExists(role)) return false;

            var proto = require('role_prototype');

            var roleObject = require('roles_' + role);
            roleObject = require('extend')(roleObject, proto);
            return roleObject;
        };

        for (let creep of creeps) {
            const role = creep.memory.role;
            if (roleExists(role)) role = roleManager.getRole(role);

            var role = Object.create(role);
            role.setCreep(creep);
            try {
                role.run();
            } catch (e) {
                console.log(e.message);
            }
        }
    },
    getRoleBodyParts: function(role) {
        if (!this.roleExists(role)) return false;

        var role = this.getRole(role);

        if (role.getParts !== undefined) return role.getParts.call(role);
        else return role.prototype.getParts.call(role);
    }
};
