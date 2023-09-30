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
                creep.moveTo(tombstone, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            return tombstone;
        } else if (container) {
            if (creep.withdraw(container) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
            return container;
        } else {
            // If no containers or tombstones with energy, return the closest source
            var energySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(energySource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energySource, { visualizePathStyle: { stroke: '#ffcc66' } });
            }
        }
    }
};

module.exports = harvestingUtils;