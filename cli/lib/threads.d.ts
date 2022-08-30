import 'v8-compile-cache';
import Bluebird from 'bluebird';
declare const handleAsync: (id: string | number, IDKEY: string, outputDir?: string) => Bluebird<boolean>;
export default handleAsync;
