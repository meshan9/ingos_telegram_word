export function color_rgb_2_one(color)
{
	return [color[0] / 255, color[1] / 255, color[2] / 255];
}

export function px_2_pt(px)
{
	return px * 0.752812499999996;
}

export async function fetching_file(fileName, runtime)
{
	const textFileUrl = await runtime.assets.getProjectFileUrl(fileName);
	const response = await fetch(textFileUrl);
	const fetchedText = await response.text();
	
	return fetchedText;
}

export function lerp(a, b, t)
{
	return a + (t * (b - a));
}

export function lerp_dt(a, b, t, dt)
{
	const nt = 1 - Math.pow(t, dt);
	return a + (nt * (b - a));
}

export function clamp(x, a, b)
{
	return Math.min(Math.max(x, a), b)
}

export async function fetching_file2(fileName, runtime, b_json=true)
{
	const textFileUrl = await runtime.assets.getProjectFileUrl(fileName);
	const response = await fetch(textFileUrl);
	let fetched = null;
	if (b_json)
	{
		fetched = await response.json();
	}
	else
	{
		fetched = await response.text();
	}
	
	return fetched;
}

export function copy_to_buffer(text)
{
	navigator.clipboard.writeText(text).then(() => {console.log(`copy to buffer:\n${text}`);}).catch(err => {console.log('Something went wrong copy to buffer:\n${text}', err);});
}


export function fade(inTime, waitTime, outTime, currentTime, gameTime)
{
	const end = inTime + waitTime + outTime;
	const t = gameTime - currentTime;

	if (t > end)
	{
		return -1;
	}
	
	return clamp(Math.min(t / inTime, (t - end) / (-outTime)), 0, 1);
}