const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
const roleBuilder = {
    run: function(creep) {
        // Check if the creep should switch between building and harvesting
        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.memory.idle = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            creep.say('🚧 build');
            creep.memory.idle = false;
        }

        if (creep.memory.building) {
            // Find the closest construction site needing repair
            var repairTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType !== STRUCTURE_WALL &&
                            structure.structureType !== STRUCTURE_RAMPART) &&
                            structure.hits < structure.hitsMax;
                }
            });

            if (repairTarget) {
                if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else {
                // If no repair targets, find the closest construction site
                var constructionSite = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

                if (constructionSite) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        } else {
            // harvest
            harvestingUtils.collectFromDropped(creep);
            
        }
    }
};

module.exports = roleBuilder;