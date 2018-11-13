var roleList = [ 
    'builder',
    'constructor',
    'invader',
    'harvester',
    'repairer',
    'transporter',
    'upgrader'
];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepWhenNeeded = function () {
    let room = this.room;
    let creepsInRoom = room.find(FIND_MY_CREEPS);
    let maxEnergy = room.energyCapacityAvailable;
    let numSources = room.find(FIND_SOURCES).length;
    let containers = room.find(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
    let name = undefined;
    let minEnergyForHarvester = 550;
    let totalCreeps = {};

    let minCreeps = {
        'transporter': numSources + 1,
        'repairer': room.controller.level,
        'builder': 0,
        'upgrader': 0
    };

    // Set distant rooms to mine from here:
    let minDistanceHarvesters = {

    };

    // These are for when shit hits the fan. Constructor is a jack of all trades creep to either start a room or to save one from a wipe
    // minEnergyForTransporter is for a CARRY, CARRY, MOVE creep
    // minEnergyForConstructor is for a WORK, CARRY, MOVE creep with a little margin for error
    let minEnergyForTransporter = 150;
    let minEnergyForConstructor = 225;
    
    for (let role of roleList) {
        totalCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
    }

    // Check transporter count to ensure colony survival
    if (totalCreeps['constructor'] < room.memory.availableMiningPositions){
        if (totalCreeps['harvester'] > 0 && totalCreeps['transporter'] == 0){
            name = this.createTransporter(maxEnergy);
        }
        else if (totalCreeps['harvester'] < numSources && containers.length > 0) {
            let sources = room.find(FIND_SOURCES);
            for (let source of sources) {
                if (!_.some(creepsInRoom, (c) => c.memory.role == 'harvester' && c.memory.sourceId == source.id)) {
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                    if (containers.length > 0) {
                        name = this.createHarvester(source.id);
                        break;
                    }
                }
            }
        }
        else {
            name = this.createCustomCreep(room.energyAvailable, 'constructor');
        }
    }

    /*
    if (room.controller.level == 1 || room.energyAvailable <= minEnergyForConstructor) {
        if ((totalCreeps['harvester'] > 0) && (totalCreeps['transporter'] == 0) && (room.energyAvailable >= minEnergyForTransporter)) {
            name = this.createTransporter(minEnergyForTransporter);
        }
        else {
            if (totalCreeps['constructor'] <= room.memory.availableMiningPositions){
                name = this.createCustomCreep(room.energyAvailable, 'constructor');                
            }
        }
    }
    else {
        let sources = room.find(FIND_SOURCES);
        for (let source of sources) {
            if (!_.some(creepsInRoom, (c) => c.memory.role == 'harvester' && c.memory.sourceId == source.id)) {
                let containers = source.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => s.structureType == STRUCTURE_CONTAINER });
                if (containers.length > 0) {
                    name = this.createHarvester(source.id);
                    break;
                }
            }
        }
        if ((totalCreeps['transporter'] == 0) && ((room.energyAvailable >= minEnergyForTransporter))) {
            name = this.createTransporter(minEnergyForTransporter);
        }
    }
    */

    // If a creep hasn't been spawned check remaining roles
    if (name == undefined && containers.length > 0) {
        for (let role of roleList) {
            /*
            // check for claim order
            if (role == 'claimer' && this.memory.claimRoom != undefined) {
                // try to spawn a claimer
                name = this.createClaimer(this.memory.claimRoom);
                // if that worked
                if (name != undefined && _.isString(name)) {
                    // delete the claim order
                    delete this.memory.claimRoom;
                }
            }
            */
            // if no claim order was found, check other roles
            if (totalCreeps[role] < minCreeps[role]) {
                if (role == 'transporter') {
                    name = this.createTransporter(maxEnergy);
                }
                else {
                    name = this.createCustomCreep(maxEnergy, role);
                }
                break;
            }
        }
    }

    // Check for distanceHarvesters
    let numberOfDistanceHarvesters = {};
    if (name == undefined) {
        for (let roomName in minDistanceHarvesters) {
            numberOfDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) => c.memory.role == 'distanceHarvester' && c.memory.target == roomName);

            if (numberOfDistanceHarvesters[roomName] < minDistanceHarvesters[roomName]) {
                name = this.createDistanceHarvester(maxEnergy, 2, room.name, roomName, 0);
            }
        }
    }

    // Display spawning information
    if (name != undefined && _.isString(name)) {
        console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
        for (let role of roleList) {
            console.log(role + ": " + totalCreeps[role]);
        }
        for (let roomName in numberOfDistanceHarvesters) {
            console.log("distanceHarvester" + roomName + ": " + numberOfDistanceHarvesters[roomName]);
        }
        console.log("MaxConstructors: " + room.memory.availableMiningPositions);
        console.log("===================================");
    }
};

StructureSpawn.prototype.createCustomCreep = function (energy, roleName) {
    // Create largest creep possible with balanced parts
    var numberOfParts = Math.floor(energy / 200);

    // Make sure creep doesn't exceed 50 parts
    numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));

    var body = [];
    for (let i = 0; i < numberOfParts; i++) {
        body.push(WORK);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
    }

    // create creep with the created body and the given role
    return this.createCreep(body, undefined, { role: roleName, working: false });
};

// create a new function for StructureSpawn
StructureSpawn.prototype.createDistanceHarvester = function (energy, numberOfWorkParts, home, target, sourceIndex) {

    // Create largest creep possible with balanced parts
    var body = [];
    for (let i = 0; i < numberOfWorkParts; i++) {
        body.push(WORK);
    }

    // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
    energy -= 150 * numberOfWorkParts;

    var numberOfParts = Math.floor(energy / 100);
    // make sure the creep is not too big (more than 50 parts)
    numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
    for (let i = 0; i < numberOfParts; i++) {
        body.push(CARRY);
    }
    for (let i = 0; i < numberOfParts + numberOfWorkParts; i++) {
        body.push(MOVE);
    }

    // create creep with the created body
    return this.createCreep(body, undefined, {
        role: 'distanceHarvester',
        home: home,
        target: target,
        sourceIndex: sourceIndex,
        working: false
    });
};

/*
// create a new function for StructureSpawn
StructureSpawn.prototype.createClaimer =
    function (target) {
        return this.createCreep([CLAIM, MOVE], undefined, { role: 'claimer', target: target });
    };
*/

StructureSpawn.prototype.createHarvester =
    function (sourceId) {
        return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined, { role: 'harvester', sourceId: sourceId });
    };

StructureSpawn.prototype.createTransporter =
    function (energy) {
        // Create transporter with only CARRY and MOVE parts

        let minEnergyForTransporter = 150;
        var numberOfParts = Math.floor(energy / minEnergyForTransporter);

        // Make sure creep doesn't exceed 50 parts
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));

        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }

        return this.createCreep(body, undefined, { role: 'transporter', working: false });
    };
