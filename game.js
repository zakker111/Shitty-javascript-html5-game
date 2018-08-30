var gcanvas = document.getElementById('gcanvas');
var gctx = gcanvas.getContext('2d');

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var sprite = new Image(); //loadataan sprite
var mapImage = new Image();
var towerImage = new Image();



sprite.onload = function() //tama tehdaan kun sprite on ladattu
{
	initTiles(); //initialisoidaan tilelista vain pelin alussa
	modifyElement("main", "none");
	modifyElement("map", "none");
	modifyElement("charactermenu", "none");
}
sprite.src = "spritesheet.png";
mapImage.src = "map1.png";
towerImage.src = "tower.png";

//random funktio saadaan random valilta min - max
function randomInt(min, max) 
{
	return Math.floor(Math.random()*(max-min+1)+min);
}



function tileSize(width)//tata ei kayteta missaan
{
	TILESIZE = Math.round(width/COLS-1);
	if (TILESIZE >= 32)
	{
		TILESIZE = 32;
	}
	else
	{
		TILESIZE = Math.round(width/COLS-1);
	}
}



function draw(img, sy, x, y)//drawwaus funkkari yksikertaaistettuna ei kayteta viela missaan
{
	ctx.drawImage(img, 0, sy, SPRITE_TILESIZE, SPRITE_TILESIZE, x, y, TILESIZE, TILESIZE);
}



function initDefaults()//defaulttien initialisointi
{
	TextLogUbdate("");//alustetaan textlogi tyhjaksi
	KILLED = 0; //alustetaan KILLED takaisin nollaksi
	PLAYERHP = 10, PLAYERDXT=0, PLAYERSTR=0, PLAYERXP=0, PLAYERLVL=1, PLAYERDMG=2, PLAYERAR=0;	//taalla tarvii alustaa kaikki oletuksiksi ettei startissa taas bugaa
	HAND[0]={id:"nothing",dmg:0,durability:"none"};
	FULLDMG=HAND[0].dmg+PLAYERDMG;
	player.hp = PLAYERHP, player.xp = PLAYERXP, player.lvl = PLAYERLVL, player.dxt = PLAYERDXT, player.str = PLAYERSTR, player.dmg=FULLDMG, player.ar = PLAYERAR;//alustetaan pelaajan atribuutit globaaleista
}



function initTiles()//tilelistan initialisointi+aseiden listan initialisointi
{

	SPRITEROWS = sprite.height/SPRITE_TILESIZE;
	SPRITECOLS = sprite.width/SPRITE_TILESIZE;
	
	var itemPos=[];
	//kaydaan tilelistasta ase kohta lapi -896=x akseli 128px=width/height arkun aseen kuvalle koska suurennettu ja 128px pitaa menna y akselia alaspain joka kerta etta saadaan oikeesta kohtaa kuva 
	for(var y = 0; y<= sprite.width*3.5; y+=128)//pitaa kertoa etta toimii voi johtua siita etta resizataan kuvia nakyviin arkkuun mentaessa
	{
		itemPos=["-896px"+" "+"-"+y+"px"] //alotus x akseli aseiden kuville
		itemImagePos.push(itemPos); //tyonnetaan uusi kuva itemPosille
		//console.log(itemImagePos);
	}
	
	for (var y = 0; y <= sprite.width; y += SPRITE_TILESIZE) //kaydaan sprite lapi ylhaalta alas isketaan tilen pikselien koko y akselilla koko sprite kuvan widthi lapi 
	{		
		for (var x=0; x <= sprite.height; x += SPRITE_TILESIZE) //kaydaan heighti lapi
		{
			if(x == sprite.height)
			{
				y += SPRITE_TILESIZE; //ynnataan yta spriten tilen koolla
				x = 0; //x takas nollaksi
			}
			else if (y == sprite.width) //jos ollaan kayty widthi lapi
			{
				break; //breakataan vekeen (huom ehka huono)
			}		
			tile = {y:y,x:x} //tilelle koordinaatit	tarvitaan piirrossa canvakseen maaritellaan mista kohtaa tarvitsee  piirtaa spritesheetista mailmaan
			tileList.push(tile); //tyonnetaan tile tilelistaan			
		}
	}
}



function initTheme()
{	
	var wall = randomInt(0,SPRITEROWS-1);//-3 koska viimeisia kolmea tilea ei ole viela spritesheetissa -1 koska alkaa 0
	//SPRITEROW on kuinka monta tilea rivissa spritesheetissa periaatteessa kerrottuna 1 eli pelkka SPRITEROW kelpaa tassa 
	//maksimi on SPRITEROWx2 eli jos vaikka 8 tilea rowissa random napataan 8-(8*2-1) -1 koska tilet alkaa nollasta -3 on vain sita varten kun spritesheetissa tyhjaa 3 tilea
	var floor = randomInt(SPRITEROWS,SPRITEROWS*2-1);
	THEME = {wall:wall,floor:floor};//annetaan ne theme listalle
	//console.log(THEME.wall+'_'+THEME.floor);
}



function initMap()//tehdaan map array tyyliin map[[0,0,1,0,0]], //voidaan saada tile esille consolissa map[0][2]=1
{	
	map = [];//alustetaan mappi
	for (var y = 0; y < ROWS; y++)  //limittainen for looppi kay lapi map arrayn y,x
	{
		var newRow = [];
		for (var x = 0; x < COLS; x++)
		{
			//TODO itemeita enemman yms random systeemin twiikkailu yms				
			if (Math.random() > 0.8)//80% kaveltavaa tilee 0.0 ois 100% seinaa
			{
				newRow.push(THEME.wall); //tyonnetaan uusi rivi 0 seinalle
			}
			else if (Math.random() < 0.01)//vaan muutama arkku sakalla kenttaan
			{
				newRow.push(SPRITEROWS*4); //arkulle
			}
			else if (Math.random() < 0.03) //naita pitaa viela twiikata
			{
				newRow.push(SPRITEROWS*4+7); //secretille  
			}
			/*else if (Math.random() < 0.02) //naita pitaa viela twiikata
			{
				newRow.push(SPRITEROWS*7+5); //potioneille
			}
			*/
			else if (Math.random() < 0.03) //naita pitaa viela twiikata
			{
				var r = randomInt(SPRITEROWS*2,SPRITEROWS*3-1);// -1 koska sprite alkaa 0 deco rivista minimi SPRITEROWS*2 koska ennen deco tileja spritessa on 2 rivia wall,floor maksimi *3 koska otetaan silta valilta deco tilet
				newRow.push(r); 					
			}
			else
			{
				newRow.push(THEME.floor); //maata muuten 
			}
		actorMap[y + "_" + x] = null;//nullataan actormappi
		}
	map.push(newRow);
	}
}



function carveToLadder(UP_DOWN)
{
	
	if(UP_DOWN)
	{
		newLadder = {y:randomInt(0, 4), x:randomInt(14, 18)};//jos ladderi tehdaan ylos 
	}
	else
	{
		newLadder = {y:randomInt(10, ROWS-1), x:randomInt(0, COLS-14)}; //jos up false eli ladderi tehdaan alas
	}
	
	ladder = newLadder;
	
	if (ladder.x <= player.x)
	{
		for (var x = ladder.x; x <= player.x; x++)
		{
		map[player.y][x] = THEME.floor;
		//console.log('x+:'+ x);
		}
	}
	else if (ladder.x >= player.x)
	{
		for (var x = ladder.x; x >= player.x; x--)
		{
		map[player.y][x] = THEME.floor;
		//console.log('x-:'+ x);
		}
	}
	
	if (ladder.y <= player.y)
	{
		for (var y = ladder.y+1; y <= player.y; y++)
		{
		map[y][ladder.x] = THEME.floor;
		//console.log('y+:' + y);
		}
	}
	else if (ladder.y >= player.y)
	{
		for (var y = ladder.y; y >= player.y; y--)
		{
		map[y][ladder.x] = THEME.floor;
		//console.log('y-:' + y);
		}
	}
	if (LEVELS==1)
	{
		map[ladder.y][ladder.x] = SPRITEROWS*4+2;//jos levelssit on 1 viimeinen leveli kyseessa isketaan portaali eika ladderia
	}
	else
	{
		map[ladder.y][ladder.x] = SPRITEROWS*4+4;//isketaan laderi carvauksen paatyttya
	}
}



function drawMap() //mapin piirto
{
	var posX = 0, posY = 0;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var y = 0; y < map.length; y++)  //loopataan map array lapi kahella forilla y, x
	{
		for(var x = 0; x < map[y].length; x++)
		{
			//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);<-----PIIRTO TAPA
				
			ctx.drawImage(sprite, tileList[THEME.floor].y , tileList[THEME.floor].x, SPRITE_TILESIZE, SPRITE_TILESIZE, posX, posY, TILESIZE, TILESIZE);//piirretaan aina alle maata decot ym toimii
			
			ctx.drawImage(sprite, tileList[map[y][x]].y, tileList[map[y][x]].x, SPRITE_TILESIZE, SPRITE_TILESIZE, posX, posY, TILESIZE, TILESIZE);//piirretaan tilet tiles listan mukaan
							
			posX += TILESIZE;//tarvitsee siirtaa aina kuvan tilen koon (pikselien) maaralla	
		}		
		posX = 0; 
		posY += TILESIZE;
	}
	posX = 0; //alustetaan takaisin nollaan lopussa
	posY = 0;
}



function initActors()
{
	actorList = []; //kaikki enemyt + pelaaja tulee listaan
	
	for (var e = 0; e <= ACTORS; e++) //tehdaan actorit ACTORS maaraa kuin monta
	{
		var actor = {y:0, x:0, id:0, isPlayer:false, AiComponent:randomInt(0,1), hp:0, ar:0, lvl:0, xp:0, dxt:0, str:0, dmg:0}; //x,y,isplayer maaraa onko enemy vai pelaaja, health points, armor, lvl kaytetaan combatissa aicomponent maarittelee miten kayttaytyy 0,1 0 agroo aina 1 venailee etta pelaaja lahella
		do 
		{
			actor.y = randomInt(0,ROWS-1); //randomilla y mutta katotaan etta kentan sisalla
			actor.x = randomInt(0,COLS-1); //randomilla x mutta katotaan etta kentan sisalla
		}
		while (actorMap[actor.y + "_" + actor.x] != null) //tehdaan niin kauan kuin actor map on eri kun nul
		{
			if (map[actor.y][actor.x] >= SPRITEROWS && map[actor.y][actor.x] <= SPRITEROWS*3)//tehdaan actori vain ja ainoastaan maa tileihin +7 koska ignoroidaan ensimmaiset seina tilet spritesheetista
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
	if (FROM_SAVE==true)
	{
		player.y = playerY;
		player.x = playerX;
		FROM_SAVE=false;
	}
	else
	{
		player.y = newLadder.y;//uudet koordinaatit HUOM newladder vahan hamaa tassa otta globaalista default positionin HUOM
		player.x = newLadder.x;
	}
	
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
	
	if (UP_DOWN)//ladderin paikka ylhaalla tai alhaalla kulmassa
	{
		UP_DOWN = false;
	}
	else
	{
		UP_DOWN = true;
	}
	startBurning={y:player.y, x:player.x};
	carveToLadder(UP_DOWN);
}



function drawActors()
{
//console.log("piirretaan actorit");
	for (var a in actorList)//kaydaan actorlista lapi
	{
	//console.log(a);
		if (actorList[a].hp > 0) //jos actorsien hp on isompi kun 0 piirretaan se
		{	// !!!!HUOM HUOM!!!! Animoidessa liikkumista ei pitaisi kertoa TILESIZILLA !!!HUOM HUOM!!!!
			//ctx.drawImage(enemy,actorList[a].x*PIXELSIZE,actorList[a].y*PIXELSIZE);//enemyn/pelaajan piirto. kerrotaan pikselien koolla etta menee tilet kohilleen tosin voisi kertoa jo x,y vaiheessa initialisoinnissa
			ctx.drawImage(sprite, tileList[actorList[a].id].y, tileList[actorList[a].id].x, SPRITE_TILESIZE, SPRITE_TILESIZE, actorList[a].x*TILESIZE, actorList[a].y*TILESIZE, TILESIZE, TILESIZE);//uusi piirto tapa spritesheetista
		}
	}			
}



function canGo (actor, dir)//kaydaan lapi mihin voi kavella
{
	return actor.x + dir.x >= 0 && //ei liikuta ulos kentalta
		actor.x + dir.x <= COLS - 1 &&
			actor.y + dir.y >= 0 &&
		actor.y + dir.y <= ROWS - 1 &&
		map[actor.y + dir.y][actor.x + dir.x] >=sprite.height/SPRITE_TILESIZE //kaikkialla mapissa missa on aloitus Spritesheetin ensimmaisesta sarakkeesta-niin paljon kun seina tileja on alaspain tormataan
}



function clearLastTile(actor) 
{
	var last_tile = map[actor.y][actor.x];//muistetaan positioni	
	
	ctx.clearRect(actor.x*TILESIZE, actor.y*TILESIZE, TILESIZE, TILESIZE);//clearataan last tile vekee
	ctx.drawImage(sprite, tileList[THEME.floor].y, tileList[THEME.floor].x, SPRITE_TILESIZE, SPRITE_TILESIZE, actor.x*TILESIZE, actor.y*TILESIZE, TILESIZE, TILESIZE);//piirretaan maata takaisin	
	ctx.drawImage(sprite, tileList[last_tile].y, tileList[last_tile].x, SPRITE_TILESIZE, SPRITE_TILESIZE, actor.x*TILESIZE, actor.y*TILESIZE, TILESIZE, TILESIZE);//piirretaan tile missa oltiin takaisin napataan tile listasta	
}



function sleep(milliseconds) 
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) 
	{
		if ((new Date().getTime() - start) > milliseconds)
		{
		break;
		}
	}
}


function Action(acted)
{
	tileChek(player);//chekkaillaan missa tilessa playeri seisoo ja mita alla on
	if(acted)
	{	
		for (var enemy in actorList) //kaydaan actorlista lapi
		{
			if(enemy == 0)//ei huomioida pelaajaa
			{
				continue;
			}
			
						
			var e = actorList[enemy]; //saa arvon tyyliin actorlist[1]
			actorAi(e);//liikuttelu funktio
			
			//console.log(actorList[enemy]);
			/*
			if (e != null && e != -1) //liikutellaan enemyä jos se ei o kuollu tai null VANHA TAPA ENNEN KUIN SLICETTIIN LISTASTA POIS
			{
				actorAi(e);//liikuttelu funktio
			}
			*/
		}
	}
	
	
	if (player.hp <= 0)//jos pelaaja kuollu
	{
		var ekilled = KILLED;
		modifyElement("EndDiv", "block"); //naytetaan end divi	
		modifyElement("TextDiv", "none"); //disaploidaan tekstidivi
		document.getElementById("killed").innerHTML = ekilled;//muokataan end diviin statistiikkaa tapetuista enemyista
		PLAYED = "false"; //ei loadata alussa
		localStorage["sPLAYED"] = PLAYED; 	
	}
	
	GuiUpdate();//upataan gui kun kaikki tehty mitä voi tehä
				// !!!!HUOMHUOM!!!! ennen kun piirretaan ukot tiedetaan mihin ne on menossa TAHAN tarvisi jonkinnakoista animaatio luuppia !!!!HUOMHUOM!!!!
	drawActors();//piirretaan actorit
}



function loadTowers(FromLadder)
{
	//console.log(FromLadder);	
	loadGame();

	for(var i = 0; i <= TOWERAMMOUNT; i++)
	{
		if(FromLadder==false)
		{
			createDIV(TOWERS1["tower"+i].TOWERS[0].id,"StartFromMap(id)","tower.png","imgId"+i,"towers");//duunataan divit muistista
		}
		
		
		var elm = document.getElementById("tower"+i);//napataan id
		
		elm.style.position="absolute";
		elm.style.left=TOWERS1["tower"+i].TOWERS[0].left; //asetetaan paikka left
		elm.style.top=TOWERS1["tower"+i].TOWERS[0].top; //asetetaan paikka top
		elm.style.display=TOWERS1["tower"+i].TOWERS[0].display;//naytetaan toweri
		elm.setAttribute("class", TOWERS1["tower"+i].TOWERS[0].class);//asetetaan claassi
		elm.setAttribute("used", TOWERS1["tower"+i].TOWERS[0].used);//asetetaan used
		elm.setAttribute("seed", TOWERS1["tower"+i].TOWERS[0].seed);//asetetaan seed
		elm.setAttribute("levels", TOWERS1["tower"+i].TOWERS[0].levels);//asetetaan levels
		
	}
}



function actorAi(actor) //taa tarttee viela viilausta vahan liikaa toistoa
{
	var dx = player.x - actor.x;
	var dy = player.y - actor.y;
	var directions = [ { x: -1, y:0 }, { x:1, y:0 }, { x:0, y:-1 }, { x:0, y:1 } ]; //directionit listattuna
	
	//sleep(2000);
	
	if (actor.AiComponent == 0) //jos aicomponentti on 0 agrotaan aina
	{
		if (Math.abs(dx) > Math.abs(dy)) //muutetaan x ja y absoluuttisiksi numeroksi
		{
			if(dx < 0)
			{
				//vasen
				dir = directions[0];
			}
			else
			{
				//oikee
				dir = directions[1];
			}
		}
		else
		{
			if (dy < 0)
			{
				//ylos
				dir = directions[2];
			}
			else
			{
				//alas
				dir = directions[3];
			}
		}
	}
	else if (actor.AiComponent == 1) //jos aicomponent on 1 
	{
		if (Math.abs(dx) + Math.abs(dy) > 5) //jos 5 tilen matka pelaajaan
		{
			dir=randomInt(0, directions.length); //liikutaan randomilla
			//console.log(dir);
		}
		else //jos alle viis tileä agrotaan
		{
			if (Math.abs(dx) > Math.abs(dy)) //muutetaan x ja y absoluuttisiksi numeroksi
			{
				if(dx < 0)
				{
					//vasen
					dir = directions[0];
				}
				else
				{
					//oikee
					dir = directions[1];
				}
			}
			else
			{
				if (dy < 0)
				{
					//ylos
					dir = directions[2];
				}
				else
				{
					//alas
					dir = directions[3];
				}
			}
		}
	}
	else if (actor.AiComponent == 2) //jos aicomponent on 2 
	{
		var count = 6; //countit kuin monta kertaa voidaan heittaa noppaa	
	
		while (!canGo(actor, dir))//jos törmataan seinaan katotaan canGolla heitetaan noppaa ja etitaan suunta kunnes loytyy TÄSSÄ BUGI törmäysta ei katota jos tormaa toiseen vihuun
		{					
			var a = randomInt(0,3); //heitetaan noppaa
			count--;//miinustetaan countteja
			dir = directions[a]; //asetetaan directioni
		
			if (count == 0)//jos heitetty noppaa countien maara luultavasti ei voida liikkua returnoidaan false
			{
				return false;
			}		
		}	
		
	}

	var count = 6; //countit kuin monta kertaa voidaan heittaa noppaa	
	
	while (!canGo(actor, dir))//jos törmataan seinaan katotaan canGolla heitetaan noppaa ja etitaan suunta kunnes loytyy TÄSSÄ BUGI törmäysta ei katota jos tormaa toiseen vihuun
	{					
		var a = randomInt(0,3); //heitetaan noppaa
		count--;//miinustetaan countteja
		dir = directions[a]; //asetetaan directioni
		
		if (count == 0)//jos heitetty noppaa countien maara luultavasti ei voida liikkua returnoidaan false
		{
			return false;
		}		
	}	

	aiMove(actor, dir);//liikutaan
}



function aiMove(actor, dir) //ain liikuttelu funkkari
{
	var newKey = (actor.y + dir.y) + '_' + (actor.x + dir.x);
	
	if (actorMap[newKey] != null) //jos tormatty actoriin(pelaaja vihu ym)
	{
		var victim = actorMap[newKey];
		if (victim.isPlayer)//jos on osuttu pelaajaan
		{
			if (actor.hp<=3)//jos ai:n hp vahissa
			{
				var a=randomInt(0,5);//heitetaan noppaa

				if (a==2)//jos noppa saa luvun 2
				{
					console.log("vihu "+[actorList.indexOf(actor)]+" pakenee")
					TextLogUbdate("Enemy is fleeing");
					actor.AiComponent=2;//|TODO| parempi pakenemis ai componentti|TODO| //vaihdetaan ai actorin ai componenttia
				}
			}
			
			combat(actor, victim);
			
			if (victim.hp <= 0)//jos osuttu ja tapettu tassa tiedetaan jos pelaaja kuollut
			{
				actorMap[newKey] = null; //poistetaan  actormapista
				clearLastTile(victim);//clearataan pelaaja vekeen
			}	
		}
		else if (victim.isPlayer==false)
		{
			//TODO  liikkuminen random suuntaan ns flankkaamaan pelaajaa pain jos osuttu toiseen vihuun 
			console.log("vihu tormas vihuun");
		}
	}
	else
	{
		clearLastTile(actor);//piirretaan tile paikalleen ennen liikkumista
		actorMap[actor.y + '_' + actor.x] = null; //pyyhitään referenssi actorMapista
	
		actor.y += dir.y; //liikutaan
		actor.x += dir.x;
		
		actorMap[actor.y + '_' + actor.x] = actor; //uusi referenssi actormappiin		
	}
	
}



function moveTo(actor, dir)
{
	if (!canGo(actor, dir))//jos pystytään liikkumaan zekataan cangolla
	{
		return false; //returnataan falsea jossei pysty liikkumaan
	}
	else if (player.hp <= 0) // jos pelaaja kuollu
	{
		return false; //ei liikuta returnoidaan false
	}
	
	var newKey = (actor.y + dir.y) + '_' + (actor.x + dir.x);//newkey on uusi paikka actormappia varten
	
	if (actorMap[newKey] != null) //ollaan törmätty toiseen actoriin tassa vois periaatteessa kysella onko enemy
	{
		//TODO parempi combatti
		var victim = actorMap[newKey];	
		
		combat(actor, victim);//combatti
			
		if (victim.hp <= 0)
		{
			KILLED++;//lisataan yksi kuollut enemy
			
			console.log("player tappoi " + [actorList.indexOf(victim)]);
			
			actorMap[newKey] = null; //poistetaan  actormapista
			
			var index=actorList.indexOf(victim);//victimin indexi
			//actorList[actorList.indexOf(victim)] = -1; //lisataan actorlistaan -1 sama kun ois kuollu VANHA TAPA
			actorList.splice(index,1); //UUSI TAPA otetaan ko objekti vekeen listasta
			//tanne voisi myos laittaa jaamaan enemyn ruho			
			player.xp++;//lisataan playerin xp:ta
			if (player.xp == 10 * PLAYERLVL)//player levelin mukaan nostetaan tasoa lvl 1-2 10xp 2-3 20xp jne
			{
				player.lvl++;
				player.xp = 0;
				var indicate = "Lvl";//kaytetaan indicaattoria levelupin nayttamiseen
				IndicatorInit(player, indicate);//indikoidaan pelaajan paalla
			}
			
			clearLastTile(victim);//clearataan enemy vekeen 		
			createLoot(victim);//spawnataan loottia
			
			if (ARENAMODE_ON==true)//kun pelataan areenaa
			{
				createArena();//luodaan uusi areena !!HUOM HUOM voisi antaa loottia ja spawnata itemiä pottua ym ja uuden monsun
			}
		}
	}
	else
	{
		clearLastTile(actor);//piirretaan tile paikalleen ennen liikkumista
		actorMap[actor.y + '_' + actor.x] = null; //pyyhitään referenssi actorMapista
	
		actor.y += dir.y; //liikutaan y,x
		actor.x += dir.x;
	
		actorMap[actor.y + '_' + actor.x] = actor; //uusi referenssi actormappiin
	}
	console.log("---pelaaja kaytti vuoron---")
	return true;//otetaan vuoro
}



function combat(actor, victim)
{
	var damage=actor.dmg-victim.ar;//laskukaava daman maaralle actor.dmg maaraytyy chestissa kun noukkii kateen aseen
	var splatter=0;
	
	if (damage <= 0)
	{
		switch(randomInt(0, 1))//50% chaansi saada critical hit tata voisi viela tviikata
		{
		case 1:
		damage=actor.dmg/2;
		break;
		
		case 0:
		damage=0;
		break;
		}
	}
	
	victim.hp-=damage;//miinustetaan victimia daman maaralla
	
	if(damage>=5)//jos tekee paljon lamaa
	{
		splatter=randomInt(3,4);//isompi splatteri
	}
	else
	{
		splatter=randomInt(1,2);//jos vahemman pienempi splatteri
	}
	
	if(map[victim.y][victim.x]==THEME.floor)//tehdaan verta vain lattialle
	{
		map[victim.y][victim.x] = THEME.floor;//lattia takaisin
		map[victim.y][victim.x] = SPRITEROWS*5+splatter;//paalle splatteri verta
		drawMap();//updatetaan kentta
	}
	
	console.log("actor: " + [actorList.indexOf(actor)] + " did: " + damage + " dmg" + " to " + [actorList.indexOf(victim)]);
	
	
	if (victim.isPlayer)//jos victimi on player
	{
		var indicate = ('-'+damage); 
		//console.log(indicate);
		setTimeout(function(){IndicatorInit(victim,indicate);}, 500);//delayataan vahan etta nakyy BUGITTAA jos kaks tyyppia tekee lamaa samaan aikaan BUGAA kanssa jos pelaaja tekee vaikka 2 lamaa ei nay	
	}
	else//jos victimi on joku muu eli enemy
	{
		var indicate = ('-'+damage); 
		//console.log(indicate);
		IndicatorInit(victim,indicate);
		
		if (HAND[0].durability=="none") //jos aseena nyrkit niin dura on none
		{
			HAND[0].durability="none";
		}
		else //jos aseena joku muu miinustetaan duraa
		{
			HAND[0].durability--; // tassa muokataan aseen kestavyytta ehka parempi tyyli kun yhdella miinustaminen voisi olla
		}
		
		if (HAND[0].durability<=0 && HAND[0].durability != "none")//jos ase hajonnut
		{
			HAND[0]={id:"nothing",dmg:0,durability:"none"};//asetetaan nyrkit takaisin
			FULLDMG=HAND[0].dmg+PLAYERDMG;//daman maara takaisin
			player.dmg=FULLDMG;
			GuiUpdate();//upataan gui
			GumpCreator("Weapon got destroyed","","none");
			//alert("Weapon got destroyed");
			console.log("weapon got destroyed");
		}
	}
	
}



function createLoot(actor)
{
	if (map[actor.y][actor.x] >= SPRITEROWS*2)//loottia tehaan vain maatileihin returnoidaan pois jossei olla maatileissa
	{
		return;
	}
	
	var lootarray = [{name:"potion", hp:0, id:45}];//tahan tulee itemit mita voi dropata id on kuin mones spriten tile drawwaukseen
	var i = randomInt(0, 4);//chaansi droppaukselle
	
	if (i <= lootarray.length - 1)//miinus yks koska lenght on 2 mutta alkaa oikeasti 0
	{
		if (lootarray[i].name == "potion")//katsotaan nimesta mita tuli
		{
			console.log("potion");
			var h = randomInt(1, 3);//annetaan vaikutus 1-3
			lootarray[i].hp = h;
			map[actor.y][actor.x] = lootarray[i].id;//isketaan mappiin
		}

		ctx.drawImage(sprite, tileList[lootarray[i].id].y, tileList[lootarray[i].id].x, SPRITE_TILESIZE, SPRITE_TILESIZE, actor.x*TILESIZE, actor.y*TILESIZE, TILESIZE, TILESIZE);//piirretaan potion
	}		
}



function IndicatorInit(actor, indicate)//idicaattorin initialisointi 
{
	this.indicate=indicate;
	this.actor=actor;
	
	canMove = false;
	gctx.fillStyle = "red"; //vari
	gctx.font = "32pt Verdana"; //fontti
	step = 0; //step takas 0
	steps = actor.y - 32;//daman maara lentaa yhen tilen pikselien maaran ylospain
	Indicator(actor,indicate);
}



function Indicator(actor,indicate)/////HUUOOOMMM pitaa tehda niin et kattoo dilayn tj jonkin mukaan ettei mee cpuun mukaan vaan esm fpsien 
{	
	step--; //miinustetaan steppei
	gctx.clearRect(0, 0, gcanvas.width, gcanvas.height);//clearataan grafiikka canvasta
	gctx.save();//tallennetaan entinen positioni
	gctx.translate(0, step);//siirretaan daman maaraa pikseli kerrallaan
	gctx.fillText(indicate.toString(), actor.x*TILESIZE, actor.y*TILESIZE+TILESIZE);//fillataan teksti ja tehdaan daman maarasta stringi dama lahtee actorin positionista +32 koska graphics canvas on yli  pelicanvaksen 32 pikselia y akselilla
	gctx.restore();//luodaan uudestaan
		
		if (step >= steps)
		{
			clearTimeout(timeout);//clearataan timeoutti
			timeout = setTimeout('Indicator(actor,indicate)', delay);//timeoutti delayn mukaan luupataan damageindicaattoria
		}
		else if (steps < 0)
		{
			gctx.clearRect(0, 0, gcanvas.width, gcanvas.height);//clearataan ei jaa leijumaan numbaa
			timeout = null;
			canMove = true;
		}
	
}



function createDIV(id,onclick,src,imgId,whereId)//tata kaytetaan luomaan uusi divi
{
	this.id=id; //divin id
	this.onclick=onclick;//divin onclick funktio
	this.src=src;//divin image
	
	var whereId=document.getElementById(whereId);//mihin divi tehdaan /minka sisalle
	
	var Img = new Image();
	Img.id = imgId;
	Img.src = src;
	
	var div = document.createElement('div');//luodaan uusi elementti divi
	div.setAttribute("id", id);//luodaan id atribuutti
	div.setAttribute("onclick", onclick);//luodaan onclick atribuutti
	
	div.appendChild(Img);//appentoidaan image
	//console.log(div);
	
	whereId.appendChild(div);
	//whereId.innerHTML+=div.outerHTML;//luodaan tekstina divi
}



function GuiUpdate()//ubdatetaan guita tanne tulee xp yms setit
{
	document.getElementById("hp").innerHTML = player.hp;
	document.getElementById("xp").innerHTML = player.xp;
	document.getElementById("lvl").innerHTML = player.lvl;
	document.getElementById("hand").innerHTML = HAND[0].id+" Damage:"+FULLDMG+ " Durability:"+HAND[0].durability;
}



function TextLogUbdate(text) //RAAKILE tarvisi scrollaantuva setti etta kaikki logit perajalkeen etta toimisi esm combatissa ym RAAKILE
{
	document.getElementById("TextDivtext").innerHTML = text;
}



function checkCoordinates(x,y)
{
	//console.log(x+" "+y);	
	for(var a in actorList)//kaydaan koko actorlista lapi
	{
		if( a == 0)//jos actori on pelaaja skipataan ja jatketaan
		{
			continue;
		}
		
		if (actorList[a].x == x && actorList[a].y == y)//jos actorlistan actorin x ja y on samat kuin klikatun koodinaatin
		{
			//TODO naytetaan actorin levelli armori healtti ym TODO//
			alert("id: "+actorList[a].id+" "+"hp: "+actorList[a].hp+" "+"ar: "+actorList[a].ar+" "+"lvl: "+actorList[a].lvl);
			
			//GumpCreator("id: "+actorList[a].id+" "+"hp: "+actorList[a].hp+" "+"ar: "+actorList[a].ar+" "+"lvl: "+actorList[a].lvl);
		}
		
		
	}
	
}



function saveGame()//localstorageen atribuutit
{
	localStorage["sPLAYERLVL"] = PLAYERLVL;
	localStorage["sPLAYERXP"] = PLAYERXP;
	localStorage["sPLAYERHP"] = PLAYERHP; 
	localStorage["sPLAYERSTR"] = PLAYERSTR; 
	localStorage["sPLAYERDXT"] = PLAYERDXT;	
	localStorage["sPLAYERDMG"] = PLAYERDMG;
	localStorage["sFULLDMG"] = FULLDMG;	
	localStorage["sSEED"] = SEED;
	localStorage["sLEVELS"] = LEVELS;
	localStorage["splayerY"] = player.y;
	localStorage["splayerX"] = player.x;
	localStorage["sUP_DOWN"] = UP_DOWN;
		
	for(var i = 0; i <= TOWERAMMOUNT; i++)
	{
		localStorage["sTOWER1a"+i] = JSON.stringify(TOWERS1["tower"+i]);//VIKAAAA!		
	}
	
	localStorage["sHANDID"] = HAND[0].id;
	localStorage["sHANDDAMAGE"] = HAND[0].dmg;	
	localStorage["sHANDDURABILITY"] = HAND[0].durability;	
	
	localStorage["sKILLED"] = KILLED;
}



function loadGame()//parsetaan stringit inteiksi ja annetaan pelaajalle localstoragesta
{
	PLAYERLVL=parseInt(localStorage["sPLAYERLVL"]);
	PLAYERXP=parseInt(localStorage["sPLAYERXP"]);
	PLAYERHP=parseInt(localStorage["sPLAYERHP"]);
	PLAYERSTR=parseInt(localStorage["sPLAYERSTR"]);
	PLAYERDXT=parseInt(localStorage["sPLAYERDXT"]);
	PLAYERDMG=parseInt(localStorage["sPLAYERDMG"]);
	FULLDMG=parseInt(localStorage["sFULLDMG"]);
	SEED=parseInt(localStorage["sSEED"]);
	LEVELS=parseInt(localStorage["sLEVELS"]);
	playerY=parseInt(localStorage["splayerY"]);
	playerX=parseInt(localStorage["splayerX"]);
	UP_DOWN=(localStorage["sUP_DOWN"]);
	
	for(var i = 0; i <= TOWERAMMOUNT; i++)//loadataan towerien tiedot	
	{		
		TOWERS1["tower"+i] = JSON.parse(localStorage.getItem("sTOWER1a"+i));
	}
	
	HANDDAMAGE=parseInt(localStorage["sHANDDAMAGE"]);
	HANDID=(localStorage["sHANDID"]);
	HANDDURABILITY=parseInt(localStorage["sHANDDURABILITY"]);
	HAND[0]={id:HANDID, dmg:HANDDAMAGE, durability:HANDDURABILITY};
	
	
	KILLED=parseInt(localStorage["sKILLED"]);
	
	player.lvl = PLAYERLVL;
	player.xp = PLAYERXP;
	player.hp = PLAYERHP;
	player.str = PLAYERSTR;
	player.dxt = PLAYERDXT;
	player.dmg = FULLDMG;
	
	GuiUpdate();//upataan gui
	
}



function timeToBurn()
{
	var burningTile; //random paikka palaneelle tilelle aloitetaan ex ladderista TAMA BUGAA!!saataa takaisin arvon last ladderista!!
	burningTile={y:startBurning.y,x:startBurning.x};
	var count = 5;
	console.log("burningtile=");
	console.log(burningTile);
	
	for (var t = 0; t <= 3; t++)//tehdaan 4 tilea kerralla
	{
	count--;
	burningTile.x += randomInt(0,2);//annetaan x,y palavalle tilelle
	burningTile.y += randomInt(0,2);
		
	if (burningTile.x >= COLS)//koitetaan olla menematta kentan yli
	{
		burningTile.x = COLS;
	}
	else if (burningTile.x <= 0)
	{
		burningTile.x = 0;
	}
			
	if (burningTile.y >= ROWS-1)
	{
		burningTile.y = ROWS-1;
	}
	else if (burningTile.y <= 0)
	{
		burningTile.y = 0;
	}	

	if (map[burningTile.y][burningTile.x] == 48)
	{
		t--;
	}
	
	if (count == 0||actorMap[burningTile.y+"_"+burningTile.x]!=null||map[burningTile.y][burningTile.x]==SPRITEROWS*5)//jos count 0 eli kaikkialla jo tulta tai actori paikassa mihin tuli pitaisi duunata breakataan
	{
		break;
	}
	
	//console.log(burningTile);	
	//console.log(actorMap[burningTile.y+"_"+burningTile.x]);
	
	map[burningTile.y][burningTile.x] = SPRITEROWS*5; //valitaan palanut/palava tile spritesheetista
	ctx.clearRect(burningTile.x*TILESIZE, burningTile.y*TILESIZE, TILESIZE, TILESIZE); //clearataan 
	//tahan voi laittaa maatilen jos burningtile on lapinakyva
	ctx.drawImage(sprite, tileList[SPRITEROWS*5].y, tileList[SPRITEROWS*5].x, SPRITE_TILESIZE, SPRITE_TILESIZE, burningTile.x*TILESIZE, burningTile.y*TILESIZE, TILESIZE, TILESIZE);//piirretaan palanut/palava tile	
	}
	
	
}



function modifyElement(element, modifier)//helpottaa elementtien näyttämistä/piilottamista
{
	this.element = element;
	this.modifier = modifier;
	
	element = document.getElementById(element);
	element.style.display = modifier;
}



function GumpCreator(text,OkButton,CancellButton) //BUGI tama bugittaa nappuloiden osalta ei chestissa toimi BUGI
{	
/*kaytetaan tyyliin GumpCreator("tama on naytettava teksti","","none") 
none merkkaa mika nappula ei nay tyhja nakyy tassa tapauksessa ok nakyy*/
	
	this.text=text;
	this.OkButton=OkButton;
	this.CancellButton=CancellButton;

	document.getElementById("GumpText").innerHTML = text;//asetetaant eksti
	document.getElementById("OkButton").style.display=OkButton;//muokataan displayta
	document.getElementById("CancellButton").style.display=CancellButton;
	modifyElement("GumpDiv", "block");//naytetaan divi
}



function GumpButton(a)//BUGI chestissa ei toimi BUGI gumpcreatorin gumpin nappulat kayttaa tata
{
	modifyElement("GumpDiv", "none");
	console.log(a);
	return (a);
}



function create()
{	
	TURNCOUNT = 0;//kaytetaan palamisen alkamiseen takasin 0 alussa

	Math.seedrandom(SEED);//siidataan
	
	console.log("SEED = " + SEED);
	console.log("localstorage=");
	console.log(localStorage);
	
	modifyElement("main", "block");//main divi nakyy	
	modifyElement("TextDiv", "block");
	
	modifyElement("EndDiv", "none");//end divia ei nayteta	
	modifyElement("start", "none");//startdivia ei nayteta
	
	initTheme(); //initialisoidaan theme
	initMap();//tehdaan mappi array
	initActors();//intialsoidaan actorsit
	
	drawMap();//piiretaan mappi
	drawActors();//piiretaan actorsit

}