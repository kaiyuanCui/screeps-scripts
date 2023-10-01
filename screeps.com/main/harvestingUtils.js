// harvestingUtils.js

const harvestingUtils = {
    // Function to find the closest source of energy (container, tombstone, or source)
    findClosestEnergySource: function(creep) {
        // Check for containers with energy
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        // Check for tombstones with energy
        var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0
        });
        
       

        if (tombstone) {
            if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                return creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            
        } else if (container) {
            if (creep.withdraw(container) === ERR_NOT_IN_RANGE) {
                return creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            
        } else {
            var energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
                return creep.moveTo(energySource, { visualizePathStyle: { stroke: '#ffcc66' } });
            }
        }
    },

    collectFromDropped: function(creep){
        // Check for tombstones with energy
        var tombstone = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (tombstone) => tombstone.store[RESOURCE_ENERGY] > 0
        });
        
        if (tombstone) {
            if (creep.withdraw(tombstone, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                return creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
            } 
        }

        var droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (resource) => resource.resourceType === RESOURCE_ENERGY
        });

        if (droppedEnergy){
            if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
                return creep.moveTo(droppedEnergy);
            }
        }

         // Check for ruins with resources
        var ruin = creep.pos.findClosestByPath(FIND_RUINS, {
            filter: (ruin) => ruin.store[RESOURCE_ENERGY] > 0
        });

        if (ruin) {
            if (creep.withdraw(ruin) === ERR_NOT_IN_RANGE) {
               return creep.moveTo(ruin, { visualizePathStyle: { stroke: '#ffaa00' } });
           }
           
        }

    },

    collectFromStorage: function(creep){
        // Check for containers with energy
        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER ||
                        structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        if (container) {
            if (creep.withdraw(container) === ERR_NOT_IN_RANGE) {
                return creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }

    },
    
    harvestFromSource: function(creep){
    
         var energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
         if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
             return creep.moveTo(energySource, { visualizePathStyle: { stroke: '#ffcc66' } });
         }
    }
};

module.exports = harvestingUtils;
