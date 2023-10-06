const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
const roleHarvester = {
    run: function(creep) {

        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
             // harvest
            var harvestResponse = harvestingUtils.harvestFromSource(creep);
            if(harvestResponse===OK){
                //creep.memory.building = false;
                creep.memory.idle = false;
                creep.say('🔄 harvest');
            } else{
                //creep.memory.idle = true;
                //creep.say('harvest fail');
                //console.log(harvestResponse);
            }

        }
        else {
           //var carrying = creep.store.getUsedCapacity([resource]);
           // drop all energy
           creep.say(' drop');
           creep.drop(RESOURCE_ENERGY);
        }
    }
};

module.exports = roleHarvester;