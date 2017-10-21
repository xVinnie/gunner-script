/* Script by Bernsketal */

const GLOBAL_LATENCY = 230; //set this to slightly lower than your ping
const DEBUG = true;
const DISABLE = false;

const JOB_GUNNER = 9;
const GLOBAL_LOCK_DELAY = 1000;

const SKILL_AA = 67120065,
SKILL_RETALIATE = 67309864,
SKILL_RETALIATE_DURATION = 1000,

SKILL_ROLL = 67508964,
SKILL_ROLL_DURATION = 800,
SKILL_ROLL_DISTANCE = 1337,

SKILL_SCATTERSHOT= 67139965,
SKILL_SCATTERSHOT_DURATION = 1630,
SKILL_SCATTERSHOT_DISTANCE = -108,

module.exports = function gunner(dispatch){
	let cid, job, model, enabled, aspd;
	
	let lastSkill, lastEvent, lastLastSkill, actionStart;
	
	let atkid = [];
	let atkid_base = 0xFEFEFFEE;
	let timer = [];
	
	let disabSkill = []; //Prevent double cast
	
	let collisionLocX;
	let collisionLocY;
	let collisionLocZ;
	
	function fakeEnd(event, duration, dist){
		collisionLocX = false;
		collisionLocY = false;
		collisionLocZ = false;		
		let bonusAttackId = 0;
		let speedMultiplier = 1.0;
		
		if(event.skill == SKILL_SCATTERSHOT){
			duration = SKILL_SCATTERSHOT_DURATION;		
		}
//template code 	
/* 		if(event.skill == SKILL_DC && (lastSkill == SKILL_JP1 || lastSkill == SKILL_JP2)){ 
			bonusAttackId = 0;
			duration = SKILL_DC_DURATION; //length
			disabSkill[SKILL_SKYFALL] = true;
			setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, duration/aspd);
			disabSkill[SKILL_COS] = true;
			setTimeout(function(){ disabSkill[SKILL_COS] = false; }, duration/aspd);
			disabSkill[SKILL_DECOY] = true;
			setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, duration/aspd);
		} */
		
		atkid[event.skill + bonusAttackId] = atkid_base;
		atkid_base--;
		
				dispatch.toClient("S_ACTION_STAGE", 1, {
			source: cid,
			x: event.x,
			y: event.y,
			z: event.z,
			w: event.w,
			model: model,
			skill: event.skill + bonusAttackId,
			stage: 0,
			speed: aspd / 1.2 * speedMultiplier,
			id: atkid[event.skill + bonusAttackId],
			unk: 1.0,
			unk1: 0,
			toX: 0,
			toY: 0,
			toZ: 0,
			unk2: 0,
			unk3: 0,
			movement: [],
		});
		
		var newX;
		var newY;
		var angle = parseFloat(event.w);
		angle /= 10000;
		angle /= 1.043;
		var vvv = 748;
		newX = Math.cos(angle) * dist;
		newY = Math.sin(angle) * dist;
		
		timer[event.skill] = setTimeout(
			function(event){
				dispatch.toClient("S_ACTION_END", 1, {
					source: cid,
					x: collisionLocX || (event.x + newX),
					y: collisionLocY || (event.y + newY),
					z: collisionLocZ || (event.z + 2),
					w: event.w,
					model: model,
					skill: event.skill + bonusAttackId,
					type: 0,
					id: atkid[event.skill + bonusAttackId],
				});
			}, duration / (aspd * speedMultiplier), event
		);
	}
	
	dispatch.hook('sLogin', 1, (event) => {
		({cid, model} = event);
		
		job = (model - 10101) % 100;
		enabled = [JOB_GUNNER].includes(job);
	});	
	
		dispatch.hook("C_START_SKILL", 3, (event) => {
		if(!enabled) return;
		
		if(DEBUG)
			console.log("C_START_SKILL:", event.skill, disabSkill[event.skill]);
		
		if(DISABLE) return;
		if(disabSkill[event.skill] == 'undefined') disabSkill[event.skill] = false;
		if(!disabSkill[event.skill]){ //disabskill must be false to continue
			if(event.skill == SKILL_ROLL){
			  if(event.skill.toString()[0] == '6' && event.skill != SKILL_RETALIATE){
			  setTimeout(function(){dispatch.toServer('cStartSkill', 1, event);},25);
			  setTimeout(function(){dispatch.toServer('cStartSkill', 1, event);},50);
			  setTimeout(function(){dispatch.toServer('cStartSkill', 1, event);},75);
			  setTimeout(function(){dispatch.toServer('cStartSkill', 1, event);},100);				
			}
			else if(event.skill.toString()[0] == '6' && event.skill != SKILL_AA && event.skill != SKILL_RETALIATE && event.skill != 67189064 && event.skill != 67189065 && event.skill != 67189066){
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 3, event);},25);
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 3, event);},50);
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 3, event);},75);
				setTimeout(function(){dispatch.toServer('C_START_SKILL', 3, event);},100);
			}
		}
			//template code
/* 			if(event.skill == SKILL_DC){ 
				disabSkill[event.skill] = true;
				setTimeout(function(){ disabSkill[SKILL_DC] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SKYFALL] = true;
				setTimeout(function(){ disabSkill[SKILL_SKYFALL] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_DECOY] = true;
				setTimeout(function(){ disabSkill[SKILL_DECOY] = false; }, SKILL_DC_DURATION/aspd);
				disabSkill[SKILL_COS] = true;
				setTimeout(function(){ disabSkill[SKILL_COS] = false; }, SKILL_DC_DURATION/aspd);
				fakeEnd(event, SKILL_DC_DURATION, SKILL_DC_DISTANCE);
			} */
			if (event.skill == SKILL_ROLL){
				disabSkill[event.skill] == true;
				setTimeout(function(){ disabSkill[SKILL_ROLL] = false; }, GLOBAL_LOCK_DELAY);
				disabSkill[SKILL_SCATTERSHOT] = true;
				setTimeout(function(){ disabSkill[SKILL_SCATTERSHOT] = false; }, SKILL_ROLL_DURATION/aspd);
				disabSkill[SKILL_RECALL] = true;
				setTimeout(function(){ disabSkill[SKILL_RECALL] = false; }, SKILL_ROLL_DURATION/aspd);
				disabSkill[SKILL_ARCBOMB] = true;
				setTimeout(function(){ disabSkill[SKILL_ARCBOMB] = false; }, SKILL_ROLL_DURATION/aspd);
				fakeEnd(event, SKILL_ROLL_DURATION, SKILL_ROLL_DISTANCE);
			}
			
			if (event.skill == SKILL_SCATTERSHOT){
				disabSkill[event.skill] == true;
				setTimeout(function(){ disabSkill[SKILL_SCATTERSHOT] = false; }, GLOBAL_LOCK_DELAY);
				fakeEnd(event, SKILL_SCATTERSHOT_DURATION, SKILL_SCATTERSHOT_DISTANCE);
			}
			
			if (event.skill == SKILL_RETALIATE){
				disabSkill[event.skill] == true;
				var timer = setTimeout(function(){disabSkill[SKILL_RETALIATE] = false;}, GLOBAL_LOCK_DELAY);
				fakeEnd(event, SKILL_RETALIATE_DURATION);
			}
		}
		lastSkill = event.skill;
		lastEvent = event;
		retVal = getReturnValue(event);
		if(DEBUG)
			console.log("Returning " + retVal, "from C_START_SKILL");
		return retVal
			});
	
	dispatch.hook("S_ACTION_STAGE", 1, (event) => {
		if(!enabled) return;
		
		let hits = (event.skill - lastSkill);
		if(DEBUG){
			console.log("S_ACTION_STAGE:", event.skill, event.stage, hits);
			actionStart = Date.now();
		}
		
		if(DISABLE) return;
		
		//Cancel 7th auto attack
/* 		if(lastSkill == SKILL_AA){ //template code
			if(hits == 6 || hits == 30 || (hits > -40 && hits < -30)){
				timer = setTimeout(function(event){
					dispatch.toClient("S_ACTION_END", 1, {
						source: event.source,
						x: event.x,
						y: event.y,
						z: event.z,
						w: event.w,
						model: event.model,
						skill: event.skill,
						type: 4,
						id: event.id
					});
				}, 100, event, 0);
			}
		} */

		//return getReturnValue(event);
	});
	
	dispatch.hook("S_ACTION_END", 1, (event) => {
		if(!enabled) return;
		
		if(DEBUG)
			console.log("S_ACTION_END:", event.skill, event.type, Date.now() - actionStart, "ms");

		//return getReturnValue(event);
	});
	
		dispatch.hook("S_START_COOLTIME_SKILL", 1, (event) => {
		if(!enabled) return;
		
		event.cooldown -= GLOBAL_LATENCY;
		return true;
	});
	
	dispatch.hook("S_PLAYER_STAT_UPDATE", 1, (event) => {
		if(!enabled) return;
		
		aspd = (event.bonusAttackSpeed + event.baseAttackSpeed) / 100;
	});
	
	dispatch.hook("C_NOTIFY_LOCATION_IN_ACTION", 1, (event) => {
		if(!enabled) return;
		
		collisionLocX = event.x;
		collisionLocY = event.y;
		collisionLocZ = event.z;
		setTimeout(function(event){
		dispatch.toServer('cNotifyLocationInAction', 1, {
			skill: event.skill,
			stage: event.stage,
			x: event.x,
			y: event.y,
			z: event.z,
			w: event.w,
			});
		}, 0, event);
		setTimeout(function(event){
		dispatch.toServer('cNotifyLocationInAction', 1, {
			skill: event.skill,
			stage: event.stage,
			x: event.x,
			y: event.y,
			z: event.z,
			w: event.w,
			});
		}, 100, event);
		return false;
	});
	
	dispatch.hook("C_NOTIFY_LOCATION_IN_DASH", 1, (event) => {
		if(!enabled) return;
		
		collisionLocX = event.x;
		collisionLocY = event.y;
		collisionLocZ = event.z;
		setTimeout(function(event){
			dispatch.toServer('C_NOTIFY_LOCATION_IN_DASH', 1, {
				skill: event.skill,
				stage: event.stage,
				x: event.x,
				y: event.y,
				z: event.z,
				w: event.w,
				});
		}, 0, event);
		setTimeout(function(event){
			dispatch.toServer('C_NOTIFY_LOCATION_IN_DASH', 1, {
				skill: event.skill,
				stage: event.stage,
				x: event.x,
				y: event.y,
				z: event.z,
				w: event.w,
				});
		}, 100, event);
		return false;
	});
	
	function getReturnValue(event){
		if(event.skill == SKILL_AA) return true;
		if(event.skill == SKILL_RETALIATE) return true;
		if(event.skill == SKILL_ROLL) return false;
		if(event.skill == SKILL_SCATTERSHOT) return false;
/* 		if(event.skill >= SKILL_BH && event.skill <= SKILL_BH + 10)
			return false;
		if(event.skill == SKILL_CHAKRA_THRUST)
			return false;
		if(event.skill == SKILL_COS)
			return false;
		if(event.skill == SKILL_DC)
			return false;
		if(event.skill == SKILL_DECOY)
			return false;
		if(event.skill == SKILL_JP1)
			return false;
		if(event.skill == SKILL_JP2)
			return false;
		if(event.skill == SKILL_SKYFALL)
			return false; */
		return true;
	}
}
