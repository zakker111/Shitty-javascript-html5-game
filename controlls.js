//-------------klikki eventin funkkari--------//
gcanvas.addEventListener('mousedown', on_canvas_click, false); //klikkaamiselle tappaamiselle adataan grafiikka canvakselle eventlisteneri
function on_canvas_click(event) 
{
	var x = new Number();
	var y = new Number();
	
	var canvast = document.getElementById('gcanvas');
	
	if (event.x != undefined && event.y != undefined)
	{
		x = event.x;
		y = event.y;
	}
	else //jos firefoksi kyseessa
	{
		x = event.clientX + document.body.scrollLeft +
		document.documentElement.scrollLeft; //firefoksilla toimii etta saadaan oikeat x coordinaatit vasemmalta
		y = event.clientY + document.body.scrollTop +
		document.documentElement.scrollTop; //saadaan y coordinaatit oikein
	}
	
	//alempi jossei ole firefoksi kyseessa
	x -= canvas.offsetLeft; //offsetti vasemmalta
	y -= canvas.offsetTop; //offsetti ylhäältä
	
	x=(x-10)/(TILESIZE);//jaetaan tilen koolla globaalista ofsettiä 10 koska 10 pikselia vaarin
	y=(y-50)/(TILESIZE)-1;//vahan rautalanka!!! mutta nain saadaan y coordinaateille oikea summa mappiin verrattuna(peli canvakseen) -1 koska grafiikka canvas on 50 pikseliä ylempänä kuin peli canvas
	
	x=parseInt(x);//parsetaan intiksi desimaalit veks
	y=parseInt(y);

	checkCoordinates(x,y);//chekataan onko coordinaateissa otus
	
	//alert("x: " + x + "  y: " + y); //alertoidaan coordinaatit
}



//----------SWIPE--CONTROLLIT--------//
hammertime.on("swipeup swipedown swipeleft swiperight", function(e)
{ 
	if(canMove) //jos voidaan liikkua canmove true
	{
		//console.log(e.type);
		var code = e.type;
		var acted = false;
	
		//nuoli nappulat
		if (code === "swipeup") //ylös
		{ 
			acted = moveTo(player, {x:0, y:-1});
		}
		else if (code === "swipeleft") //vasen
		{ 
			acted = moveTo(player, {x:-1, y:0});
		}
	
		else if (code === "swiperight") //oikee
		{ 
			acted = moveTo(player, {x:1, y:0});		
		}
	
		else if (code === "swipedown") //alas
		{ 
			acted = moveTo(player, {x:0, y:1});
		}
		
		if (acted)//jos acted true
		{
			TURNCOUNT++;
			Action(acted);
			
			if(TURNCOUNT >= 10 && TIME_TO_BURN == true) //poltetaan maata jos paalla ja ollaan otettu enemman kun 10 askelta
			{
				timeToBurn();
			}
		}
	}
})
	


//------------NAPPIS--CONTROLLIT----------//
window.onkeyup = function (e)//key handleri ei tarvi kutsua eri funktiona
{
	if(canMove) //jos voidaan liikkua canmove true
	{
		var code = e.keyCode ? e.keyCode : e.which;	
		var acted = false;
			
		//nuoli nappulat+wasd
		if (code === 38 || code === 87) //ylös
		{ 
			acted = moveTo(player, {x:0, y:-1});
		}
		
		else if (code === 37 || code === 65) //vasen
		{ 
			acted = moveTo(player, {x:-1, y:0});
		}
	
		else if (code === 39 || code === 68) //oikee
		{ 
			acted = moveTo(player, {x:1, y:0});		
		}
	
		else if (code === 40 || code===83) //alas
		{ 
			acted = moveTo(player, {x:0, y:1});
		}
	
		if (acted)//jos acted true
		{
			TURNCOUNT++;
			Action(acted);
			
			if(TURNCOUNT >= 10 && TIME_TO_BURN == true) //poltetaan maata jos paalla ja ollaan otettu enemman kun 10 askelta
			{
				timeToBurn(); 
			}
		}
	}
}


