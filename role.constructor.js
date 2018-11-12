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
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            var damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL });
            
            creep.depositEnergy(true);

            if (constructionSite) {
                if(creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } 
            else if (damagedStructure) {
                if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructure);
                }
            } 
        }
    }
}  