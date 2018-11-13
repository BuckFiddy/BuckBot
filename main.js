require('prototype.creep');
require('prototype.tower');
require('prototype.spawn');
require('prototype.room');

module.exports.loop = function () {

    // Clear memory of unused names
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    // Run roles
    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }

    // Run towers
    var towers = _.filter(Game.structures, (s) => s.structureType == STRUCTURE_TOWER);
    for(let tower of towers) {
        tower.defend();
    }

    // Get available mining positions
    for (let spawnName in Game.spawns) {
        if (Game.spawns[spawnName].room.memory.availableMiningPositions == undefined){
            Game.spawns[spawnName].room.getAvailableMiningPositions(Game.spawns[spawnName].room, Game.spawns[spawnName]);
        }     
    }

    // Spawn creeps
    for (let spawnName in Game.spawns) {
        Game.spawns[spawnName].spawnCreepWhenNeeded();
    }

};