

import * as Utils from "./utilities.js";
import * as Main from "./main.js";
import Nakama from "./nakama.js";
import panelCopy from "./panel_copy.js";
import Scroll from "./class_scroll.js";

export class GUI
	//singleton
	/*
addW, addH - прибавляю ширину, высоту из-за плохого ресайза
*/
{
	constructor(options)
	{
		const {level, layer, colors, b_useAPI} = options;

		this.rt = globalThis.runtime;

		this.level = "";
		this.layer = layer;
		this.colors = this._get_colors({colors: colors});
		this.b_useAPI = b_useAPI;

		this.fonts = {
			bold:		"SBSansDisplay-Bold",
			regular:	"SBSansDisplay-Regular",
			semibold:	"SBSansDisplay-SemiBold",
			special:    "CHEKHARDA-BOLDITALIC"
		};

		this._set_scales();

		this.Text = this.rt.objects.Text_gui;
		this.TextMain = this.rt.objects.text_main;

		this._destroy_first_instances();

		this.objects = [];
		this.objectsTouch = []; //тут хранятся ссылки на экземпляры, которые я не занёс в массив this.objects, но по которым тоже нужно задетектить клик
		this.objectsModalWindow = [];

		this.attempts = 0;

		this.b_sound = true;

		this.objectsScroll = []; //массив с объектами для скролла
		this.scrollY = 0;        //значение скролла
		this.scrollD = 0;        //разница скролла
		this.scrollS = 0;        //скорость скролла
		this.scrollM = 0;        //порог скролла
		this.b_scroll = false;   //нажат ли скролл

		this.prizesScroll = new Scroll({size: this.bottom});
		//this._create_background();

		this.modalMode = "";

		if (level != "")
		{
			this.show({level: level});
		}


		this.sliderButtonsScroll = new Scroll({size:this.right});

		const th = this._metamorphosis({x: 30, y: 48, w: 340, h: 55});
		panelCopy.init({panel: runtime.objects.patch_panel_special_offer, text: this.Text, layer: "panel_copy", coords: th, textColor: this.colors["main"], textSize: this._get_text_size({s: 16}), textFont: this.fonts["special"], fade: Utils.fade});
	}

	_set_scales()
	{
		const viewport = this.rt.layout.getLayer(this.layer).getViewport();
		this.width = viewport.width;
		this.height = viewport.height;
		this.top = viewport.top;
		this.left = viewport.left;
		this.right = viewport.right;
		this.bottom = viewport.bottom;
		this.originalWidth = this.right + this.left;
		this.originalHeight = this.bottom + this.top;
		this.centerX = (this.left + this.right) / 2;
		this.centerY = (this.top + this.bottom) / 2;
		this.figmaWidth = 375;
		this.figmaHeight = 812;

		this.scale = Math.min(this.width / this.figmaWidth, this.height / this.figmaHeight);

		this.boxWidth = this.figmaWidth * this.scale;
		this.boxHeight = this.figmaHeight * this.scale;
		this.boxX = (this.originalWidth * 0.5) - (this.boxWidth * 0.5);
		this.boxY = (this.originalHeight * 0.5) - (this.boxHeight * 0.5);

		/*const box = this.rt.objects.Sprite_Box.getFirstInstance();
		box.x = this.boxX;
		box.y = this.boxY;
		box.width = this.boxWidth;
		box.height = this.boxHeight;*/

	}

	_metamorphosis(options)
	{
		const {x = 0, y = 0, w = 0, h = 0} = options;

		return {'x': (x * this.scale) + this.boxX,
				'y': (y * this.scale) + this.boxY,
				'w': w * this.scale,
				'h': h * this.scale};
	}

	_get_colors(options)
	{
		const {colors} = options;
		const newColors = {};

		for (const c in colors)
		{
			newColors[c] = Utils.color_rgb_2_one(colors[c]);
		}

		return newColors;
	}

	_get_text_size(options)
	{
		const {s: size} = options;

		return Utils.px_2_pt(size * this.scale);
	}

	_destroy_first_instances()
	{
		const text = this.Text.getFirstInstance();
		if (text != null)
		{
			text.destroy();
		}

		const instancesDestroy = [

			"sprite_buttons",
			"Sprite_logo",
			"sprite_hand",
			"sprite_hand_bg",
			"Sprite_message",
			"text_main",
			"patch_panel_onboarding",
			"start_logo_hand"
		];

		for (const o of instancesDestroy)
		{
			const object = this.rt.objects[o];
			if (object != undefined) //проверка на существование объекта
			{
				const instance = object.getFirstInstance();
				if (instance != null) //проверка на наличие экземпляра
				{
					instance.destroy();
				}
			}
			else
			{
				console.log(`${o} is undefined`);
			}
		}

		const instancesMinPos = [

		];

		for (const o of instancesMinPos)
		{
			const object = this.rt.objects[o];
			if (object != undefined) //проверка на существование объекта
			{
				const instance = object.getFirstInstance();
				if (instance != null) //проверка на наличие экземпляра
				{
					instance.x = -10000;
				}
			}
			else
			{
				console.log(`${o} is undefined`);
			}
		}
	}

	_destroy_objects()
	{
		for (const instance of this.objects)
		{
			//instance.destroy();
		}

		this.objects.length = 0;

		this.objectsScroll.length = 0;
	}

	_destroy_objects_modal_window(options)
	{
		let modal = "";
		if (options.modal != undefined) modal = options.modal;

		for (const instance of this.objectsModalWindow)
		{
			//instance.destroy();
		}

		this.objectsModalWindow.length = 0;

		this.modalMode = modal;
	}

	show(options)
	{
		const {level} = options;

		this._destroy_objects();
		this.scrollY = 0;

		this.level = level;
		console.log('move to "' + this.level + '"');
		this["_window_" + this.level]();
	}

	async _window_main_menu()
	{

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bPacks", animation: "menu", frame: 0, type: "shop", x: -119 -339/2, y: 228 + 92/2, w: 339, h: 92, });
		runtime.callFunction("create_text_menu", "shop", "МАГАЗИН");

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bTasks", animation: "menu", frame: 1, type: "tasks", x: -171 - 339/2, y: 307 + 92/2, w: 339, h: 92,});
		runtime.callFunction("create_text_menu", "tasks", "ЗАДАНИЯ");

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bRating", animation: "menu", frame: 2, type: "rating", x: -181 - 339/2, y: 385 + 92/2, w: 339, h: 92,});
		runtime.callFunction("create_text_menu", "rating", "РЕЙТИНГ");

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bCollections", animation: "menu", frame: 3, type: "collections", x: -147 - 339/2, y: 457 + 92/2, w: 339, h: 92});
		runtime.callFunction("create_text_menu", "collections", "КОЛЛЕКЦИИ");

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bPrizes", animation: "menu", frame: 4, type: "gifts", x: -82 - 339/2, y: 528 + 92/2, w: 339, h: 92});
		runtime.callFunction("create_text_menu", "gifts", "ПРИЗЫ");

		this._create_main_icon({icon: this.rt.objects.sprite_buttons,
								name: "bInfo", animation: "info", frame: 4, type: "info", x: 355 + 82, y: 40, w: 41, h: 41});

		this._create_button_play({object: this.rt.objects.sprite_buttons,
								  name: "bPlay", animation: "start", frame: 5, type: "play", x: 200 + 155, y: 314, w: 155, h: 155});

		let th = this._metamorphosis({x: 36 - 320, y: 40, w: 240, h: 145});
		const logo = this.rt.objects.Sprite_logo.createInstance(this.layer, th.x, th.y);
		logo.width = th.w;
		logo.height = th.h;


		runtime.callFunction("set_bckg_size");

		runtime.callFunction("tween_btn_menu_create");

		runtime.callFunction("tween_icon_info");
		runtime.callFunction("tween_logo_text");


		const thesaurus = {x: 240 + 300, y: 663, w: 156, h: 52};
		th = this._metamorphosis(thesaurus);
		this.attemptsBack = this.rt.objects.sprite_attempts_back.createInstance(this.layer, th.x, th.y);
		this.attemptsBack.width = th.w;
		this.attemptsBack.height = th.h;
		this.attemptsBack.name = "attempts";
		this.objects.push(this.attemptsBack);

		th = this._metamorphosis({x: thesaurus.x + 25, y: thesaurus.y, w: thesaurus.w, h: thesaurus.h});
		this.attemptsText = this.Text.createInstance(this.layer, th.x, th.y);
		this.attemptsText.width = th.w;
		this.attemptsText.height = th.h;
		this.attemptsText.text = `-`;
		this.attemptsText.horizontalAlign = "center";
		this.attemptsText.verticalAlign = "center";
		this.attemptsText.fontColor = this.colors.pink;
		this.attemptsText.sizePt = this._get_text_size({s: 34});
		this.attemptsText.fontFace = this.fonts.special;
		this.objects.push(this.attemptsText);
		this.attemptsText.instVars.name = "attempts";

		th = this._metamorphosis({x: thesaurus.x + 75, y: thesaurus.y + 5, w: 38, h: 41});
		this.attemptsIcon = this.rt.objects.sprite_icon_heart.createInstance(this.layer, th.x, th.y);
		this.attemptsIcon.width = th.w;
		this.attemptsIcon.height = th.h;
		this.objects.push(this.attemptsIcon);

		th = this._metamorphosis({x: 260 + 300, y: 640, w: 90, h: 20});
		this.attemptsText_ = this.Text.createInstance(this.layer, th.x, th.y);
		this.attemptsText_.width = th.w;
		this.attemptsText_.height = th.h;
		this.attemptsText_.text = `ПОПЫТКИ:`;
		this.attemptsText_.horizontalAlign = "center";
		this.attemptsText_.verticalAlign = "center";
		this.attemptsText_.fontColor = this.colors.main;
		this.attemptsText_.sizePt = this._get_text_size({s: 16});
		this.attemptsText_.fontFace = this.fonts.special;
		this.objects.push(this.attemptsText_);
		this.attemptsText_.instVars.name = "attempts_";

		runtime.callFunction("tween_attempts_block");

		await this._get_and_set_balance();	
		await this._get_and_set_games();
		setTimeout(() => {runtime.callFunction("parse_gifts_leaderboard");}, 100);
		await this._get_and_set_dialogs();	
		await this._get_and_set_profiles();
		await this._get_nodes();
		//await this._get_and_set_rating();

		if (Main.apiVars.balance !== null) {
			this._attempts_set_text();

			if (runtime.globalVars.onboarding === 1)
			{
				console.log("onboarding");
				this.modalMode = " ";

				this.rt.callFunction("set_panelY_value");
				this.create_modal_window({name:"faq"});
				setTimeout(() => {this.rt.callFunction("set_onboarding_off");}, 1000);

			} 

			if (runtime.globalVars.tutorial === 1){

				this.modalMode = " ";
				this.rt.callFunction("create_modal_mode");
				this.rt.callFunction("start_onboarding", 3, 0, 125, 240, 85,"Здесь хранятся твои подарки. Ты всегда можешь посмотреть свои полученные призы", 0,0, 10,"prizes","prizes");
				this.rt.callFunction("move_btn_prizes", "top");
			}

			if (this.attemptsText.textWidth > 150){
				this.rt.callFunction("set_size_attempts_back");
			}

			if (Main.apiVars.profiles["onboarding"] === "true" ){
				this.modalMode = " ";
				this.rt.callFunction("create_modal_mode");
				runtime.callFunction("onboarding_popup", - 200, 180, 240, 85, `\nТебе доступна одна попытка.\n Давай используем ее, чтобы начать игру. Нажимай на кнопку`, 0);
				runtime.callFunction("move_btn_play_top");
				runtime.globalVars.btn_play_active_onboarding = 1;
				runtime.globalVars.first_onboarding = 1;
			}

			if (Main.apiVars.profiles["onboarding"] === "false" && runtime.globalVars.first_onboarding === 1){

				this.modalMode = " ";
				this.rt.callFunction("create_modal_mode");
				this.rt.callFunction("set_panelY_value");
				this.rt.callFunction("start_onboarding", 0, 0, 140, 220, 90,`Здесь можно получить попытки и начать игру. \nНажми на магазин!`, 0,0, 14,"shop","shop");
				this.rt.callFunction("move_btn_shop", "top");
				this.rt.callFunction("tween_btn_shop_onboarding");
				runtime.globalVars.btn_prize_active_onboarding = 1;
			}
		}

		if (Main.apiVars.dialogs !== null && Main.apiVars.profiles["onboarding"] === "false" && runtime.globalVars.first_onboarding === 0 && runtime.globalVars.tutorial === 0 && runtime.globalVars.onboarding === 0){
			this.dialogs = Main.apiVars.dialogs;
			this.name;
			this.counter = 0;
			this.to_show;
			this.active_dialogs = [];
			this.active_dialogs = Object.values(this.dialogs).filter((value) => {
				return value.status == 'active' && value.category == 'main_screen';
			})
			this.create_dialogs();
		}

		/*th = this._metamorphosis({x: 188, y: 550, w: 60, h: 60});
		const loading = this.rt.objects.sprite_loading.createInstance(this.layer, th.x, th.y);
		loading.width = th.w;
		loading.height = th.h;*/
	}

	create_dialogs(){

		/*this.active_dialogs = Object.values(this.dialogs).filter((value) => {
			return value.category == category;
		});*/

		if (this.active_dialogs.length !== 0){

			this.to_show = this.active_dialogs.pop();
			this.event = this.to_show["event"];
			this.name = this.to_show.name;
			this.create_modal_window({name:"special offer"});
			console.log(this.event );
		}
	}

	_copy_to_buffer(options)
	{
		const {text} = options;

		Utils.copy_to_buffer(text);

		panelCopy.show();
	}

	open_link(options){
		const URL = options;
		window.open(URL,'_blank');
	}

	async _window_packs()
	{
		//Main.removeEventListeners();
		this.rt.callFunction("GUI");	
		this.rt.callFunction("activate_group", "packs");

		console.log(Main.apiVars.packs);
		if (Main.apiVars.packs != null)
		{
			this.rt.callFunction("parse_packs");
			this.rt.callFunction("parse_special");
			this.rt.callFunction("parse_free");
		}

	}

	async _window_collections()
	{
		//Main.removeEventListeners();
		this.rt.callFunction("GUI");	
		this.rt.callFunction("activate_group", "collections");

		await this._get_and_set_collections({});

		if (Main.apiVars.collections != null)
		{
			this.rt.callFunction("parse_collections");
		}
	}

	async _window_prizes()
	{

		this.rt.callFunction("GUI");	
		this.rt.callFunction("activate_group", "prizes_");
		await this._get_and_set_prizes();

		if (Main.apiVars.history !== null){
			this.rt.callFunction("parse_history");
		}

	}

	async _window_tasks()
	{
		//Main.removeEventListeners();
		this.rt.callFunction("GUI");	
		this.rt.callFunction("activate_group", "tasks");

		await this._get_and_set_tasks();

		if (Main.apiVars.tasks != null)
		{
			this.rt.callFunction("parse_tasks");
		}
	}

	async _window_rating()
	{
		//Main.removeEventListeners();

		this.rt.callFunction("GUI");	
		this.rt.callFunction("activate_group", "rating");

		await this._get_and_set_rating();

		if (Main.apiVars.rating != null)
		{
			this.rt.callFunction("parse_rating");
		}
	}

	get_animation_frame_prize(options)
	{
		const {id} = options;

		const animationName = "beeline";


		const prizesIDS = {
			"p-1": "lectr",
			"p-2": "english",
			"p-3": "prakticum",
			"p-4": "prakticum",
			"p-5": "prakticum",
			"p-6": "prakticum",
			"p-7": "prakticum",
			"p-8": "prakticum",
			"p-9": "prakticum",
			"p-10": "prakticum",
			"p-11": "prakticum",
			"p-12": "prakticum",
			"p-13": "prakticum",
			"p-14": "premier",
			"p-15": "granfondo",
			"p-16": "cosmetic",
			"p-17": "ivi",
			"p-18": "okko",
			"p-19": "bonnie",
		};

		if (id in prizesIDS)
		{
			return prizesIDS[id];
		}
		else
		{
			return "beeline";
		}
		/*for (const [key, value] of Object.entries(prizesIDS))
		{
			console.log(prizesIDS[key]);
			if (value.includes((id)))
			{		

				return prizesIDS[key];
			} else {
				return animationName;
			}
		}

		console.warn(`Такого id нет в списке!`, id);
		return 1;*/
	}

	async _promise(options)
	{

		const string = await Utils.fetching_file(fileName, this.rt);

		const myFirstPromise = new Promise((resolve, reject) => {
			setTimeout(function(){resolve(string);}, delay);});

		const data = JSON.parse(await myFirstPromise);

		return data;
	}

	async _get_and_set_balance()
	{
		//if (Main.apiVars.balance == null)
		if (true)
		{
			console.log('wait balance');

			this.modalMode = " ";

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_balance();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: Main.balanceFileName, delay: 1000});
				//data = null; //bad response
			}

			const event = new CustomEvent("ready", data);
			document.dispatchEvent(event);


			if (data != null)
			{
				Main.apiVars.balance = data;

				//Main.apiVars.bonuses = data["bonuses"];

				const counters = data["tries"];
				if (counters !== undefined)
				{
					Main.apiVars.attempts = data["tries"];
					//Main.apiVars.attempts = "0";
				} else {
					Main.apiVars.attempts = "0";
				}

				console.log(data);
				console.log(`attempts = ${Main.apiVars.attempts}`);

			}
			else
			{
				console.log('fail balance');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_avatar(options)
	{
		const avatar = options;

		console.log('update avatar');

		let data = null;

		if (this.b_useAPI)
		{
			data = await Main.api.set_avatar(avatar);
			//data = null; //bad response
		}
		else
		{
			data = await this._promise({fileName: Main.balanceFileName, delay: 1000});
			//data = null; //bad response
		}

		if (data != null)
		{

			console.log(data["avatar"]);
			runtime.globalVars.avatar = data["avatar"];
		}
		else
		{
			console.log('fail avatar update');
			this.create_modal_window({name: "fail response"});
		}
	}

	async _get_and_set_rating()
	{
		if (true)
		{
			console.log('wait rating');

			//this.modalMode = " ";

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_rating();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "rating.json", delay: 1000});
				//data = null; //bad response
			}

			//this.modalMode = "";


			if (data != null)
			{
				Main.apiVars.rating = data;

				console.groupCollapsed("rating", data);
				console.log(JSON.stringify(data));
				console.groupEnd();

			}

			else
			{
				console.log('fail rating');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_games()
	{
		if (true)
		{
			console.log('wait games');

			//this.modalMode = " ";

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_games();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "games.json", delay: 1000});
				//data = null; //bad response
			}

			//this.modalMode = "";

			if (data != null)
			{
				Main.apiVars.games = data;

				Main.apiVars.rewards = data["rewards"];
				if (Main.apiVars.rewards !== null){
					runtime.callFunction("parse_rewards");
				}
				/*if (data["history"] !== undefined){
					Main.apiVars.history = data["history"];
				}*/

				//Main.apiVars.packs =  data["packs"].concat(data["additional_packs"]);
				Main.apiVars.packs = data["packs"];

				Main.apiVars.special_offer = data["special"];
				if (data["free"] !== undefined){
					Main.apiVars.free_try = data["free"];
				}

				Main.apiVars.leaderboard = data["leaderboard"]["gifts"];

				Main.apiVars.collection_prizes = data["collections"];

				console.groupCollapsed("games", data);
				console.log(JSON.stringify(data));
				console.groupEnd();
			}

			else
			{
				console.log('fail games');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_dialogs()
	{
		if (true)
		{
			console.log('wait games');

			//this.modalMode = " ";

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_dialogs();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "games.json", delay: 1000});
				//data = null; //bad response
			}

			//this.modalMode = "";

			if (data !== null)
			{
				data !== {} ? Main.apiVars.dialogs = data : Main.apiVars.dialogs = null;

				console.groupCollapsed("dialogs", data);
				console.log(JSON.stringify(data));
				console.groupEnd();
			}

			else
			{
				console.log('fail dialogs');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_profiles()
	{
		if (true)
		{
			console.log('wait profiles');

			//this.modalMode = " ";

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_profiles();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "profiles.json", delay: 1000});
				//data = null; //bad response
			}

			//this.modalMode = "";


			if (data != null)
			{
				Main.apiVars.profiles = data;
				if (Main.apiVars.profiles["avatar"] !== ""){
					runtime.globalVars.avatar = Main.apiVars.profiles["avatar"];
				} else {
					runtime.globalVars.avatar = "Bear";
				}
				console.log(runtime.globalVars.avatar);
				console.groupCollapsed("profiles", data);
				console.log(JSON.stringify(data));
				console.groupEnd();
			}

			else
			{
				console.log('fail profiles');
				this.create_modal_window({name: "fail response"});
			}
		}
	}


	async _get_and_set_partners_prizes()
	{

		//if (Main.apiVars.packs == null)
		if (true)
		{
			console.log('wait prizes');

			/*if (b_visible) 
			{
				this.create_modal_window({name: "message", title: 'Инвентарь', text: `Получаем пакеты стрел и инвентарь, \nпожалуйста, подожди...`});
			}*/

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_partners_prizes();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "packs.json"});
				//data = null; //bad response
			}

			//this._destroy_objects_modal_window({});

			if (data != null)
			{
				Main.apiVars.partners_prizes = data['partner'];			

				setTimeout(() => {this.rt.callFunction("parse_partners_prizes");}, 100);
					
				console.groupCollapsed("prizes", data);
				console.log(JSON.stringify(data));
				console.groupEnd();

			}
			else
			{
				console.log('fail prizes');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_collections(options)
	{
		const {b_visible = true} = options;

		//if (Main.apiVars.packs == null)
		if (true)
		{
			console.log('wait collections');


			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_collections();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "collections.json"});
				//data = null; //bad response
			}

			//this._destroy_objects_modal_window({});

			if (data != null)
			{
				Main.apiVars.collections = data;	


				console.groupCollapsed("collections", data);
				console.log(JSON.stringify(data));
				console.groupEnd();

			}
			else
			{
				console.log('fail collections');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_prizes()
	{
		//if (Main.apiVars.prizes == null)
		if (true)
		{
			console.log('wait history');

			/*this.create_modal_window({name: "message", title: 'Призы', text: 'Получаем призы, пожалуйста, подожди...'});*/

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_rewards();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "prizes.json"});
				//data = null; //bad response
			}

			this._destroy_objects_modal_window({});

			if (data != null)
			{
				Main.apiVars.history = data;

				console.log(Main.apiVars.history);
			}
			else
			{
				console.log('fail prizes');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_and_set_tasks()
	{
		//if (Main.apiVars.prizes == null)
		if (true)
		{
			console.log('wait tasks');

			/*this.create_modal_window({name: "message", title: 'Задания', text: 'Получаем задания, пожалуйста, подожди...'});*/

			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_tasks();
				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "tasks.json"});
				//data = null; //bad response
			}

			this._destroy_objects_modal_window({});

			if (data != null)
			{
				Main.apiVars.tasks = data;
				//Main.apiVars.tasks['active'][0]['link'] = 'https://beeline.ru/customers/products/mobile/services/details/mnp/';
				console.log(data);
			}
			else
			{
				console.log('fail tasks');
				this.create_modal_window({name: "fail response"});
			}
		}
	}

	async _get_nodes()
	{

		if (true)
		{
			console.log('wait nodes');


			let data = null;

			if (this.b_useAPI)
			{
				data = await Main.api.get_nodes();

				//data = null; //bad response
			}
			else
			{
				data = await this._promise({fileName: "nodes.json"});
				//data = null; //bad response
			}

			if (data != null)
			{
				if (data["nodes"].length !== 0){

					Main.apiVars.node = data["nodes"][0]["node"];
					console.log(Main.apiVars.node);
				} 


				if (Main.apiVars.balance["onboarding"] === false || runtime.globalVars.onboarding === 0 || runtime.globalVars.tutorial === 0){
					this.modalMode = "";
					runtime.globalVars.b_buttons_actives = 1;
				}	

			}
			else
			{
				console.log('fail nodes');
				this.create_modal_window({name: "fail response"});
			}
		}
	}


	async _get_and_set_session()
	{
		console.log('wait session');

		//this.create_modal_window({name: "message", title: 'Начинаем игру', text: 'Начинаем игру, пожалуйста, подожди...'});

		let data = null;

		if (this.b_useAPI){

			if (Main.apiVars.node !== null){
				console.log(Main.apiVars.attempts);
				if (Main.apiVars.attempts > 0){ 
					data = await Main.api.start_game();

					this.rt.callFunction("tween_btn_play");
					this.rt.callFunction("tween_btn_menu_destroy");
					this.rt.callFunction("tween_attempts_block_destroy");
					setTimeout(() => {this.rt.callFunction("Wait");}, 1000);					
				} else {
					this.create_modal_window({name: "not enough balance"});
				}	
			} else  {
				//this.create_modal_window({name: "fail response"});
				runtime.globalVars.b_buttons_actives = 0;
				runtime.callFunction("updating");
			}
		}
		//data = null; //bad response

		else
		{
			if (Main.apiVars.node !== null){
				if (Main.apiVars.attempts > 0){
					data = await this._promise({fileName: "start_game.json"});

					this.rt.callFunction("tween_btn_play");
					this.rt.callFunction("tween_btn_menu_destroy");
					this.rt.callFunction("tween_attempts_block_destroy");
					setTimeout(() => {this.rt.callFunction("Wait");}, 1000);	
				} else {
					this.create_modal_window({name: "not enough balance"});
				}	
			} else  {
				this.create_modal_window({name: "fail response"});
			}

		}

	}

	async _send_event(options)
	{
		const {event, context = ""} = options;

		console.log(`send ${event}, ${context}`);		

		let data = null;
		data = await Main.api.send_event(event,context);
	}



	async _purchase_pack(options)
	{
		const {steppackid, pointsrate} = options;

		console.log(`purchase ${steppackid}`);		

		this.rt.callFunction("create_wait_window");

		let data = null;

		if (this.b_useAPI)
		{
			data = await Main.api.purchase_pack(steppackid);
			//data = null; //bad response
		}
		else
		{
			data = await this._promise({fileName: "purchase_pack.json", delay: 2500});
			//data = null; //bad response
			//data = "spasibo"; //не хватает баллов "спасибо"
		}

		if (data !== null)
		{
			this.rt.callFunction("destroy_accept_window");

			switch (data["status"]){
				case ("RULE_CODE_STATUS"): {					
					runtime.callFunction("purchase_error", "К сожалению, вам недоступна покупка попыток, так как вы не абонент билайна. Переходите в билайн со своим номером и получите возможность играть чаще.", "error_skip", "Понятно", "close_error", 0, 65);	
					break;
				}

				case ("RULE_CODE_BALANCE"): {
					runtime.callFunction("purchase_error","К сожалению, у вас недостаточно средств на счете для покупки попыток. Пополнить счет удобно в приложении билайн.", "error_skip", "Понятно", "close_error", 0, 60);
					break;
				}

				case ("RULE_CODE_PAYMENT_TYPE"): {
					runtime.callFunction("purchase_error","К сожалению, вам недоступна покупка попыток, так как у вас подключена постоплатная система расчетов. Управлять подключенными услугами удобно в приложении билайн.", "error_skip", "Понятно", "close_error", 0, 65);
					break;
				}

				case ("RULE_CODE_SOC"): {
					runtime.callFunction("purchase_error","К сожалению, вам недоступна покупка попыток, так как у вас подключен запрет на подключение платных услуг. Управлять подключенными услугами удобно в приложении билайн.", "error_skip", "Понятно", "close_error", 0, 70);
					break;
				}

				case ("RULE_CODE_ACCOUNT"): {
					runtime.callFunction("purchase_error","К сожалению, вам недоступна покупка попыток, так как у вас подключен специальный авансовый счёт. Управлять подключенными услугами удобно в приложении билайн.", "error_skip", "Понятно", "close_error", 0, 65);
					break;
				}

				case ("RULE_CODE_REGION"): {
					runtime.callFunction("purchase_error","К сожалению, вам недоступна покупка попыток, так как выбранная услуга не предоставляется в текущем регионе.", "error_skip", "Понятно", "close_error", 0, 55);
					break;
				}

				case ("FAILED"): {
					runtime.callFunction("purchase_error","К сожалению, что-то пошло не так, попробуйте позже.", "error_skip", "Понятно", "close_error", 0, 35);			
					break;
				}

				default: {				
					//this.rt.callFunction("destroy_accept_window");
					console.log(`purchase ${steppackid} success`);

					this.rt.callFunction("create_purchase_window");

					if (data["counters"] !== undefined){
						const counters = data["counters"]["tries"];
						Main.apiVars.attempts = counters;
						console.log(Main.apiVars.attempts);
					}
				}
			}
		}

	}

	async _purchase_score()
	{
		console.log(`purchase score`);		
		this.rt.callFunction("destroy_accept_recovering");

		this.rt.callFunction("create_wait_score");

		let data = null;

		if (this.b_useAPI)
		{
			data = await Main.api.purchase_score();
			//data = null; //bad response
		}
		else
		{
			data = await this._promise({fileName: "purchase_pack.json", delay: 2500});
			//data = null; //bad response
			//data = "spasibo"; //не хватает баллов "спасибо"
		}

		if (data !== null)
		{
			if (data == "not_enough_balance")
			{
				this.create_modal_window({name: "not enough balance"});
			}
			else
			{
				//this.rt.callFunction("destroy_accept_window");

				this.rt.callFunction("destroy_accept_recovering");
				console.log(`purchase success`);
				this.rt.callFunction("purchase_success_window");
				//this.rt.callFunction("create_purchase_window");

			}
		}
		else
		{
			//this.create_modal_window({name: "fail response"});
			this.create_modal_window({name: "fail response"});
			console.log(`purchase fail`);
		}
	}

	async _get_free_try()
	{

		//this.create_modal_window({name: "message", title: 'Стрелы', text: `Приобретаем стрелы,\nпожалуйста, подожди...`});
		this.rt.callFunction("create_wait_window");

		let data = null;

		if (this.b_useAPI)
		{
			data = await Main.api.get_free_try();

			//data = null; //bad response
		}
		else
		{
			data = await this._promise({fileName: "purchase_pack.json", delay: 2500});
			//data = null; //bad response
			//data = "spasibo"; //не хватает баллов "спасибо"
		}

		//this._destroy_objects_modal_window({});

		if (data !== null)
		{

			this.rt.callFunction("destroy_accept_window");
			runtime.globalVars.b_buttons_actives = 0;
			//this.create_modal_window({name: "purchase success"});

			this.rt.callFunction("create_purchase_window");

			const tries = data["tries"];
			if (tries !== undefined)
			{
				Main.apiVars.attempts = tries;
				console.log(Main.apiVars.attempts);
			} 
		}
		else
		{
			this.rt.callFunction("destroy_accept_window");
			this.create_modal_window({name: "fail response"});
			console.log(`purchase fail`);
		}
	}

	_attempts_set_text()
	{
		this.attemptsText.text = `${Main.apiVars.attempts}`;
		//console.log(this.attemptsText.textWidth);
		if (this.attemptsText.textWidth > 150){
			this.rt.callFunction("set_size_attempts_back");
		}

		//this.attemptsText.width = this.attemptsText.textWidth > 82 ? this.attemptsText.textWidth + 25: this.attemptsBack.width;
	}

	_header_front()
	{
		for (const i of this.objectsFront)
		{
			i.moveToTop();
		}
	}

	_create_header()
	{
		const th = this._metamorphosis({y: 0, h: 190});
		const header = this.rt.objects.Sprite_header.createInstance(this.layer, this.left, th.y);
		header.width = this.width;
		header.height = th.h;
		this.objects.push(header);

		const headerBack = this.rt.objects.Sprite_header.createInstance(this.layer, th.x, th.y);
		headerBack.width = this.width;
		headerBack.height = -th.h;
		this.objects.push(headerBack);
		header.back = headerBack;

		return header;
	}

	_create_background()
	{
		this.background = this.rt.objects.Sprite_background.createInstance(this.layer, this.left, this.top);
		this.background.width = this.width;
		this.background.height = this.height;
		this.background.isVisible = false;
	}

	_create_main_icon(options)
	{
		const {icon, name, x, y, w, h, animation, frame, layer = this.layer, type,} = options;

		const thesaurus = {x: x, y: y, w: w, h: h};
		let th = this._metamorphosis(thesaurus);
		const bIcon = icon.createInstance(layer, th.x , th.y);
		bIcon.name = name;
		bIcon.animationFrame = frame;
		bIcon.setAnimation(animation);
		bIcon.instVars.type = type;
		bIcon.width = th.w;
		bIcon.height = th.h;
		this.objects.push(bIcon);

		return bIcon;
	}


	_create_button(options)
	{
		const {x, y, w, h, text, textHeight, textColor, name, object, b_visible = true, animation = "menu"} = options;

		let th = this._metamorphosis({x: x, y: y, w: w, h: h});
		const bButton = object.createInstance(this.layer, th.x, th.y);
		bButton.name = name;
		bButton.width = th.w;
		bButton.height = th.h; //addH
		bButton.setAnimation(animation);
		bButton.defaultHeight = th.h;
		bButton.isVisible = b_visible;

		bButton.text = this.Text.createInstance(this.layer, th.x-(0.5*th.w), th.y-(0.5*th.h));
		bButton.text.width = th.w;
		th = this._metamorphosis({h: textHeight});
		bButton.text.height = th.h;
		bButton.text.text = `${text}`;
		bButton.text.horizontalAlign = "center";
		bButton.text.verticalAlign = "center";
		bButton.text.colorRgb = textColor;
		bButton.text.sizePt = this._get_text_size({s: 22});
		bButton.text.fontFace = this.fonts.bold;
		bButton.text.isVisible = b_visible;

		return bButton;
	}

	_create_button_play(options)
	{
		const {x, y, w, h, name, object, b_visible = true, animation, frame, type} = options;

		const thesaurus = {x: x, y: y, w: w, h: h};
		let th = this._metamorphosis(thesaurus);
		const bButton = object.createInstance(this.layer, th.x +(th.w/2) , th.y + (th.h/2));
		bButton.name = name;
		bButton.instVars.type = type;
		bButton.animationFrame = frame;
		bButton.setAnimation(animation);
		bButton.width = th.w;
		bButton.height = th.h;
		this.objects.push(bButton);

		return bButton;
	}

	_create_button_back()
	{
		return this._create_main_icon({icon: this.rt.objects.sprite_buttons, name: "bBack", animation: "exit", frame : 0, type: "exit", x: 330 + 83, y: 35, h: 43, w: 43});
	}

	_tween_button_back(options){
		const tween = options;
		runtime.callFunction("tween_btn_exit", tween);
	}

	_create_text_title(options)
	{
		const {t} = options;

		const th = this._metamorphosis({y: 92, h: 49});
		const textTitle = this.Text.createInstance(this.layer, this.left, th.y);
		textTitle.width = this.width;
		textTitle.height = th.h;
		textTitle.text = `${t}`;
		textTitle.horizontalAlign = "center";
		textTitle.colorRgb = this.colors.honky;
		textTitle.sizePt = this._get_text_size({s: 36});
		textTitle.fontFace = this.fonts.bold;
		this.objects.push(textTitle);
		return textTitle;
	}

	_create_dark_mask_mw(options)
	{
		/*const {b_visible = true} = options;

		this.darkMaskInstance = this.rt.objects.Sprite_dark_mask.createInstance(this.layer, this.left, this.top);
		this.darkMaskInstance.width = this.width;
		this.darkMaskInstance.height = this.height;
		this.darkMaskInstance.opacity = 0.5;
		this.darkMaskInstance.isVisible = b_visible;
		this.objectsModalWindow.push(this.darkMaskInstance);*/
	}

	_create_panel_mw(options)
	{
		const {x, y, w, h, b_visible = true} = options;

		const th = this._metamorphosis({x: x, y: y, w: w, h: h});
		this.panelInstance = this.rt.objects.Patch9_prizes.createInstance(this.layer, th.x, th.y);
		this.panelInstance.width = th.w;
		this.panelInstance.height = th.h;
		this.panelInstance.isVisible = b_visible;
		this.objectsModalWindow.push(this.panelInstance);
	}


	create_modal_window(options)
	{
		const {name} = options;

		this.modalMode = name;

		if (this.modalMode == "faq")
		{
			this.rt.callFunction("create_modal_mode");
			this.rt.callFunction("start_onboarding", 1, 0, 230, 243, 85,`Добро пожаловать в игру "Камень, Ножницы, Бумага". Не будем терять времени и пройдем обучение?`, "start_onboarding","Начать обучение", 0, 0, 0,0);
		}


		if (this.modalMode == "fail response")
		{
			runtime.globalVars.b_buttons_actives = 0;
			this.rt.callFunction("fail_response");
		}

		if (this.modalMode == "not enough balance")
		{
			runtime.globalVars.b_buttons_actives = 0;
			this.rt.callFunction("not_enough_balance");
		}


		if (this.modalMode == "special offer")
		{
			runtime.globalVars.b_buttons_actives = 0;

			this.icon = Main.apiVars.dialogs[this.name]["icon"] === "icon-1" ? 6 : 7;
			this.rt.callFunction("special_offer", Main.apiVars.dialogs[this.name]["message"],  Main.apiVars.dialogs[this.name]["button"],  Main.apiVars.dialogs[this.name]["action"], Main.apiVars.dialogs[this.name]["default"], Main.apiVars.dialogs[this.name]["icon"] === "icon-3" ? 0 : this.icon);

			this.pointsrate = this.to_show['pointsrate'];
			this.pack_id = this.to_show['id'];
		}
	}


	_play_sound(options)
	{
		const {name} = options;

		if (this.b_sound)
		{
			const sounds = {
				"click": "zigzag_click"
			};

			Main.call({name: "sound", soundName: sounds[name]});
		}
	}

	always()
	{


		if (this.b_scroll)
		{
			this.scrollS = this.mouseY - this.scrollC;
			this.scrollC = this.mouseY;
		}
		else
		{
			this.scrollY = Utils.lerp_dt(this.scrollY, Utils.clamp(this.scrollY, (this.scrollM - this.height - this.top) * -1, 0), 0.00001, this.rt.dt);
			this.scrollS = Utils.lerp_dt(this.scrollS, 0, 0.00001, this.rt.dt);
		}
		this.scrollY += this.scrollS;
	}

	_scroll_down()
	{
		if (this.modalMode == "")
		{
			this.scrollC = this.mouseY;
			this.b_scroll = true;
		}
	}

	_scroll_up()
	{
		this.b_scroll = false;
	}

	_cssPxToLayer(eX, eY)
	{
		const mouseXY = this.rt.layout.getLayer(this.layer).cssPxToLayer(eX, eY);
		const [mouseX, mouseY] = mouseXY;
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}

	pointerup(eX, eY)
	{
		this._cssPxToLayer(eX, eY);

		this._scroll_up();

		if (Math.abs(this.scrollS) < 10)
		{
			if (Math.abs(this.sliderButtonsScroll.scrollSpeed) < 10)
			{
				this._check_click();

			}	

		}
		this.sliderButtonsScroll.drop();

	}

	pointermove(eX, eY)
	{
		this._cssPxToLayer(eX, eY);
	}

	pointerdown(eX, eY)
	{
		this._cssPxToLayer(eX, eY);

		this._scroll_down();

		//if (this.modal)
		this.sliderButtonsScroll.drag(this.mouseX);
	}

	_check_click()
	{
		if (this.modalMode == "")
		{
			for (const instance of this.objects)
			{
				if (instance.name !== undefined)
				{
					if(instance.containsPoint(this.mouseX, this.mouseY))
					{
						if (this._click_exist_normal(instance))
						{
							return;
						}

					}
				}
			}

			for (const instance of this.objectsTouch)
			{
				if (instance.name !== undefined)
				{
					if(instance.containsPoint(this.mouseX, this.mouseY))
					{
						this._click_exist_normal(instance);
					}
				}
			}


		}
		else
		{
			for (const instance of this.objectsModalWindow)
			{
				if (instance.name !== undefined)
				{
					if(instance.containsPoint(this.mouseX, this.mouseY))
					{
						this._click_exist_modal(instance);
					}
				}
			}
		}
	}

	_click_exist_normal(instance)
	{
		const name = instance.name;

		if (this.level == "main_menu")
		{
			if (name == "bPlay")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				if (runtime.globalVars.tutorial === 0){
					this._get_and_set_session();
					this._send_event({event: "play_game", content: {}});
				} else {
					this.rt.callFunction("tween_btn_play");
					this.rt.callFunction("tween_btn_menu_destroy");
					this.rt.callFunction("tween_attempts_block_destroy");
					this.rt.callFunction("tween_onboarding_popup");
					this.rt.callFunction("destroy_shadow");
					this._send_event({event: "go_tutorial", content: {}});
					setTimeout(() => {this.rt.callFunction("Play", "choose character");}, 1000);
				}

			}

			if (name == "bCollections")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_collections", content: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				Main.removeEventListeners();
				setTimeout(() => {this.show({level: "collections"});}, 1200);
				return true;
			}

			if (name == "bPacks")
			{		
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_shop", context: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				Main.removeEventListeners();
				setTimeout(() => {this.show({level: "packs"});}, 1200);
				return true;
			}

			if (name == "bPrizes")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_rewards", context: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				Main.removeEventListeners();
				setTimeout(() => {this.show({level: "prizes"});}, 1200);
				return true;
			}

			if (name == "bTasks")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_tasks", context: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				Main.removeEventListeners();
				setTimeout(() => {this.show({level: "tasks"});}, 1200);
				return true;
			}


			if (name == "bRating")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_rating", context: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				Main.removeEventListeners();
				setTimeout(() => {this.show({level: "rating"});}, 1200);
				return true;
			}

			if (name === "attempts")
			{
				//this._play_sound({name: "click"});
				this.modalMode = " ";
				this._send_event({event: "goto_shop", context: {}});
				this.rt.callFunction("tween_btn_play");
				this.rt.callFunction("tween_btn_menu_destroy");
				this.rt.callFunction("tween_attempts_block_destroy");
				setTimeout(() => {this.show({level: "packs"});}, 1200);
				return true;	
			}

		}

	}

}

export class API
	//singleton
{
	constructor(options)
	{
		const authorization = options.authorization;
		//const game_id = options.game_id;

		this.authorization = {"Authorization": authorization};
		//this.game_id = game_id;

		this.set_query_params();
		
		this.dev_mode = true;
	}

	async request(params)
	{
		const OPTIONS = {};
		OPTIONS["method"] = "POST";
		OPTIONS["headers"] = {"Content-Type": "application/json"};

		if ('headers' in params)
		{
			Object.assign(OPTIONS["headers"], params.headers);
		}

		if ('data' in params)
		{
			OPTIONS["body"] = JSON.stringify(params.data);
		}
	

		const response = await fetch(params.url, OPTIONS);
		return {'ok': response.ok, 'response': response};
	}

	async request2(params)
	{
		const OPTIONS = {};
		OPTIONS["method"] = "POST";
		OPTIONS["headers"] = {"Content-Type": "application/json"};

		if ('headers' in params)
		{
			Object.assign(OPTIONS["headers"], params.headers);
		}

		if ('data' in params)
		{
			OPTIONS["body"] = JSON.stringify(params.data);
		}
	

		return await fetch(params.url, OPTIONS);
	}

	async request_time_out(params)
	{
		function fetch_time_out(url, options, timeout = 60000) //вот эта функция делает запрос с тайм-аутом (но я хз как это работает).
		{
			return Promise.race([fetch(url, options),
								 new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))]);
		}

		const OPTIONS = {};
		OPTIONS["method"] = "POST";
		OPTIONS["headers"] = {"Content-Type": "application/json"};

		if ('headers' in params)
		{
			Object.assign(OPTIONS["headers"], params.headers);
		}

		if ('data' in params)
		{
			OPTIONS["body"] = JSON.stringify(params.data);
		}

		return await fetch_time_out(params.url, OPTIONS)
			.then((result) => {
			return result
		})
			.catch((e) => {
			return "time out"});
	}

	set_query_params()
	{	

		const paramsString = window.location.search;
		const searchParams = new URLSearchParams(paramsString);

		this.token = searchParams.get("token");
		
		if (this.token === null)
		{		
		
		}

	}

	async login() //только для теста (получение токена)
	{
	
		const response = await this.request({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/auth" : "https://g1.accelera.ai/api/auth",
											 'data': {"ctn": ''}});

		if (response.ok)
		{
			const DATA = await response.response.json();
			this.token =  DATA["token"];
			//console.log(this.token);
			//document.location.href = "https://preview.construct.net/local.html?ow_id=" + this.ow_id + "&checksum=" + this.checksum + "&token=" + this.token;
			document.location.href = `https://preview.construct.net${window.location.pathname}?eyJhbGciOiJIUzI1NiJ9.eyJpZCI6Ijc5ODgwMDAxODkwIiwicHJvZmlsZV9pZCI6ImlKU08xQ0gzNlprWjVJeGNibXo0IiwiYWR2YW5jZWRfaWQiOiIxNjUwNjMwMjMzODU0NCIsImdhbWVfaWQiOiJyb2NrLXBhcGVyLXNjaXNzb3JzIiwibmlja25hbWUiOiIiLCJzdWJzY3JpcHRpb24iOiJhY3RpdmUiLCJub3RpZmljYXRpb25zIjoiYWN0aXZlIiwiYWN0aXZhdGVkIjpmYWxzZSwidGltZXN0YW1wIjoxNjUwNjMwMjMzODU0LCJ1cGRhdGVfZGF0ZSI6IjIwMjItMDQtMjIgMTU6MjM6NTMiLCJkYXRlIjoiMjAyMi0wNC0yMiIsInRpbWUiOiIxNToyMyIsImRhdGV0aW1lIjoiMjAyMi0wNC0yMiAxNToyMzo1MyIsInBsYXllcl9pZCI6Ijc5ODgwMDAxODkwIiwiZmluZ2VycHJpbnQiOiIiLCJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEifQ.9oAG7vKgVY_LmDrJmxl65sJUaoZS2Js5fclNdtl2Jbs`;
		}
		else
		{
			return;
		}
	}

	_error500(data) //обработчик ошибок
	{
		const status = data["status"];

		if (status == "failed")
		{
			console.log('К сожалению, что-то пошло не так, повторите попытку позднее.');
			return true;
		}

		if (status == "token_inactive")
		{
			const href = "index.html?ow_id=" + this.ow_id + "&checksum=" + this.checksum;
			console.log('переход ' + href);
			document.location.href = href;
			return true; //не знаю, надо ли тут возвращать правду.
		}
	}

	async get_balance() //возвращает объект с балансом и счётчиками
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/counters" : "https://g1.accelera.ai/api/counters",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_games() 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/games": "https://g1.accelera.ai/api/games",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_dialogs() 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/dialogs" : "https://g1.accelera.ai/api/dialogs",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_profiles() 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/profiles" : "https://g1.accelera.ai/api/profiles",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}


	async set_avatar(avatar) 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/multiplayer/avatar/update" :  "https://g1.accelera.ai/multiplayer/avatar/update",
													  'headers': this.authorization,
													  'data': {"token": this.token,  "avatar": avatar}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_rating() 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/leaderboard" : "https://g1.accelera.ai/api/leaderboard",
													  'headers': this.authorization,
													  'data': {"token": this.token, "name" : "points"}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_rewards() //возвращает массив history/rewards
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/rewards" : "https://g1.accelera.ai/api/rewards",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_tasks() 
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/tasks" : "https://g1.accelera.ai/api/tasks",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_collections() //возвращает массив попыток
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/achievements" : "https://g1.accelera.ai/api/achievements",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_nodes() //возвращает массив серверов
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/multiplayer/nodes" : "https://g1.accelera.ai/multiplayer/nodes",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async get_partners_prizes()
	{
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/partners/get" : "https://g1.accelera.ai/api/partners/get",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;
	}

	async send_event(event, context) {

		//const key = b_state? "pack": "item";

		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/webhooks" : "https://g1.accelera.ai/api/webhooks",
													  'headers': this.authorization,
													  'data': {"token": this.token, "event":event, "context": context}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		console.log('send event' + event, context);

		const data = await response.json();
		console.log(data);

		return data;
	}

	async purchase_pack(id) //возвращает баланс
	{

		//const key = b_state? "pack": "item";

		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/packs/purchase" : "https://g1.accelera.ai/api/packs/purchase",
													  'headers': this.authorization,
													  'data': {"token": this.token, "pack":id}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		console.log('purchase pack ' + id);

		const data = await response.json();
		console.log(data);

		if (this._error500(data))
		{
			return null;
		}

		if (data["status"] == "not_enough_balance")
		{
			return "spasibo";
		}

		return data;
	}

	async purchase_score() //возвращает баланс
	{

		//const key = b_state? "pack": "item";

		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/leaderboard/purchase" : "https://g1.accelera.ai/api/leaderboard/purchase",
													  'headers': this.authorization,
													  'data': {"token": this.token, "pack":7}});

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		console.log('purchase score ');

		const data = await response.json();
		console.log(data);

		if (this._error500(data))
		{
			return null;
		}

		if (data["status"] == "not_enough_balance")
		{
			return "spasibo";
		}

		return data;
	}


	async get_free_try() 
	{	
		const response = await this.request_time_out({'url': this.dev_mode ? "https://g1-dev.accelera.ai/api/packs/free/get" : "https://g1.accelera.ai/api/packs/free/get",
													  'headers': this.authorization,
													  'data': {"token": this.token}});

		console.log('get free try');

		if (response == "time out")
		{
			console.log('time out');
			return null;
		}

		const data = await response.json();

		if (this._error500(data))
		{
			return null;
		}

		return data;

	}

	async start_game()
	{
		await Main.createNakama();	
	}

}