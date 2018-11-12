module.exports = {
    run: function(tower) {
        var minDMG = 10000;
        var damagedStructures = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                    return(structure.hits < minDMG)
                }
                else {
                    return(structure.hits < structure.hitsMax)
                }
            }
        });
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile != null) {
            tower.attack(closestHostile);
        }
        else if(damagedStructures.length > 0) {
            damagedStructures.sort(function(a, b) {
                return a.hits - b.hits
            });
            tower.repair(damagedStructures[0]);
        }
    }
}