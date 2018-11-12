var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {

        // Switch state depending on conditions
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        // Do stuff based on state
        if(creep.memory.working == false) {
            creep.getEnergy(true, false, false);
        }
        else {
            var damagedStructure = creep.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL });

            if (damagedStructure) {
                if (creep.repair(damagedStructure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(damagedStructure);
                }
            }
            else {
                roleBuilder.run(creep);
            }
        }

            /*
            var minDMG = 10000;
            var damagedStructures = creep.room.find(FIND_STRUCTURES, {
                filter: (s) =>
                {
                    if(s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART) {
                        return(s.hits < minDMG)
                    }
                    else if (s.structureType == STRUCTURE_ROAD) {
                        return(s.hits < s.hitsMax * 0.75)
                    }
                    else {
                        return(s.hits < s.hitsMax * 0.95)
                    }
                }
            });

            if(damagedStructures.length > 0) {

                // Sort damamged structures
                damagedStructures.sort(function(a, b) { return a.hits - b.hits });
                console.log(creep.room.memory.damagedStructure);

                if (creep.room.memory.damagedStructure || creep.room.memory.damagedStructure.hits == creep.room.memory.damagedStructure.hitsMax) {
                    creep.room.memory.damagedStructure = damagedStructures[0];
                    if(creep.repair(creep.room.memory.damagedStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.memory.damagedStructure);
                    } 
                }
                else {                
                    if (creep.repair(creep.room.memory.damagedStructure) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.memory.damagedStructure);
                    }
                }
            }
            else {
                roleBuilder.run(creep);
            }
            */
    }
}