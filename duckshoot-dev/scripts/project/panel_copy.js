class PanelCopy
{
	constructor()
	{
		this.container = null;
		
		this.panel = null;
		this.text = null;
		this.gameTime = 0;
		this.b_active = false;
	}
	
	init(options)
	{
		this.container = options;
	}
	
	always()
	{
		if (!this.b_active)
		{
			return;
		}
		
		const {fade, layer} = this.container;
		
		const opacity = fade(0, 1.5, 0.5, this.gameTime, runtime.gameTime);
		runtime.layout.getLayer(layer).opacity = opacity;
		
		if (opacity === -1)
		{
			this.b_active = false;
			this._destroy();
		}
	}
	
	show()
	{
		if (this.b_active)
		{
			return;
		}
		
		this.b_active = true;
		
		this.panel = this._create_panel();
		this.text = this._create_text();
		
		this.gameTime = runtime.gameTime;
	}
	
	_create_panel()
	{
		const {panel, layer, coords} = this.container;
		
		const panelInstance = panel.createInstance(layer, coords.x, coords.y);
		panelInstance.width = coords.w;
		panelInstance.height = coords.h;
		return panelInstance;
	}
	
	_create_text()
	{
		const {text, layer, coords, textColor, textSize, textFont} = this.container;
		
		const textInstance = text.createInstance(layer, coords.x, coords.y);
		textInstance.width = coords.w;
		textInstance.height = coords.h;
		textInstance.text = `Промокод скопирован в буфер обмена`;
		textInstance.horizontalAlign = "center";
		textInstance.verticalAlign = "center";
		textInstance.fontColor = textColor;
		textInstance.sizePt = textSize;
		textInstance.fontFace = textFont;
		return textInstance;
	}
	
	_destroy()
	{
		this.panel.destroy();
		this.panel = null;
		
		this.text.destroy();
		this.text = null;
	}
}

const panelCopy = new PanelCopy();
export default panelCopy;