const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
const roleBuilder = {
    run: function(creep, repairTargets, buildTargets) {
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
            //console.log(repairTargets);
            //console.log(buildTargets);
            if(repairTargets.length === 1 || buildTargets.length ===1){
                creep.say('🚧priority');
            }
            var repairTarget = creep.pos.findClosestByPath(repairTargets);

            if (repairTarget) {
                if (creep.repair(repairTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(repairTarget, { visualizePathStyle: { stroke: '#ffffff' } });
                }
            } else if(buildTargets) {
                console.log(buildTargets.length);
                // If no repair targets, find the closest construction site
                var constructionSite = creep.pos.findClosestByPath(buildTargets);

                if (constructionSite) {
                    if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
            }
        } else {
            // harvest
            if(!(harvestingUtils.collectFromStorage(creep) === OK)) {
                 harvestingUtils.collectFromDropped(creep);
             }
            
        }
    }
};

module.exports = roleBuilder;