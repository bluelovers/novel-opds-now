import useGun from '../../server/gun/setup';
import Bluebird from 'bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { IGunEpubNode } from '../types';
import Gun from 'gun';
import { ITSValueOrArray } from 'ts-type';

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


			(novel_id as string[]).forEach(novel_id => {

				a.push([siteID, novel_id])
			});

			return a;
		}, [] as [string, string][])
}

export function allGunEpubFile(siteID: ITSValueOrArray<string>, novel_id: ITSValueOrArray<string | number>): ReturnType<typeof Gun>[]
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

	let gun = useGun();

	return siteID
		.reduce((a, siteID) => {


		(novel_id as string[]).forEach(novel_id => {

			//console.log(siteID, novel_id);

			// @ts-ignore
			a.push(gun.get('epub-file').get(siteID).get(novel_id))
		});

		return a;
	}, [])
}

export function promiseGunEpubFile<T>(siteID: string | string[], novel_id: string | string[])
{
	return allGunEpubFile(siteID, novel_id).map(node => node.then() as Promise<T>)
}

export function raceGunEpubFile(siteID: string | string[], novel_id: string | string[])
{
	return Bluebird.race<IGunEpubNode>(promiseGunEpubFile(siteID, novel_id))
		//.tap(v => console.dir(v))
	;
}
