module.exports = {
    run: function(creep) {

        // Determine state based on conditions
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        // Do stuff based on state
        if (creep.memory.working == false) {
            creep.getEnergy(true, true, false);
        }
        else {
            let spawn = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN) && (s.energy < s.energyCapacity)});
            let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            let damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL });

            if (spawn) {
                creep.depositEnergy(true);
            }
            else if (constructionSite) {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            }
            else if (damagedStructure) {
                if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructure);
                }
            }
            else {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
}  