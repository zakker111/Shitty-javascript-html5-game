function mainMenu() //main menuun eli start ruutu näytetaan
{
	modifyElement("main", "none");
	modifyElement("charactermenu", "none");	
	
	modifyElement("start", "block");

	removeTowers();//kun mennaan main menuun tuhotaan entiset tornit	

}



function StartFromSave() //loadista kun painetaan
{
	loadGame();
	FROM_SAVE = true;
	if (LEVELS <= 0)
	{
		modifyElement("start", "none");
		modifyElement("map", "block");
		
		loadTowers(false);	
		
	}
	else
	{
		create();
	}
}



function StartNewArena()//arenamodin nappulaa kun painaa
{
	ARENAMODE_ON=true;
	initDefaults();
	modifyElement("start", "none");
	modifyElement("charactermenu", "none");
	createArena();

}



function StartNewGame() //uuden pelin aloitus
{
	localStorage.clear();//clearataan localstorage jos alotetaan uusi peli ettei mikaan bugita ja alotetaan tyhjalta poydalta
	
	initDefaults();
	
	modifyElement("start", "none");
	modifyElement("charactermenu", "none");
	modifyElement("map", "block");		
	
	var seedElm = document.getElementById("seed");
	SEED = seedElm.valueAsNumber;
	
	Math.seedrandom(SEED);
	
	
	for(var i = 0; i <= TOWERAMMOUNT; i++)
	{
		
		createDIV("tower"+i,"StartFromMap(id)","tower.png", "imgId"+i, "towers");//luodaan uusi divi BUGITTAA KUOLEMAN JALKEEN PITAISI ENTISET TOWERIT CLEARATA TJ
		
		var elm = document.getElementById("tower"+i);//napataan id
		
		var rtop = randomInt(0, mapImage.height-towerImage.height); //random paikka towerille mapin kuvan mukaan miinustettuna towerin kuvan koko ettei mene yli mapin
		var rleft = randomInt(0, mapImage.width-towerImage.width); 
		var left=rleft+"px";
		var top=rtop+"px";
		var levels = randomInt(LEVELS_MIN,LEVELS_MAX);//levels randomilla MIN ja MAXIN mukaan
		var seed = SEED++; //seedia lisataan yhdella
		
		elm.setAttribute("levels",levels); //asetetaan levelien maara tornille 
		elm.setAttribute("used", false);//alustetaan used falseks eli ei viela kayty tornissa
		elm.setAttribute("class", "towerImage");
		elm.setAttribute("seed",seed*levels);//tornin seed saa seed*levels (pitaisi tulla erillaisia kenttia)
		
		elm.style.position="absolute";
		elm.style.left=left //asetetaan paikka left
		elm.style.top=top; //asetetaan paikka top
		elm.style.display = "block";//naytetaan toweri
		
		//JSON objekti tornin tiedoista
		TOWERS1[elm.id]={"TOWERS":[
		{
		"id":elm.id, 
		"left":elm.style.left,
		"top":elm.style.top, 
		"position": elm.style.position,
		"display":elm.style.display, 
		"seed":elm.getAttribute("seed"),
		"levels":elm.getAttribute("levels"),
		"used":elm.getAttribute("used"),
		"class":elm.getAttribute("class")
		}
		]}
		
	}
	console.log("JSON TOWERS1= ");
	console.log(TOWERS1);
	saveGame(); // savetetaan peli
}



function StartFromMap(id) //kun painetaan tornia mapissa 
{
	var elm = document.getElementById(id);//getataan seedin arvo 
	var used = elm.getAttribute("used");//used saa arvon elmentin atribuutista used
	
	if(used=="false")//jos ei olla kayty tornissa luodaan kentta
	{
		elm.setAttribute("used", true);//ollaan kayty tornissa
		
		SEED = elm.getAttribute("seed");//asetetaan seedi	
		LEVELS = elm.getAttribute("levels");//towerin levelssit otetaan towerin atribuutista "levels"
	
		modifyElement("map", "none");
	
		canMove = true; //voidaan liikkua
		
		console.log("elm.id= "+elm.id);

		TOWERS1[elm.id].TOWERS[0].used=true; //used trueksi tiedetaan ettei voida menna samaan torniin enaa
			
		saveGame(); //savetetaan
		create(); //creatoidaan leveli
		startBurning = {y:player.y,x:player.x};
		GuiUpdate(); //upataan gui
	}
}



function characterMenu()
{
	modifyElement("start", "none");
	modifyElement("charactermenu", "block");
}



function disableArkku()//buttoni arkkudivissa painettaessa disaploi arkkudivin nayton
{
	modifyElement("ArkkuDiv", "none");
}



function removeTowers()
{
	for(var i = 0; i <= TOWERAMMOUNT; i++) //kaydaan entiset tornit lapi ja tuhotaan ne divit
	{
		var elem = document.getElementById("tower"+i);
		elem.remove();
	}
}

