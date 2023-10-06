// spawnManager.js
const PARTS_COST ={
    MOVE: 50,
    WORK: 100,
    CARRY: 50,
};

const ROLES_PARTS = {
    'mover': [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY,CARRY, CARRY],
    'harvester': [MOVE, CARRY, WORK,WORK,WORK,WORK],
    'upgrader': [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK],
    'builder': [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK, WORK],
}



const spawnManager = {
    spawnCreep: function(spawn, roleName, energyLimit) {
        if (spawn.spawning) {
            // The spawn is already in use, so we can't spawn another creep right now.
            return ERR_BUSY;
        }

        // TODO: calculate total cost
        const bodyParts = ROLES_PARTS[roleName]

        if (!bodyParts) {
            return ERR_NOT_ENOUGH_ENERGY; // Not enough energy to spawn
        }

        const creepName = roleName + Game.time;
        const result = spawn.spawnCreep(bodyParts, creepName, {
            memory: {
                role: roleName,
            },
        });

        if (result === OK) {
            console.log(`Spawning a new ${roleName}: ${creepName}`);
        }

        return result;
    },

//    calculateBodyParts: function(energyAvailable) {
//         // Ensure at least one part of each type: WORK, CARRY, and MOVE
//         const bodyParts = [WORK, CARRY, MOVE];
//         let remainingEnergy = energyAvailable - 200; // Subtract energy for one part of each type

//         // Calculate additional body parts with the remaining energy
//         while (remainingEnergy >= 50) { // 50 is the cost of one MOVE
//             if (remainingEnergy >= 100) { // 100 is the cost of one WORK or CARRY
//                 bodyParts.push(WORK);
//                 remainingEnergy -= 100;
//             }
//             if (remainingEnergy >= 50) {
//                 bodyParts.push(MOVE);
//                 remainingEnergy -= 50;
//             }
//         }

//         return bodyParts;
//     },
};

module.exports = spawnManager;