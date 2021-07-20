import {apiUrl, apiKey, apiSecret, dataUrl} from '../config';
import axios from 'axios';
import { Base64 } from 'js-base64';

axios.defaults.baseURL = apiUrl;
axios.defaults.headers.common['Authorization'] = `Basic ${Base64.encode(apiKey + ":" + apiSecret)}`;

export const getClock = async() => {
	return await axios.get('/v1/clock').then(r => r.data);
} 

export const getSnapshot = async(symbol) => {
	console.log("Fetching Snapshot");
	console.log(axios.defaults.headers.common['Authorization']);
	console.log(`${dataUrl}/v2/stocks/${symbol}/snapshot`);
	return await axios.get(`${dataUrl}/v2/stocks/${symbol}/snapshot`).then(r => r.data);
}
