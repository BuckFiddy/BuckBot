var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if(creep.memory.working == false) {
            creep.getEnergy(true, false, false);
        }
        else {
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            if(constructionSite) {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else {
                roleUpgrader.run(creep);
            }
        }
    }
};