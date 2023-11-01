


const scriptsInEvents = {

		async Events_game_Event3(runtime, localVars)
		{
			const event = new CustomEvent("ready");
			document.dispatchEvent(event);
		},

		async Events_game_Event98(runtime, localVars)
		{
			localVars.data = JSON.stringify({token: localVars.token, session : localVars.session, result : runtime.globalVars.game_points});
			
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

