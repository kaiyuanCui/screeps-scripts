const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            var upgradeStatus = creep.upgradeController(creep.room.controller)
            if(upgradeStatus === ERR_NOT_IN_RANGE || upgradeStatus === OK) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#3366ff'}});
            }
        }
        else {
             // harvest
             if(!(harvestingUtils.collectFromStorage(creep) === OK)) {
                 harvestingUtils.collectFromDropped(creep);
             }
             
        }
	}
};

module.exports = roleUpgrader;