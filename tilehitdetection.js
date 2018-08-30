/*-----------------TILECHEK CHEKKAA MIHIN TILEEN OSUU-----------------*/
function tileChek(actor) //chekataan mita pelaajan alla on tata funktiota ei kayta kuin pelaaja
{
	if(map[actor.y][actor.x] == SPRITEROWS*4 || map[actor.y][actor.x] == SPRITEROWS*4+1) //avamaton arkku spritesheetissa 5 sarakkeessa eka tile avattu arkku toka eli +1
	{
		Openchest();
	}
	else
	{
		modifyElement("ArkkuDiv", "none");
	}
	
	if(map[actor.y][actor.x] == SPRITEROWS*4+7)//ollaan secretin paalla tahan jotain trappia tai itemin antoo ym
	{	
		Secret(actor);
	}
	else if(map[actor.y][actor.x] == SPRITEROWS*7+5)//potionin paalla
	{
		Potion(actor);
	}
	else if(map[actor.y][actor.x] == SPRITEROWS*4+4 ||map[actor.y][actor.x] == SPRITEROWS*4+2) //tiedetaan etta ollaan laderissa/portaalissa tehdaan uusi kentta
	{
		Ladder();
	}
}


/*-----------------TANNE TULEE KAIKKI ITEMIT JOTKA TEKEVÄT JOTAIN KUN NIIHIN OSUU YMS-----------------*/
function Ladder()
{
	console.log("ladderissa");
	SEED++; // siidataan yhella lisaa etta tulee eirllainen kentta
	PLAYERHP = player.hp, PLAYERXP = player.xp, PLAYERLVL = player.lvl, PLAYERSTR = player.str, PLAYERDXT = player.dxt, PLAYERAR = player.ar, FULLDMG=HAND[0].dmg+PLAYERDMG;   // muistetaan pelaajan atribuutit taalla 
	LEVELS--;//miinustetaan levelsien maaraa
	create();//luodaan uusi mailma
	saveGame(); //tallennetaan peli localiin
	map[player.y][player.x] = SPRITEROWS*4+3; //isketaan mappiin ladderi josta tultiin
	drawMap();
	
	if (LEVELS == 0)//kun towerin levelit kayty lapi
	{
		
		loadTowers(true);//jos laittaa falseksi iskee sivulle lisaa torneja
		
		modifyElement("map", "block");
		
		modifyElement("main", "none");
		
		canMove = false;//ei liikuteta pelaajaa jos ei nayteta pelikenttaa

		saveGame();
	}
}



function Potion(actor)
{
	map[actor.y][actor.x] = THEME.floor;//pyyhitaan paikka takaisin maaksi

	var potionhp=3;//tanne tulee eri potun hp maara
	var indicate=('+'+potionhp);
		
	actor.hp+=potionhp;
	IndicatorInit(actor,indicate);
}



function Secret(actor)
{
	map[actor.y][actor.x] = THEME.floor;//pyyhitaan paikka takaisin maaksi	
	var a = randomInt(1, 2);
	console.log("secretissa");
		
	if(a == 1)//ansa
	{
		//console.log("laukaisit ansan");
		var dmg=1;//daman maara
		var indicate=('-' + dmg);//indikoidaan se
		actor.hp -= dmg;//miinustetaan hpeesta
		IndicatorInit(actor,indicate);
		TextLogUbdate("You walked in to trap");
		map[actor.y][actor.x] = SPRITEROWS*4+randomInt(5,6);//ansalle kuva spritesheetista 5=piikki 6=speari 
		
		if(actor.hp==0)
		{
			actorList[actorList.indexOf(actor)] = -1;//poistetaan pelaaja actorlistasta
			PLAYED = "false";
			localStorage["sPLAYED"] = PLAYED; 
			//tahan joku pelin lopetus funkkariin meno
		}
	}
	else if(a == 2)
	{
		createLoot(actor);//mennaan duunaan loottia lootti funkkari maarittaa randomilla tuleeko itemia vai ei jos ei, ei tapahdu mitaan
	}
	
	drawMap();	//updatetaan mappi
}