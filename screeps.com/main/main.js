var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleMover = require('role.mover')
var spawnManager = require('spawnManager');

   // Define a list of priority roles with desired counts
var priorityRoles = [
        { roleName: 'harvester', desiredCount: 3 },
        { roleName: 'mover', desiredCount: 9},
        
        { roleName: 'builder', desiredCount: 6 },
        { roleName: 'upgrader', desiredCount: 1 },
        
        
    ];

var constructionSites = [];
var damagedStructures = [];

var buildPriority = null;
var fixPriority = null;

module.exports.loop = function () {
    
     // clear memory
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
        
    }

    if(constructionSites.length === 0 || Game.time %10){
        updateConstructionSites();
    }
    if(damagedStructures.length === 0 || Game.time %10){
        updateDamagedStructures();
    }


    
    // defence
    var tower = Game.getObjectById('651b00699b1ff378a13c0ad5');
    if(tower) {
        // don't always want tower waste energy on fixing 
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

    var roleCounts = {
        'harvester': 0,
        'mover': 0,
        'builder': 0,
        'upgrader': 0
    }

    //console.log(damagedStructures);
    //console.log(constructionSites);

    // run creeps logic
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleCounts['harvester']++;
            roleHarvester.run(creep);
        }
        else if(creep.memory.role == 'upgrader') {
            roleCounts['upgrader']++;
            roleUpgrader.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            roleCounts['builder']++;
            var priority = null;
            //priority = Game.getObjectById('651c116ffbeacef16a65d445');
            // dedicate half to priority
            if( roleCounts['builder'] % 2 && priority){
                roleBuilder.run(creep, [], []);
            }else{
                roleBuilder.run(creep, damagedStructures, constructionSites);
            }
            
        }
        else if(creep.memory.role == 'mover') {
            roleCounts['mover']++;
            roleMover.run(creep);
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
            //var roleCount = _.filter(Game.creeps, (creep) => creep.memory.role == roleName).length;
            var roleCount = roleCounts[roleConfig.roleName];
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

    console.log(`Tick #${Game.time}`);
    console.log(`--------------------------------`);
    console.log(`Construction Sites: ${constructionSites.length}`);
    console.log(`Damaged Structures: ${damagedStructures.length}`);
    console.log(`harvester: ${roleCounts['harvester']}/${priorityRoles[0].desiredCount}`);
    console.log(`mover: ${roleCounts['mover']}/${priorityRoles[1].desiredCount}`);
    console.log(`builder: ${roleCounts['builder']}/${priorityRoles[2].desiredCount}`);
    console.log(`upgrader: ${roleCounts['upgrader']}/${priorityRoles[3].desiredCount}`);
    console.log(`--------------------------------`);

    
    
}

var updateConstructionSites = function(){
    constructionSites = Game.spawns['Spawn1'].room.find(FIND_MY_CONSTRUCTION_SITES);
}

var updateDamagedStructures = function(){
    damagedStructures = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType !== STRUCTURE_WALL &&
                    structure.structureType !== STRUCTURE_RAMPART) &&
                    structure.hits < structure.hitsMax;
        }
    });
}
