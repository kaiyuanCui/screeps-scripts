const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
const roleHarvester = {
    run: function(creep) {
        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
             // harvest
            harvestingUtils.findClosestEnergySource(creep);
        }
        else {
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                            structure.structureType === STRUCTURE_SPAWN ||
                            structure.structureType === STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (container) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, { visualizePathStyle: { stroke: '#009933' },
                    reusePath: 5 // Example: Reuse the path for 5 ticks
                    });
                }
            }
            else {
                const nearestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);

                if (nearestSpawn) {
                    if (creep.moveTo(nearestSpawn, { visualizePathStyle: { stroke: '#0099ff' } }) === ERR_NO_PATH) {
                            // If there's no valid path to the nearest spawn, stay put or perform another action
                            // You can add additional logic here based on your requirements.
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;