module.exports = {
    run: function(creep) {
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == false) {
            creep.getEnergy(true, false, true);
        }
        else {
            if (creep.pos.inRangeTo(creep.room.controller, 2)) {
                creep.upgradeController(creep.room.controller);
            } 
            else {
                if (creep.moveTo(creep.room.controller) == ERR_NO_PATH && creep.pos.inRangeTo(creep.room.controller, 3)){
                    creep.upgradeController(creep.room.controller);
                }
            }
            /*
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            */
        }
    }
}