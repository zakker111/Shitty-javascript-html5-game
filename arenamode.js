/*--------ARENA MOODIN ERILLAISET SETIT--------*/
function createArena()
{
	Math.seedrandom(SEED);//siidataan

	modifyElement("main", "block");//main divi nakyy	
	modifyElement("TextDiv", "block");
	
	modifyElement("EndDiv", "none");//end divia ei nayteta	
	modifyElement("start", "none");//startdivia ei nayteta
	
	initTheme(); //initialisoidaan theme
	initArenaMap();
	initArenaActors();//intialsoidaan actorsit

	
	drawMap();//piiretaan mappi
	drawActors();//piiretaan actorsit

}

function initArenaMap()//tehdaan map array tyyliin map[[0,0,1,0,0]], //voidaan saada tile esille consolissa map[0][2]=1
{	
	map = [];//alustetaan mappi
	for (var y = 0; y < ROWS; y++)  //limittainen for looppi kay lapi map arrayn y,x
	{
		var newRow = [];
		for (var x = 0; x < COLS; x++)
		{
			
		newRow.push(THEME.floor); //maata muuten 	
		actorMap[y + "_" + x] = null;//nullataan actormappi
		
		}
	
		map.push(newRow);
	}
	
	for(x=0; x<=COLS; x++)//tehaan wallia ylos alas
	{			
		map[0][x]=THEME.wall;
		map[14][x]=THEME.wall;
	}

	for(y=0; y<=14; y++)//tehaan wallia vasen oikee
	{		
		map[y][18]=THEME.wall;
		map[y][0]=THEME.wall;
	}
	
	
	
	
}


function initArenaActors()
{
	actorList = []; //kaikki enemyt + pelaaja tulee listaan
	
	for (var e = 0; e <= ARENA_ACTORS; e++) //tehdaan actorit ACTORS maaraa kuin monta
	{
		var actor = {y:0, x:0, id:0, isPlayer:false, AiComponent:randomInt(0,1), hp:0, ar:0, lvl:0, xp:0, dxt:0, str:0, dmg:0}; //x,y,isplayer maaraa onko enemy vai pelaaja, health points, armor, lvl kaytetaan combatissa aicomponent maarittelee miten kayttaytyy 0,1 0 agroo aina 1 venailee etta pelaaja lahella
		do 
		{
			actor.y = randomInt(0,ROWS-1); //randomilla y mutta katotaan etta kentan sisalla
			actor.x = randomInt(0,COLS-1); //randomilla x mutta katotaan etta kentan sisalla
		}
		while (actorMap[actor.y + "_" + actor.x] != null) //tehdaan niin kauan kuin actor map on eri kun nul
		{
			if (map[actor.y][actor.x] == THEME.floor)//tehdaan actori vain ja ainoastaan maa tileihin +7 koska ignoroidaan ensimmaiset seina tilet spritesheetista
			{
				actorMap[actor.y + "_" + actor.x] = actor; //actori on tyyliin actor(x_y)
				actorList.push(actor); //tyonnetaan actori listaan
			}
			else 
			{
				e--;//koitetaan uudelleen
			}
		}
	}
	
	player = actorList[0]; //pelaaja on ensimmainen actori listassa
	player.isPlayer = true;//pelaaja on pelaaja eli it is playar
	player.id = SPRITEROWS*6;//heron kuva spritesheatista
	actorMap[player.y + "_" + player.x] = null;//vanha position pois actormapista
	
	actorMap[player.y + "_" + player.x] = player;//uudet coordinaatit actormappiin
	player.hp = PLAYERHP, player.xp = PLAYERXP, player.lvl = PLAYERLVL, player.dxt = PLAYERDXT, player.str = PLAYERSTR, player.dmg=FULLDMG, player.ar = PLAYERAR;//alustetaan pelaajan atribuutit globaaleista
	
	for (var a in actorList)//tanne tulee ar,hp ym settien teko enemyille eli erillaiset enemyt
	{
		if (a == 0)//jos actorlistan eka skipataan se koska pelaaja
		{
			continue;
		}
		var lvl = randomInt(1,player.lvl+2), ar=randomInt(1,lvl), hp=randomInt(3,lvl), dxt=0, str=0, dmg=randomInt(1,lvl), id=randomInt(SPRITEROWS*3, SPRITEROWS*4-1);//kuva on id otetaan tallahetkella vain randomilla spritesheetista TODO parempi systeemi asmorille damagelle ym
		//console.log(id);
		actorList[a].lvl = lvl;
		actorList[a].id = id;
		actorList[a].dmg = dmg;
		actorList[a].ar = ar;
		actorList[a].hp = hp;
	}
}

