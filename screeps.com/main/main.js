var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMover = require('role.mover')
var spawnManager = require('spawnManager');

   // Define a list of priority roles with desired counts
var priorityRoles = [
        { roleName: 'harvester', desiredCount: 3 },
        { roleName: 'mover', desiredCount: 9},
        
        { roleName: 'builder', desiredCount: 8 },
        { roleName: 'upgrader', desiredCount: 1 },
        
        
    ];

module.exports.loop = function () {
    
    
     // clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    // defence
    var tower = Game.getObjectById('651b00699b1ff378a13c0ad5');
    if(tower) {
        // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        //     filter: (structure) => structure.hits < structure.hitsMax
        // });
        // if(closestDamagedStructure) {
        //     tower.repair(closestDamagedStructure);
        // }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    

   // Energy Threshold for Spawning
    var energyThreshold = 700; // Adjust this value as needed

    // Check available energy
    var energyAvailable = Game.spawns['Spawn1'].room.energyAvailable;
    
    
    
   
    var vacantRoles = false;
    if(energyAvailable >= energyThreshold){
        
        // Iterate through priority roles and spawn as needed
        for (var i = 0; i < priorityRoles.length; i++) {
            var roleConfig = priorityRoles[i];
            var roleName = roleConfig.roleName;
            var desiredCount = roleConfig.desiredCount;
    
            // Check if the role count is less than the desired count
            var roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleName).length;
            if (roleCount < desiredCount) {
                vacantRoles = true;
                var result = spawnManager.spawnCreep(Game.spawns['Spawn1'], roleName, energyThreshold);
    
                if (result === OK) {
                    console.log(`Spawning a new ${roleName}`);
                    break; // Exit the loop after spawning the first needed role
                }
            }
        }
        
         // automatically increase creeps?
        if(!vacantRoles){
            //console.log("increasing role count")
            
            //priorityRoles[0].desiredCount++; // mover
            //priorityRoles[3].desiredCount++; // upgrader
            //console.log(priorityRoles[0].desiredCount);
            //console.log(priorityRoles[3].desiredCount);
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

    
    var counter = 0;
    
    // run creeps logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            counter ++;
            priority = Game.getObjectById('651d06a2148daba85e1b7b37');
            // dedicate half to priority
            if(counter%2){
                roleBuilder.run(creep, priority);
            }else{
                roleBuilder.run(creep, null);
            }
            
        }
        else if(creep.memory.role == 'mover') {
            roleMover.run(creep);
        }
    }
}