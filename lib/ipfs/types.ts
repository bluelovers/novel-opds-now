import { ITSPartialRecord } from 'ts-type';
import CID from 'cids';

export type IFill<T, U> = T & ITSPartialRecord<Exclude<keyof U, keyof T>, void>
export type IOr<A extends any[]> =
	A extends [infer T1, infer T2] ? IFill<T1, T2> | IFill<T2, T1>
		: A extends [infer T1, infer T2, infer T3] ? IFill<T1, T2 & T3> | IFill<T2, T1 & T3> | IFill<T3, T1 & T2>
			: never

export interface IPubSubBase
{
	peers?: string[]
}

export interface IPubSubEpub extends IPubSubBase
{
	siteID: string;
	novelID: string | number;
	data: {
		path: string,
		cid: string | CID,
		size: number,
	};
}

export enum EnumPubSubHello
{
	HELLO = 1,
	HELLO_AGAIN,
	HELLO_REPLY,
}

export interface IPubSubHello extends IPubSubBase
{
	peerID: string,
	type: EnumPubSubHello,
}
