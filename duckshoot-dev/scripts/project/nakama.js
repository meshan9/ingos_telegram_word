import {LoadScript} from "./scriptLoad.js";
import * as Main from "./main.js";


export default class Nakama {

	constructor()
	{
		this.runtime = globalThis.runtime;
		let client;
		let session;
		let socket;
		let id = "player-1";
		let username = Main.apiVars.profiles["profile_id"];
		let account;
		let authToken;
		let refreshToken;
		let matchId;
		let ticket;
		let secure = true; // Enable if server is run with an SSL certificate
		let trace = false;

		this.connect();
	}



	async _load_nakama_js()
	{
		const sdkAvailable = await LoadScript("nakama-js.iife.js");

		if (sdkAvailable)
		{
			console.log("Do work with the SDK");
		}
		else
		{
			console.log("The SDK is not available");
		}
	}


	async connect(){

		await this._load_nakama_js();

		this.client = new nakamajs.Client("hJBpL31CWCzohVYXWV9MEm5HNwS86xLv", Main.apiVars.node, 7350, true);
		this.client.ssl = true;

		this.secure = true;

		this.socket = this.client.createSocket(this.secure, this.trace);
		this.getSession().then((_session) => {
			return this.createSocketConnection(this.session)
		})

		setTimeout(() => {this.findOrCreateMatch();}, 2000);
	}

	async getSession() {
		try {
			this.session = await this.client.authenticateCustom(Main.apiVars.profiles["profile_id"], true, Main.apiVars.profiles["profile_id"], {})
			this.authToken = this.session.token;
			this.refreshToken = this.session.refresh_token;
			console.info("Successfully authenticated:", this.session);
			this.client.timeout = 10;
			Main.apiVars.userID = this.session["user_id"];
			runtime.globalVars.playerID = this.session["user_id"];
			console.log(runtime.globalVars.playerID);
			return this.session;
		}
		catch (err) {
			console.log("Error authenticating user: %o:%o", err);
		}
	}

	async createSocketConnection(sess) {
		let appearOnline = true;
		let connectionTimeout = 30;
		await this.socket.connect(sess, appearOnline, connectionTimeout);


		this.socket.ondisconnect = function (event) {
			console.log("Disconnected from the server. Event:", JSON.stringify(event));
			if (runtime.globalVars.b_buttons_actives === 1){
				runtime.globalVars.b_buttons_actives = 0;
				runtime.callFunction("fail_response");
			}
		};
		this.socket.onnotification = function (notification) {
			console.log("Received notification:", JSON.stringify(notification));
		};
		this.socket.onchannelpresence = function (presence) {
			console.log("Received presence update:", JSON.stringify(presence));
		};
		this.socket.onchannelmessage = function (message) {
			console.log("Received new chat message:", JSON.stringify(message));
		};
		this.socket.onmatchdata = function (matchdata) {
			console.log("Received match data: ", JSON.stringify(matchdata));
			console.log(matchdata["data"]["status"]);
			
			switch (matchdata["data"]["status"]) {
			
				case ("pending") : {
					runtime.globalVars.max_players_count = matchdata["data"]["maxPlayers"];
					runtime.globalVars.counter_frame = matchdata["data"]["presences"];
					runtime.callFunction("create_players_counter");
					setTimeout(() => {runtime.callFunction("set_counter_frame", runtime.globalVars.counter_frame);}, 1000);
					if (matchdata["data"]["presences"] ===  matchdata["data"]["maxPlayers"]-2 || matchdata["data"]["presences"] ===  matchdata["data"]["maxPlayers"]-1 || matchdata["data"]["presences"] ===  matchdata["data"]["maxPlayers"]){
						runtime.callFunction("destroy_wait_exit");			
					} 	
					break;
				}
				case ("starting") : {
					let myId = Main.apiVars.userID;
					Main.apiVars.enemies = matchdata["data"].presences.filter(player => player.userId !== myId);
					setTimeout(() => {runtime.callFunction("parse_enemies_");}, 0);
					Main.apiVars.match_gifts = matchdata["data"]["gifts"];
					setTimeout(() => {runtime.callFunction("parse_gifts_onstart");}, 0);
					setTimeout(() => {runtime.callFunction("start_game_multi");}, 1000);
					break;
				}
				case ("hide_gifts") : {
					runtime.callFunction("destroy_prizes_start");
					runtime.callFunction("animation_sand",100, 65);
					runtime.callFunction("animation_round",0);
					break;
				}
				case ("gameplay") : {
					runtime.globalVars.players_count = matchdata["data"]["presences"].length;
					console.log( matchdata["data"]["presences"].length);
					runtime.callFunction("set_left_counter",0);
					setTimeout(() => {runtime.callFunction("set_game_state","start");}, 100);
					break;
				}
				case ("figure") : {
					if (matchdata["data"]["presences"]["userId"] !== Main.apiVars.userID){
						runtime.callFunction("create_ready", matchdata["data"]["presences"]["userId"]);
					}
					break;
				}
				
				case ("standoff") : {
					let myId = Main.apiVars.userID;
					Main.apiVars.enemies = matchdata["data"].decision.filter(player => player.userId !== myId);
					Main.apiVars.player = matchdata["data"].decision.filter(player => player.userId === myId);
					Main.apiVars.lefts = matchdata["data"]["left"];
					setTimeout(() => {runtime.callFunction("parse_player");}, 0);
					setTimeout(() => {runtime.callFunction("parse_enemies_");}, 0);	
					setTimeout(() => {runtime.callFunction("parse_lefts");}, 0);	
					if (matchdata["data"]["decision"][0]["round_result"] === "standoff"){
						
						if (matchdata["data"]["round"]["standoff"] === 5){
							console.log("5 ничьих подряд. Случайный игрок выбывает.");
							setTimeout(() => {runtime.callFunction("animation_loose");}, 100);
							runtime.globalVars.round_count_timer = matchdata["data"]["round"]["round"];
							setTimeout(() => {runtime.callFunction("set_round_count", matchdata["data"]["round"]["round"]);}, 1000);
						} else {
							runtime.callFunction("set_round_count", 5);
						}
						console.log("st_count ",matchdata["data"]["round"]["standoff"]);
						
					} else {
						runtime.callFunction("set_round_count", matchdata["data"]["round"]["round"]);
						runtime.globalVars.round_count_timer = matchdata["data"]["round"]["round"];
						console.log("rct ", runtime.globalVars.round_count_timer);
						console.log(matchdata["data"]["round"]["round"]);
					}
					runtime.callFunction("stop_timer_round");
					setTimeout(() => {runtime.callFunction("destroy_choice", 0);}, matchdata["data"]["round"]["standoff"] === 5 ? 2000 : 1000);
					runtime.callFunction("set_add_to_zero");
					setTimeout(() => {runtime.callFunction("create_hands_result");}, matchdata["data"]["round"]["standoff"] === 5 ? 2000 : 1000);	
					runtime.callFunction("set_left_counter",0);
					runtime.callFunction("set_add_to_zero");
					setTimeout(() => {runtime.callFunction("show_results");}, matchdata["data"]["round"]["standoff"] === 5 ? 2000 : 1000);					
					break;
				}
				
				case ("results") : {
					let myId = Main.apiVars.userID;
					Main.apiVars.enemies = matchdata["data"].decision.filter(player => player.userId  !== myId);
					Main.apiVars.player = matchdata["data"].decision.filter(player => player.userId === myId);
					Main.apiVars.lefts = matchdata["data"]["left"];
					runtime.globalVars.b_gameover = 1;
					runtime.callFunction("request_prize_description");
					setTimeout(() => {runtime.callFunction("parse_lefts");}, 0);
					setTimeout(() => {runtime.callFunction("parse_player");}, 0);
					setTimeout(() => {runtime.callFunction("parse_enemies_");}, 0);	
					if(matchdata["data"]["reason"] === "standoff"){
						setTimeout(() => {runtime.callFunction("animation_loose");}, 100);
						console.log("5 ничьих подряд. Случайный игрок выбывает.");
					} 
					runtime.callFunction("stop_timer_round");
					setTimeout(() => {runtime.callFunction("destroy_choice", 0);}, matchdata["data"]["reason"] === "standoff" ? 3500 : 1000);
					runtime.callFunction("set_add_to_zero");
					setTimeout(() => {runtime.callFunction("create_hands_result");}, matchdata["data"]["reason"] === "standoff" ? 3500 : 1000);	
					runtime.callFunction("set_add_to_zero");
					setTimeout(() => {runtime.callFunction("show_results");}, matchdata["data"]["reason"] === "standoff" ? 3500 : 1000);
					Main.gui._get_and_set_partners_prizes();
					break;
				}
			}
		};
		this.socket.onmatchpresence = function (matchpresence) {
			console.log("Received match presence update:", JSON.stringify(matchpresence));
			if (matchpresence["leaves"] !== undefined){
				setTimeout(() => {runtime.callFunction("set_counter_frame", runtime.globalVars.counter_frame - matchpresence["leaves"].length);}, 100);
				if (runtime.globalVars.counter_frame - matchpresence["leaves"].length === 3){
					runtime.callFunction("create_exit_from_wait");	
				}
			}	
		};
		this.socket.onmatchmakermatched = function (matchmakerMatched) {
			console.log("Received matchmaker update:", JSON.stringify(matchmakerMatched));
			const matchId = null;
			this.socket.joinMatch(matchId, matchmakerMatched.token);
		};
		this.socket.onstatuspresence = function (statusPresence) {
			console.log("Received status presence update:", JSON.stringify(statusPresence));
		};
		this.socket.onstreampresence = function (streamPresence) {
			console.log("Received stream presence update:", JSON.stringify(streamPresence));
		};
		this.socket.onstreamdata = function (streamdata) {
			console.log("Received stream data:", JSON.stringify(streamdata));
		}
	}

	async logOut(){
		if (this.session !== undefined) {
			await this.client.sessionLogout(this.session);
			console.log('Logged out')
		} else {
			console.log('User is not logged in')
		}
	}

	async checkSession(){
		// Check whether a session has expired or is close to expiry.
		if (this.session.isexpired || this.session.isexpired(Date.now + 1)) {
			try {
				// Attempt to refresh the existing session.
				this.session = await this.client.sessionRefresh(this.session);
			} catch (error) {
				// Couldn't refresh the session so reauthenticate.
				this.session = await this.client.authenticateEmail(this.email, this.password);
				const refreshToken = this.session.refresh_token;
			}

			const authToken = this.session.token;
		} else {
			console.log('Session is alive')
		}
	}


	async createMatch() {
		let response = await this.socket.createMatch();
		this.matchID = response.match_id
		console.log("Match data:", response)
	}

	async getMatch() {
		await this.createMatch();
	}

	async matchMaker(){
		const query = "*";
		const minCount = 2;
		const maxCount = 2;


		const ticket = await this.socket.addMatchmaker(query, minCount, maxCount);
		console.log('Ticket:', ticket);
	}


	async getAccount(){
		this.account = await this.client.getAccount(this.session);
		let user = this.account.user;
		let username = user.username;
		let avatarUrl = user.avatarUrl;
		let userId = user.id;
		let wallet = this.account.wallet;
		console.log('Got account info:', user, username, avatarUrl, userId);
		console.log('Wallet is', JSON.parse(this.account.wallet));
		return account;
	}
	async updateAccount(mate){
		await this.client.updateAccount(this.session, {avatar_url : mate});
		console.log("Account avatar was updated:", this.account)
	}
	async listStorage(){
		const limit = 100;
		const objects = await this.client.listStorageObjects(this.session, "collections", this.session.user_id, limit);
		console.log("Storage is:", objects)
		return objects;
	}
	async writeStorage(){
		const object_ids = await this.client.writeStorageObjects(this.session, [
			{
				"collection": "collections",
				"key": "gold",
				"value": { "status": "completed" }
			}, {
				"collection": "stats",
				"key": "skills",
				"value": { "skill": 24 }
			}
		]);
		console.info("Successfully stored objects: ", object_ids);
	}
	async findOrCreateMatch(){
		var response = await this.client.rpc(this.session, "findBasicMatch", {});
		console.log('Matches:', response.payload);
		if (response.payload !== undefined) {
			this.matchId = response.payload;
			let match = await this.socket.joinMatch(this.matchId);
			console.log('Joined a match:', this.matchId)
		}
	}
	
	async logOutMatch(){
		let response = await this.socket.leaveMatch(this.matchId);
		console.log('logOut:', response);
	}
	
	async sendData(figure){
		let data = {
			"figure" : figure
		}
		await this.socket.sendMatchState(this.matchId, 1, data);
	}
	

}