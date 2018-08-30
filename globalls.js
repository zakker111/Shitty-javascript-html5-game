var ACTORS = 5; //enemyjen maara
var ARENA_ACTORS = 1;
var TOWERAMMOUNT = 4; //mapissa olevien tornien maara huom 0 on eka torni 

var LEVELS_MAX = 5;//maksimi levelit torniin
var LEVELS_MIN = 10;//minimi levelit torniin

var ROWS = 15; //montako rivia
var COLS = 19; //montako saraketta

var TILESIZE = 32; //tilejen koko voi säätää minkä haluaa width height tulee saman kokoseksi
var SPRITE_TILESIZE = 32;//spritesheetin tilejen koko width height 32

var KILLED = 0; //tapettujen vihujen maara
var SEED; //seedi randomille
var LEVELS; //towerin levellit tiedetaan kun tornista loppuu levelit(lapaisty torni)

var TOWERS1=[];//kaytetaan tornien tietojen tallentamiseen

var TURNCOUNT = 0; //kaytetaan laskemaan turneja mailman polttoon
var TIME_TO_BURN = false; //mailman poltto paalla tai pois
var ARENAMODE_ON = false;


var SPRITEROWS, SPRITECOLS;

//alustetaan pelaaja ja lista enemyille, ja niiden positionille
var player={};
var actorList;
var actorMap = {};

//eguipatut itemit
var HAND=[];
HAND[0]={id:"nothing",dmg:0,durability:"none"};//defaulttina nothing nama eivat tee mitaan katso initdefaults()

var PLAYERHP = 10, PLAYERDXT = 0, PLAYERSTR = 0, PLAYERXP = 0, PLAYERLVL = 1, PLAYERDMG = 2, PLAYERAR=0, FULLDMG=HAND[0].dmg+PLAYERDMG; //dex ja str maaritellaan kun tehdaan hahmo hp alustetaan alussa aina 10

var THEME; //pelikentan teema

var playerY, playerX;

var PLAYED = false; //tama ehka turha
var FROM_SAVE = false; //kaytetaan tietamaan otetaanko savesta
var newLadder = {y:12,x:2}; //ladderin eka paikka 

var startBurning; //tile josta palo alkaa Huom saa arvot pelaajan coordinaateista

var UP_DOWN = false;//onko ladder ylhaalla vai alhaalla

//canvaksen koko
canvas.width = 610;
canvas.height = 490;

//graphics canvaksen koko graphics canvas tuottaa grafiikkaa daman maarat ym
gcanvas.width = 610;
gcanvas.height = 540;

var step, steps = 0, delay = 10, timeout = null;//globaalit tarvitaan damage indicaattorille

//voiko liikkua
var canMove = true;

var IDCOUNT=0; //kaytetaan chestin id:hen

//tilelistan alustus
var tileList = [];
var itemImagePos=[];

var swipeelm = document.getElementById("main"); //swipe elementti on main divi
var hammertime = new Hammer(swipeelm); 
	
hammertime.options.preventDefault=false; //pitaisi poistaa draggaamisen swipetessä poistaa myöskin kaiken muun controllin truena