export default class WS
//singleton
{
	constructor(options)
	{
		const {url} = options;
		
		this.debug = false;
		
		this.url = url;
		
		this._connect();
	}
	
	send(data)
	{
		if (this.debug)
		{
			console.groupCollapsed("Отправляем данные на сервер");
			console.log(data);
			console.groupEnd();
		}
		
		this.socket.send(data);
	}
	
	close(code, reason)
	{
		this.socket.close(code, reason);
	}
	
	_connect()
	{
		const socket = new WebSocket(this.url);
		this.socket = socket;
		
		const self = this;
		
		socket.onopen = function(e) {
			self._console_log(`[open] Соединение установлено`);
			
			const eve = new CustomEvent("ws_onopen");
  			document.dispatchEvent(eve);
		};
		
		socket.onmessage = function(event) {
			self._console_log(`[message] Данные получены с сервера: ${event.data}`);
			
			const eve = new CustomEvent("ws_onmessage", {detail: event.data});
  			document.dispatchEvent(eve);
		};
		
		socket.onclose = function(event) {
			if (event.wasClean)
			{
				self._console_log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
			}
			else
			{
				self._console_log(`[close] Соединение прервано`);
				self._connect();
			}
		};
		
		socket.onerror = function(error) {
			self._console_log(`[error] ${error.message}`);
		};
	}
	
	_console_log(data)
	{
		if (this.debug)
		{
			console.log(data);
		}
	}
}