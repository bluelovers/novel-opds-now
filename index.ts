/**
 * Created by user on 2020/1/28.
 */
import micro, { RequestHandler, buffer, text, json } from 'micro';
import Router from 'micro-ex-router';
import express from 'express';

let router = Router();

router
	// Use middlewares available for all requests
	.use((req, res) => console.log(req.url))
	.get('/*', () => 'Welcome to micro')
;

const app = express();

app.use(micro(router));

export default app

//export default <RequestHandler>((req, res) => {
//	res.end('77788')
//})
