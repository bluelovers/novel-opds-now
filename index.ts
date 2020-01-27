/**
 * Created by user on 2020/1/28.
 */
import { RequestHandler, buffer, text, json } from 'micro';

export default <RequestHandler>((req, res) => {
	res.end('77788')
})
