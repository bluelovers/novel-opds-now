
import { join } from 'path';
import Bluebird from 'bluebird';
import { outputJSON, readJSON } from 'fs-extra';
import { __root } from '../../const';
import { IIPFSControllerDaemon } from '../types';

export async function backupIdentity(ipfsd: IIPFSControllerDaemon)
{
	/*
	// HTTPError: cannot show or change private key through API
	return ipfs.config.get('Identity')
		.then(result => {
			outputJSON(join(__root, 'test', '.identity.json'), result)
		})
	;
	 */

	return readJSON(join(ipfsd.path, 'config'))
		.then(config => outputJSON(join(__root, 'test', '.identity.json'), config["Identity"], {
			spaces: 2,
		}))
}

export function restoreIdentity(ipfsd: IIPFSControllerDaemon)
{
	return Bluebird.props({
		Identity: readJSON(join(__root, 'test', '.identity.json')),
		config: readJSON(join(ipfsd.path, 'config'))
	}).then(({
		Identity,
		config,
	}) => {
		Identity.PeerID.length && Identity.PrivKey.length;

		config["Identity"] = Identity;

		return outputJSON(join(ipfsd.path, 'config'), config, {
			spaces: 2,
		})
	})
}
