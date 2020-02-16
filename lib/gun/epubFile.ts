import useGun from '../../server/gun/setup';
import Bluebird from 'bluebird';
import { array_unique_overwrite } from 'array-hyper-unique';
import { IGunEpubNode } from '../types';
import Gun from 'gun';
import { ITSValueOrArray } from 'ts-type';
import { EnumIDKEYList, EnumIDKEYListString } from 'novel-downloader/src/all/const';
import { IGunChainReference } from 'gun/types/chain';
import retryGunNode from './retryGunNode';

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

export function promiseGunEpubFile<T = IGunEpubNode>(siteID: string | string[], novel_id: string | string[])
{
	return allGunEpubFile(siteID, novel_id)
		.map(node => retryGunNode<T>(node).timeout(15 * 1000).catch(e => null))
}

export function nodeGunEpubFile<T = IGunEpubNode>(siteID: string, novel_id: string): IGunChainReference<T, string, false>
{
	// @ts-ignore
	return useGun().get(siteID as EnumIDKEYListString).get(novel_id)
}

export function raceGunEpubFile(siteID: string | string[], novel_id: string | string[])
{
	return Bluebird.race<IGunEpubNode>(promiseGunEpubFile(siteID, novel_id))
		//.tap(v => console.dir(v))
	;
}
