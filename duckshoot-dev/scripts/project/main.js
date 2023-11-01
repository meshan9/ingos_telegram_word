import {GUI, API} from "./modules.js";
import * as Utils from "./utilities.js";
import WS from "./ws.js";
import panelCopy from "./panel_copy.js";
import Nakama from "./nakama.js";


export let nakama = null;

export let ws = null;

export let gui = null;
export let api = null;
export const apiVars = {
	balance: null,
	attempts: 0,
	packs: null,
	rewards: null,
	history: null,
	session: null,
	rating: null,
	tasks: null,
	special_offer: null,
	free_try: null,
	games: null,
	profiles: null,
	node: null,
	userID: null,
	player: null,
	enemies: null,
	lefts: null,
	leaderboard: null,
	match_gifts: null,
	collections: null,
	collection_prizes: null,
	gifts: null,
	dialogs: null, 
	partners_prizes: null
};
export let b_useAPI = true;
export let b_useWS = true; //меняем в json use_api

export let balanceFileName = "balance.json";

export const ids = {};

runOnStartup(async runtime =>
{
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart());
	globalThis.runtime = runtime;
	
	document.addEventListener("ws_onmessage", function(e)
		{
    		runtime.callFunction('ws_onmessage', e.detail);
  		}
	);
	
	document.addEventListener("ws_onopen", function(e)
		{
		  if (api.token !== null)
		  {
		  	 ws.send(JSON.stringify({"event" : "auth", "token" : api.token}));
		  }
  		}
	);	
	
});

async function OnBeforeProjectStart()
{
	const layouts = {
		"Layout 1": OnBeforeLayoutStartMainMenu,
		"game": OnBeforeLayoutStartEmpty
	}
	
	for (const key in layouts)
	{
		globalThis.runtime.getLayout(key).addEventListener("beforelayoutstart", () => layouts[key]());	    
	}
	await get_use_api_and_ws();
	
	if (b_useAPI)
	{  
		api = new API({authorization: "Key noPOc2KY8Hub8_kB4xt_DT4cwPdyqj9IVWsXXqSx"});
	}	
	else 
	{
		api = {token: null};
	}
	
	
}

function OnBeforeLayoutStartMainMenu()
{
	addEventListeners({level: "main_menu"});
}

function OnBeforeLayoutStartEmpty()
{
	addEventListeners({level: ""});
}

async function get_use_api_and_ws(){
    const data = await Utils.fetching_file2("use_api.json", globalThis.runtime);
	b_useAPI = data["b_useAPI"];
	b_useWS = data["b_useWS"];
	console.log(`useAPI = ${b_useAPI}`);
	console.log(`useWS = ${b_useWS}`);
}

function addEventListeners(options)
{
	const level = options.level;
	
	console.log(`start "${globalThis.runtime.layout.name}"`);

	const colors = {
		blue:			[246, 110, 107],	//коралловый
		darkAmber:		[255, 128, 0],		//тёмный янтарь
		honky:			[255, 255, 237],	//белый
		taupe:			[79, 74, 70],		//тёмно-серый
		lightOrange:	[255, 171, 86]	,	//светлый оранжевый
		grey:           [163,163,163],      //серый
		darkGrey:       [102,102,102],      //серый
		green:          [36, 187, 112],      //зеленый
		winter:         [85, 133, 224],
		main: 			[75, 37, 79],
		pink:			[235, 87, 118],
	};
	
   
	
	gui = new GUI({
		level:			level,
		layer:			"GUI",
		colors:			colors,
		b_useAPI:		b_useAPI
	});
	
	globalThis.runtime.addEventListener("tick", Tick);
	globalThis.runtime.addEventListener("pointerup", pointerup);
	globalThis.runtime.addEventListener("pointermove", pointermove);
	globalThis.runtime.addEventListener("pointerdown", pointerdown);
}

export function removeEventListeners()
{
	console.log('remove event listeners');
	globalThis.runtime.removeEventListener("tick", Tick);
	globalThis.runtime.removeEventListener("pointerup", pointerup);
	globalThis.runtime.removeEventListener("pointermove", pointermove);
	globalThis.runtime.removeEventListener("pointerdown", pointerdown);
}

function Tick(e)
{
	gui.always();
}

function pointerup(e)
{
	gui.pointerup(e.clientX, e.clientY);
}

function pointermove(e)
{
	gui.pointermove(e.clientX, e.clientY);
}

function pointerdown(e)
{
	gui.pointerdown(e.clientX, e.clientY);
}

export function createNakama(){
		nakama = new Nakama();
}

export function goToLayout(options)
{
	const layout = options.layout;
	
	removeEventListeners();
	
	globalThis.runtime.goToLayout(layout);
}

export function call(options)
{
	const name = options.name;
	
	if (name == "play")
	{
		globalThis.runtime.callFunction("Play");
	}
	
	if (name == "tutorial")
	{
		globalThis.runtime.callFunction("Tutorial");
	}
	
	if (name == "menu")
	{
		globalThis.runtime.callFunction("Menu");
	}
	
	if (name == "sound")
	{
		const soundName = options.soundName;
		
		globalThis.runtime.callFunction("Sound", soundName);
	}
	
	if (name == "sound switch")
	{
		const b_sound = options.b_sound;
		
		globalThis.runtime.callFunction("Sound_Switch", b_sound);
	}
}

export function ws_send(data)
{
	if (b_useWS)
	{
		ws.send(JSON.stringify(data));
		return;
	}
	
	console.error("WS выключены");
}