var roles = {
    builder:               require('role.builder'),
    constructor:           require('role.constructor'),
    distanceHarvester:     require('role.distanceHarvester'),
    harvester:             require('role.harvester'),
    invader:               require('role.invader'),
    repairer:              require('role.repairer'),
    transporter:           require('role.transporter'),
    upgrader:              require('role.upgrader')
};

Creep.prototype.runRole = function () {
    roles[this.memory.role].run(this);
};

Creep.prototype.getEnergy = function (useContainer, useSource, isUpgrader) {
    let container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.carryCapacity)});

    if (isUpgrader){
        container = this.room.storage;
        if (container) {
            if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(container);
            }
        }
        else {
            container = this.pos.findClosestByPath(FIND_STRUCTURES, { filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > this.carryCapacity)});
    
            if (container) {
                if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(container);
                }
            }
        }
    }
    else if (useContainer && container != undefined) {
        if (this.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            this.moveTo(container);
        }
    }
    else {
        var source = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

        if (this.harvest(source) == ERR_NOT_IN_RANGE) {
            this.moveTo(source);
        }
    }
};

Creep.prototype.depositEnergy = function (useContainer) {
    let storageContainer = this.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_CONTAINER) 
                     && s.store[RESOURCE_ENERGY] < s.storeCapacity
    });
    let storageStructure = this.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (s) => (s.structureType == STRUCTURE_SPAWN
                     || s.structureType == STRUCTURE_EXTENSION
                     || s.structureType == STRUCTURE_TOWER)
                     && s.energy < s.energyCapacity
    });

    if (useContainer) {
        if (storageContainer) {
            if (this.transfer(storageContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(storageContainer);
            }
        }
        else {
            if (storageStructure == undefined){
                storageStructure = this.room.storage;
            }
            if (storageStructure) {
                if (this.transfer(storageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.moveTo(storageStructure);
                }
            }
        }
    }
    else {
        if (storageStructure == undefined){
            storageStructure = this.room.storage;
        }
        if (storageStructure) {
            if (this.transfer(storageStructure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.moveTo(storageStructure);
            }
        }
    }
};
