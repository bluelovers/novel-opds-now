import useGun from '../../server/gun/setup';
import Bluebird from 'bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { IGunEpubNode } from '../types';
import Gun from 'gun';
import { ITSValueOrArray } from 'ts-type';
import { EnumIDKEYList, EnumIDKEYListString } from 'novel-downloader/src/all/const';

export function makeArrayEntrys(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>)
{
	if (!Array.isArray(siteID))
	{
		siteID = [siteID];
	}
	if (!Array.isArray(novel_id))
	{
		novel_id = [novel_id];
	}

	siteID = array_unique_overwrite(siteID.map(v => String(v)));
	novel_id = array_unique_overwrite(novel_id.map(v => String(v)));

	return siteID
		.reduce((a, siteID) => {


			siteID && (novel_id as string[]).forEach(novel_id => {

				novel_id && a.push([siteID, novel_id])
			});

			return a;
		}, [] as [string, string][])
}

export function allGunEpubFile(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>)
{
	if (!Array.isArray(siteID))
	{
		siteID = [siteID];
	}
	if (!Array.isArray(novel_id))
	{
		novel_id = [novel_id];
	}

	siteID = array_unique_overwrite(siteID.map(v => String(v)));
	novel_id = array_unique_overwrite(novel_id.map(v => String(v)));

	return (siteID as EnumIDKEYListString[])
		.reduce((a, siteID) => {


			siteID && (novel_id as string[]).forEach(novel_id => {

			//console.log(siteID, novel_id);

				novel_id && a.push(nodeGunEpubFile(siteID, novel_id))
		});

		return a;
	}, [] as ReturnType<typeof nodeGunEpubFile>[])
}

export function promiseGunEpubFile<T>(siteID: string | string[], novel_id: string | string[])
{
	return allGunEpubFile(siteID, novel_id).map(node => node.then() as Promise<T>)
}

export function nodeGunEpubFile(siteID: string, novel_id: string)
{
	return useGun().get(siteID).get(novel_id)
}

export function raceGunEpubFile(siteID: string | string[], novel_id: string | string[])
{
	return Bluebird.race<IGunEpubNode>(promiseGunEpubFile(siteID, novel_id))
		//.tap(v => console.dir(v))
	;
}
