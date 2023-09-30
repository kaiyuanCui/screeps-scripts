var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var spawnManager = require('spawnManager');

module.exports.loop = function () {
    
    
     // clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // defence
    var tower = Game.getObjectById('5015a5cf05c1eb0c34760da4');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    

   // Energy Threshold for Spawning
    var energyThreshold = 300; // Adjust this value as needed

    // Check available energy
    var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
    
       // Define a list of priority roles with desired counts
    var priorityRoles = [
        { roleName: 'harvester', desiredCount: 4 },
        { roleName: 'builder', desiredCount: 4 },
        { roleName: 'upgrader', desiredCount: 2 },
        
        
    ];
    
    if(energyAvailable >= energyThreshold){
        
        // Iterate through priority roles and spawn as needed
        for (var i = 0; i < priorityRoles.length; i++) {
            var roleConfig = priorityRoles[i];
            var roleName = roleConfig.roleName;
            var desiredCount = roleConfig.desiredCount;
    
            // Check if the role count is less than the desired count
            var roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleName).length;
            if (roleCount < desiredCount) {
                var result = spawnManager.spawnCreep(Game.spawns['Spawn1'], roleName, energyAvailable);
    
                if (result === OK) {
                    console.log(`Spawning a new ${roleName}`);
                    break; // Exit the loop after spawning the first needed role
                }
            }
        }
        
    }

    


    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
    }

    
    
    
    // run creeps logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}