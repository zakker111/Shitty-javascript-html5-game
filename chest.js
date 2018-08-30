function pickItem() //itemien initialisointi
{
	items = [];//item lista itemit joita voidaan saada nimet vahan ehka outoa kuvat tarvitsisi olla erikseen
	var itemId=["axe", "flail", "hammer", "dagger", "sword", "potion"];//tahan pitaa listata aseet tilelistassa
	
	for (var i=itemId.length; i==0, i--;)//loopataan itemit tehdaan niille atribuutit
	{
		if(i==5)
		{
			var item={image:"", hp:randomInt(3,5)};
		}
		else
		{
			var item={image:"", weight:randomInt(1,15), dmg:randomInt(2,6), hp:0, durability:randomInt(5,10) };
		}
		//IDCOUNT++;//itemit saavat erillaisia ideita
		item.id=itemId[i];//+IDCOUNT;
		item.image=itemImagePos[i];
		items.push(item);
	}
	
}



function Openchest() //taalla muistetaan mita chesti sisalsi
{
	var elm = document.getElementById("ArkkuDiv");
		if (map[player.y][player.x] == SPRITEROWS*4+1 && chest[player.y,player.x].items==0)//jos arkku avattu ja tyhja
		{
			console.log("chest is empty");
			elm.style.display="none";//jos arkku tyhja ei nayteta arkku gumppia
		}
		else
		{
			elm.style.display="block";//jos arkussa esineita naytetaana arkku gumppi
		}
		
	for(var r=0; r<=2; r++)//tyhjennetaan kuvat ja tekstit
	{
		var elmImage = document.getElementById("Item"+r);
		elmImage.style.display="none";
		
		var elmText = document.getElementById("Itemtext"+r)
		elmText.style.display = "none";
	}
		
	if(map[player.y][player.x] == SPRITEROWS*4)//jos avaamaton arkku täytetään se esineillä
	{
		chest[player.y,player.x] = new chest;//tehdaan uusi chesti playerin koodinaatit nimeksi
		for(var i=randomInt(0,2); i <= 2; i++)//montako itemia tulee olemaan montako kertaa loopataan lapi
		{
			pickItem();
			console.log(i);
			var item = items[randomInt(0,items.length-1)];//randomilla itemi item listan koon mukaan
			chest[player.y,player.x].items.push(item);//tyonnetaan se chest oliolle
		}
	console.log("avasit avaamattoman arkun");
	}
	for(var a in chest[player.y,player.x].items)//piirretaan esineet arkusta
	{
		var elmImage = document.getElementById("Item"+a)//mita kuvaa vaihetaan
		elmImage.style.backgroundPosition=chest[player.y,player.x].items[a].image; //chrome tykkaa tasta noukitaan positioni items listasta
		elmImage.style.display = "block";//naytetaan kuvat
		elmImage.setAttribute("itemId",chest[player.y,player.x].items[a].id); 
		
		
		var elmText = document.getElementById("Itemtext"+a)//jos hp potioni
		if(chest[player.y,player.x].items[a].hp>=1)
		{
			elmText.style.display = "block";//naytetaan tekstit
			elmText.innerHTML="Hp+ "+chest[player.y,player.x].items[a].hp;	
		}
		else // jos aseet
		{
			elmText.style.display = "block";//naytetaan tekstit
			elmText.innerHTML="Weight "+chest[player.y,player.x].items[a].weight+" Damage "+chest[player.y,player.x].items[a].dmg+ " Durability "+chest[player.y,player.x].items[a].durability;
		}
	}
	map[player.y][player.x] = SPRITEROWS*4+1;//laitetaan mappiin avattu arkku	
}



function chest(items)//chest imasee itemeita listallisen
{
	this.items = [];
}



function chestPick(id)//TODO itemit inventory listaan/kateen/paalle wighti maaraa pystyykö laittamaan kateen promptataan jossei pysty ja jos halutaan ottaa kateen
{
	var elmImage = document.getElementById(id);
	var elmText= document.getElementById("Itemtext"+elmImage.id.substring(4,5));
	var itemId = document.getElementById(id); 
	
	if(itemId.getAttribute("itemId")=="potion")//muokataan tekstia jos pottu tai aseet kyeseessa
	{
		var text="do you want to drink this potion ";
	}
	else
	{
		var text = "Do you want to take this weapon to your hand, this will remove "+HAND[0].id;
	}
		
	if (confirm(text) == true) //oman gumbin buttonit eivat toimi koska eivat pauseta kuten alert boksi scriptia
	{
		elmImage.style.display="none";
		elmText.style.display="none";
		
		itemId=itemId.getAttribute("itemId");
		console.log(itemId);
		for(var a in chest[player.y,player.x].items)//kaydaan arkun esineet lapi
		{
			if(itemId==chest[player.y,player.x].items[a].id)//ideen mukaan mita tuhotaan
			{
				if(chest[player.y, player.x].items[a].hp>=1)//jos pottu kyseessa
				{
					var indicate=('+' + chest[player.y, player.x].items[a].hp);//indicaattorille
					console.log(chest[player.y, player.x].items[a]);//lisataan hp:n maara
					player.hp+=chest[player.y, player.x].items[a].hp;
					TextLogUbdate("You drank potion hp + "+ chest[player.y, player.x].items[a].hp);//upataan tekstia teksti logiin
					chest[player.y,player.x].items.splice(a,1);
					GuiUpdate(); //upataanguita
					IndicatorInit(player, indicate);//indicoidaan potionin hp maara
				}
				else//jos joku muu kyseessa eli ase
				{
					console.log(chest[player.y, player.x].items[a]);	
					HAND[0]=(chest[player.y, player.x].items[a]);
					FULLDMG=HAND[0].dmg+PLAYERDMG;
					player.dmg=FULLDMG;
					TextLogUbdate("you took weapon: "+ chest[player.y, player.x].items[a].id + " in hand" );//upataan tekstia teksti logiin
					chest[player.y,player.x].items.splice(a,1);//ollaan napattu ase tuhotaan se arkun listasta
					GuiUpdate(); //upataanguita
				}
			}
		}
		
    } 
	else 
	{
		
		elmImage.style.display="block";
		elmText.style.display="block";	
    }

}