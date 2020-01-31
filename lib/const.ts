import { join } from "path";

export const __root = join(__dirname, '..');

export const OUTPUT_DIR = (() => {

	if (process && process.env)
	{
		if (process.env.YARN_CACHE_FOLDER)
		{
			return join(process.env.YARN_CACHE_FOLDER, 'tmp')
		}
		else if (process.env.TEMP)
		{
			return join(process.env.TEMP, 'tmp')
		}
	}

	return join(__root, '.tmp')
})();

export const __cacheMapFile = join(OUTPUT_DIR, '.novel-cache-map.json');
