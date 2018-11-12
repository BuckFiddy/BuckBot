module.exports = {
    run: function(creep) {
        var home = Game.spawns.Spawn1.pos;
        if(Game.flags.invade){
            var targetRoom = Game.flags.invade.pos;
        }
        var targetCreep = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        var targetSpawn = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if(targetCreep) {
            if(creep.attack(targetCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetCreep);
            }
        }
        else if(targetSpawn) {
            if(creep.attack(targetSpawn) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targetSpawn);
            }
        }
        else if(targetRoom) {
            creep.moveTo(targetRoom);
        }
        else {
            creep.moveTo(home);
        }
    }
};