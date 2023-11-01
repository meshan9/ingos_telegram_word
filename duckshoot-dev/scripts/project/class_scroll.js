import * as Utils from "./utilities.js";

export default class Scroll
//singleton
{
	constructor(options)
	{
		const {size} = options;
		
		this.rt = globalThis.runtime;
		this.size = size;
		this.scrollY = 0;
		this.scrollCurrent = 0;
		this.scrollSpeed = 0;
		this.scrollMinimum = 0;
		this.scrollRound = 0;
		this.b_scroll = false;
		this.objectsScroll = [];
	}
	
	drag(coord)
	{
		this.scrollCurrent = coord;
		this.b_scroll = true;
	}
	
	drop()
	{
		this.b_scroll = false;
	}
	
	always(coord)
	{
		if (this.b_scroll)
		{
			this.scrollSpeed = coord - this.scrollCurrent;
			this.drag(coord);
		}
		else
		{
			const SPEED = 0.00001;
			
			if (this.scrollRound === 0)
			{
				this.scrollY = Utils.lerp_dt(this.scrollY, Utils.clamp(this.scrollY, Math.max(this.scrollMinimum - this.size, 0) * -1, 0), SPEED, this.rt.dt);
			}
			else
			{
				this.scrollY = Utils.lerp_dt(this.scrollY, Math.round(Utils.clamp(this.scrollY, Math.max(this.scrollMinimum - this.size, 0) * -1, 0) / this.scrollRound) * this.scrollRound, SPEED, this.rt.dt);
			}
			
			this.scrollSpeed = Utils.lerp_dt(this.scrollSpeed, 0, 0.00001, this.rt.dt);
			/*if (Math.abs(this.scrollSpeed) < 0.00001) //я не знаю почему тут именно такое значение.
			{
				this.scrollSpeed = 0;
			}*/
		}
		this.scrollY += this.scrollSpeed;
		
		this._object_scrolling();
	}
	
	_object_scrolling()
	{
		for (const object of this.objectsScroll)
		{
			object.y = object.startY + this.scrollY;
		}
	}
	
	reset(options)
	{
		const {scrollRound = 0} = options;
		
		this.objectsScroll = [];
		this.scrollY = 0;
		this.scrollRound = scrollRound;
	}
}