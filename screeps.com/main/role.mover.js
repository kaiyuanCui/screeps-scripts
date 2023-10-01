const harvestingUtils = require('harvestingUtils'); // Import the harvestingUtils module
const roleMover = {
    run: function(creep) {

        // finish depositing
         if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
            creep.memory.idle = false;
            creep.say('🔄 collect');
        }
        // finish collecting
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
            creep.memory.idle = false;
            creep.say('🚧 deposit');
            //creep.memory.idle = false;
        }


        // TODO: if have some energy, determine deposit or collect based on proximity?
        if (creep.memory.collecting) {
             // harvest
            harvestingUtils.collectFromDropped(creep);
           
        }
        else {
            //creep.memory.collecting = true;
           this.depositToClosest(creep);
        }
    },

    depositToClosest: function(creep){
        //creep.say('🔄 deposit');
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (container) {
           
            var transferStatus = creep.transfer(container, RESOURCE_ENERGY);
            if (transferStatus === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: '#009933' },
                //reusePath: 5 // Example: Reuse the path for 5 ticks
                });
            }
            else{
                //console.log(transferStatus);
                // carrying = creep.store.getUsedCapacity([RESOURCE_ENERGY]);
                // // still carrying some after deposit?
                //if(carrying > 0){
                //this.depositToClosest(creep);
                //}
            }
            
        }
        else {
            // fix: this also happens when the entrance is blocked by other creeps
            if(!creep.memory.idle){
                console.log("STORAGE FULL!")
                creep.memory.idle = true;
            }
            
            const nearestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
            
            if (nearestSpawn) {
                if (creep.moveTo(nearestSpawn, { visualizePathStyle: { stroke: '#0099ff' } }) === ERR_NO_PATH) {
                        // If there's no valid path to the nearest spawn, stay put or perform another action
                        // You can add additional logic here based on your requirements.
                }
            }
        }
    }
};

module.exports = roleMover;